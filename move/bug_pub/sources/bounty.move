// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module bug_pub::bounty {
    use std::string::String;

    use sui::balance::{Self, Balance};
    use sui::clock::Clock;
    use sui::coin::{Self, Coin};
    use sui::dynamic_field as df;
    use sui::sui::SUI;
    use sui::object_table::{Self, ObjectTable};
    
    use bug_pub::moderator::{Moderator};
    use bug_pub::audit::{Self, Audit};

    const EInvalidPermission: u64 = 1;
    const ENotEnoughBalance: u64 = 2;
    const ENotExists: u64 = 3;

    const MAX_REVIEWERS_TO_REWARD: u64 = 10;

    /// A capability that can be used to perform admin operations on a bounty
    public struct AdminCap has key, store {
        id: UID,
        bounty_id: ID
    }

    /// Represents a bounty
    public struct Bounty has key, store {
        id: UID,
        reward_pool: Balance<SUI>,
        reward: u64,
        top_audits: vector<ID>,
        audits: ObjectTable<ID, Audit>,
        name: String,
        package_id: String,
        network: String,
        chain: String,
        version: String,
        pgp_key_blob_id: String,
    }

    /// Represents a proof of audt that can be used to write an audit with higher score
    public struct ProofOfAudit has key {
        id: UID,
        bounty_id: ID,
    }

    /// Represents an audit record
    public struct AuditRecord has store, drop {
        owner: address,
        time_issued: u64,
    }

    #[allow(lint(self_transfer))]
    /// Creates a new bounty
    public fun create_bounty(
        name: String,
        package_id: String,
        network: String,
        chain: String,
        version: String,
        reward: u64,
        pgp_key_blob_id: String,
        ctx: &mut TxContext,
    ): ID {
        let id = object::new(ctx);
        let bounty_id = id.to_inner();
        let bounty = Bounty {
            id,
            reward,
            reward_pool: balance::zero(),
            audits: object_table::new(ctx),
            top_audits: vector[],
            name,
            package_id,
            network,
            chain,
            version,
            pgp_key_blob_id
        };

        let admin_cap = AdminCap {
            id: object::new(ctx),
            bounty_id
        };

        transfer::share_object(bounty);
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
        bounty_id
    }

    /// Writes a new audit
    public fun write_new_audit(
        bounty: &mut Bounty,
        owner: address,
        title: String,
        content: String,
        severity: String,
        clock: &Clock,
        poa: ProofOfAudit,
        ctx: &mut TxContext
    ) {
        assert!(poa.bounty_id == bounty.id.to_inner(), EInvalidPermission);
        let ProofOfAudit { id, bounty_id: _ } = poa;
        object::delete(id);
        let audit = audit::new_audit(
            owner,
            bounty.id.to_inner(),
            title,
            content,
            severity,
            true,
            clock,
            ctx
        );
        bounty.add_audit(audit, owner );
    }

    /// Writes a new audit without proof of experience
    public fun write_new_audit_without_poa(
        bounty: &mut Bounty,
        owner: address,
        title: String,
        content: String,
        severity: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let audit = audit::new_audit(
            owner,
            bounty.id.to_inner(),
            title,
            content,
            severity,
            false,
            clock,
            ctx
        );
        bounty.add_audit(audit, owner );
    }

    /// Adds a audit to the bounty
    fun add_audit(
        bounty: &mut Bounty,
        audit: Audit,
        owner: address
    ) {
        let id = audit.get_id();
        let total_score = audit.get_total_score();
        let time_issued = audit.get_time_issued();
        bounty.audits.add(id, audit);
        bounty.update_top_audits(id, total_score);
        df::add(&mut bounty.id, id, AuditRecord { owner, time_issued });
    }

    /// Returns true if top_audits should be updated given a total score
    fun should_update_top_audits(
        bounty: &Bounty,
        total_score: u64
    ): bool {
        let len = bounty.top_audits.length();
        len < MAX_REVIEWERS_TO_REWARD
            || total_score > bounty.get_total_score(bounty.top_audits[len - 1])
    }

    /// Prunes top_audits if it exceeds MAX_REVIEWERS_TO_REWARD
    fun prune_top_audits(
        bounty: &mut Bounty
    ) {
        while (bounty.top_audits.length() > MAX_REVIEWERS_TO_REWARD) {
            bounty.top_audits.pop_back();
        };
    }

    /// Updates top_audits if necessary
    fun update_top_audits(
        bounty: &mut Bounty,
        audit_id: ID,
        total_score: u64
    ) {
        if (bounty.should_update_top_audits(total_score)) {
            let idx = bounty.find_idx(total_score);
            bounty.top_audits.insert(audit_id, idx);
            bounty.prune_top_audits();
        };
    }

    /// Finds the index of a audit in top_audits
    fun find_idx(bounty: &Bounty, total_score: u64): u64 {
        let mut i = bounty.top_audits.length();
        while (0 < i) {
            let audit_id = bounty.top_audits[i - 1];
            if (bounty.get_total_score(audit_id) > total_score) {
                break
            };
            i = i - 1;
        };
        i
    }

    /// Gets the total score of a audit
    fun get_total_score(bounty: &Bounty, audit_id: ID): u64 {
        bounty.audits[audit_id].get_total_score()
    }

    /// Distributes rewards to specific audit
    public fun distribute_reward(
        cap: &AdminCap,
        bounty: &mut Bounty,
        audit_id: ID,
        reward_amount: u64,
        ctx: &mut TxContext
    ) {
        // assert cap object ID matches current bounty ID
        assert!(cap.bounty_id == bounty.id.to_inner(), EInvalidPermission);
        // check balance
        assert!(bounty.reward_pool.value() >= (reward_amount), ENotEnoughBalance);
        // check if audit exists in bounty 
        assert!(bounty.audits.contains(audit_id), ENotExists);

        let balance = bounty.reward_pool.split(reward_amount);
        let reward = coin::from_balance(balance, ctx);
        let record = df::borrow<ID, AuditRecord>(&bounty.id, *&audit_id);
        transfer::public_transfer(reward, record.owner);
    }

    /// Adds coins to reward pool
    public fun top_up_reward(
        bounty: &mut Bounty,
        coin: Coin<SUI>
    ) {
        bounty.reward_pool.join(coin.into_balance());
    }

    /// Mints a proof of experience for a auditor
    public fun generate_proof_of_audit(
        cap: &AdminCap,
        bounty: &Bounty,
        recipient: address,
        ctx: &mut TxContext
    ) {
        // generate an NFT and transfer it to auditor who can use it to write an audit with higher score
        assert!(cap.bounty_id == bounty.id.to_inner(), EInvalidPermission);
        let poa = ProofOfAudit {
            id: object::new(ctx),
            bounty_id: cap.bounty_id
        };
        transfer::transfer(poa, recipient);
    }

    /// Removes a audit (only moderators can do this)
    public fun remove_audit(
        _: &Moderator,
        bounty: &mut Bounty,
        audit_id: ID,
    ) {
        assert!(bounty.audits.contains(audit_id), ENotExists);
        let _record: AuditRecord = df::remove(&mut bounty.id, audit_id);
        let (contains, i) = bounty.top_audits.index_of(&audit_id);
        if (contains) {
            bounty.top_audits.remove(i);
        };
        bounty.audits.remove(audit_id).delete_audit();
    }

    /// Reorder top_audits after a audit is updated
    fun reorder(
        bounty: &mut Bounty,
        audit_id: ID,
        total_score: u64
    ) {
        let (contains, idx) = bounty.top_audits.index_of(&audit_id);
        if (!contains) {
            bounty.update_top_audits(audit_id, total_score);
        } else {
            // remove existing audit from vector and insert back
            bounty.top_audits.remove(idx);
            let idx = bounty.find_idx(total_score);
            bounty.top_audits.insert(audit_id, idx);
        }
    }

    /// Upvotes a audit
    public fun upvote(bounty: &mut Bounty, audit_id: ID) {
        let audit = &mut bounty.audits[audit_id];
        audit.upvote();
        bounty.reorder(audit_id, audit.get_total_score());
    }
}
