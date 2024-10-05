// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module bug_pub::audit {
    use std::string::String;

    use sui::clock::Clock;

    const EInvalidContentLen: u64 = 1;

    const MIN_REVIEW_CONTENT_LEN: u64 = 5;
    const MAX_REVIEW_CONTENT_LEN: u64 = 1000;

    /// Represents a audit of a bounty
    public struct Audit has key, store {
        id: UID,
        owner: address,
        bounty_id: ID,
        title: String,
        content: String,
        severity: String,
        // intrinsic score
        len: u64,
        // extrinsic score
        votes: u64,
        time_issued: u64,
        // proof of audit
        has_poa: bool,
        // total score
        total_score: u64,
    }

    /// Creates a new audit
    public(package) fun new_audit(
        owner: address,
        bounty_id: ID,
        title: String,
        content: String,
        severity: String,
        has_poa: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ): Audit {
        let len = content.length();
        assert!(len > MIN_REVIEW_CONTENT_LEN && len <= MAX_REVIEW_CONTENT_LEN, EInvalidContentLen);
        let mut new_audit = Audit {
            id: object::new(ctx),
            owner,
            bounty_id,
            title,
            content,
            severity,
            len,
            votes: 0,
            time_issued: clock.timestamp_ms(),
            has_poa,
            total_score: 0,
        };
        new_audit.total_score = new_audit.calculate_total_score();
        new_audit
    }

    /// Deletes a audit
    public(package) fun delete_audit(audit: Audit) {
        let Audit {
            id, owner: _, bounty_id: _, title: _, content: _, severity: _, len: _, votes: _, time_issued: _,
            has_poa: _, total_score: _ 
        } = audit;
        object::delete(id);
    }

    /// Calculates the total score of a audit
    fun calculate_total_score(aud: &Audit): u64 {
        let mut intrinsic_score: u64 = aud.len;
        intrinsic_score = std::u64::min(intrinsic_score, 150);
        let extrinsic_score: u64 = 10 * aud.votes;
        let vm: u64 = if (aud.has_poa) { 2 } else { 1 };
        (intrinsic_score + extrinsic_score) * vm
    }

    /// Updates the total score of a audit
    fun update_total_score(aud: &mut Audit) {
        aud.total_score = aud.calculate_total_score();
    }

    /// Upvotes a audit
    public fun upvote(aud: &mut Audit) {
        aud.votes = aud.votes + 1;
        aud.update_total_score();
    }

    public fun get_id(aud: &Audit): ID {
        aud.id.to_inner()
    }

    public fun get_total_score(aud: &Audit): u64 {
        aud.total_score
    }

    public fun get_time_issued(aud: &Audit): u64 {
        aud.time_issued
    }
}
