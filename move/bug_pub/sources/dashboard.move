// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module bug_pub::dashboard {
    use std::string::String;

    use sui::dynamic_field as df;

    /// Dashboard is a collection of bountys
    public struct Dashboard has key, store {
        id: UID,
        bounty_type: String
    }

    /// Create a new dashboard
    public fun create_dashboard(
        bounty_type: String,
        ctx: &mut TxContext,
    ) {
        let db = Dashboard {
            id: object::new(ctx),
            bounty_type
        };
        transfer::share_object(db);
    }

    public fun register_bounty(db: &mut Dashboard, bounty_id: ID) {
        df::add(&mut db.id, bounty_id, bounty_id);
    }
}
