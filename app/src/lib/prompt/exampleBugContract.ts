// app/src/lib/prompt/exampleBugContract.ts
export const exampleBugContract =
  "Line: 0\tmodule 0x8ec24188ca1d4fb80dc8254a6a142256c8a76ec1cd0251c5a128979919d75509::main {\nLine: 1\t \nLine: 2\t    // ----- Use Statements -----\nLine: 3\t \nLine: 4\t    use sui::object;\nLine: 5\t    use sui::balance;\nLine: 6\t    use sui::bag;\nLine: 7\t    use sui::tx_context;\nLine: 8\t    use sui::transfer;\nLine: 9\t    use std::vector;\nLine: 10\t    use sui::coin;\nLine: 11\t    use sui::clock;\nLine: 12\t \nLine: 13\t    // ----- Structs -----\nLine: 14\t \nLine: 15\t    struct Leaderboard<phantom T0> has store, key {\nLine: 16\t        id: object::UID,\nLine: 17\t        creator: address,\nLine: 18\t        reward: balance::Balance<T0>,\nLine: 19\t        claimed_reward_amount: u64,\nLine: 20\t        max_leaderboard_size: u64,\nLine: 21\t        top_projects: vector<object::ID>,\nLine: 22\t        top_balances: vector<u64>,\nLine: 23\t        end_timestamp_ms: u64,\nLine: 24\t    }\nLine: 25\t \nLine: 26\t    struct Project<phantom T0> has store, key {\nLine: 27\t        id: object::UID,\nLine: 28\t        leaderboard_id: object::ID,\nLine: 29\t        balance: balance::Balance<T0>,\nLine: 30\t    }\nLine: 31\t \nLine: 32\t    struct ProjectManager has store, key {\nLine: 33\t        id: object::UID,\nLine: 34\t        projects: bag::Bag,\nLine: 35\t    }\nLine: 36\t \nLine: 37\t    struct ProjectOwnerCap<phantom T0> has store, key {\nLine: 38\t        id: object::UID,\nLine: 39\t        project_id: object::ID,\nLine: 40\t    }\nLine: 41\t \nLine: 42\t    // ----- Functions -----\nLine: 43\t \nLine: 44\t    fun init(ctx: &mut tx_context::TxContext) {\nLine: 45\t        let project_manager = ProjectManager {\nLine: 46\t            id: object::new(ctx),\nLine: 47\t            projects: bag::new(ctx),\nLine: 48\t        };\nLine: 49\t        transfer::share_object(project_manager);\nLine: 50\t    }\nLine: 51\t \nLine: 52\t    fun update_leaderboard<T>(\nLine: 53\t        leaderboard: &mut Leaderboard<T>,\nLine: 54\t        project_id: object::ID,\nLine: 55\t        new_balance: u64\nLine: 56\t    ) {\nLine: 57\t        let (exists, index) = vector::index_of(&leaderboard.top_projects, &project_id);\nLine: 58\t        if (exists) {\nLine: 59\t            vector::remove(&mut leaderboard.top_projects, index);\nLine: 60\t            vector::remove(&mut leaderboard.top_balances, index);\nLine: 61\t        };\nLine: 62\t        \nLine: 63\t        let last_index = vector::length(&leaderboard.top_balances) - 1;\nLine: 64\t        let current_index = last_index;\nLine: 65\t \nLine: 66\t        if (new_balance < *vector::borrow(&leaderboard.top_balances, last_index) \nLine: 67\t            && vector::length(&leaderboard.top_balances) < leaderboard.max_leaderboard_size) {\nLine: 68\t            vector::push_back(&mut leaderboard.top_projects, project_id);\nLine: 69\t            vector::push_back(&mut leaderboard.top_balances, new_balance);\nLine: 70\t        } else {\nLine: 71\t            if (new_balance > *vector::borrow(&leaderboard.top_balances, last_index)) {\nLine: 72\t                loop {\nLine: 73\t                    if (new_balance > *vector::borrow(&leaderboard.top_balances, current_index)) {\nLine: 74\t                        break;\nLine: 75\t                    };\nLine: 76\t                    current_index = current_index - 1;\nLine: 77\t                    if (current_index == 0) {\nLine: 78\t                        break;\nLine: 79\t                    };\nLine: 80\t                };\nLine: 81\t                vector::insert(&mut leaderboard.top_projects, project_id, current_index);\nLine: 82\t                vector::insert(&mut leaderboard.top_balances, new_balance, current_index);\nLine: 83\t                if (vector::length(&leaderboard.top_balances) >= leaderboard.max_leaderboard_size) {\nLine: 84\t                    vector::pop_back(&mut leaderboard.top_projects);\nLine: 85\t                    vector::pop_back(&mut leaderboard.top_balances);\nLine: 86\t                };\nLine: 87\t            };\nLine: 88\t        };\nLine: 89\t    }\nLine: 90\t \nLine: 91\t    public fun check_out_project<T>(\nLine: 92\t        project_manager: &mut ProjectManager,\nLine: 93\t        leaderboard: &Leaderboard<T>,\nLine: 94\t        project_id: object::ID,\nLine: 95\t        ctx: &mut tx_context::TxContext\nLine: 96\t    ) {\nLine: 97\t        let project = bag::borrow_mut<object::ID, Project<T>>(&mut project_manager.projects, project_id);\nLine: 98\t        \nLine: 99\t        let balance_value = balance::value(&project.balance);\nLine: 100\t        let split_balance = balance::split(&mut project.balance, balance_value);\nLine: 101\t        let coin = coin::from_balance(split_balance, ctx);\nLine: 102\t        \nLine: 103\t        transfer::public_transfer(coin, leaderboard.creator);\nLine: 104\t    }\nLine: 105\t \nLine: 106\t    public fun create_leaderboard<T>(\nLine: 107\t        end_timestamp_ms: u64,\nLine: 108\t        reward_coin: coin::Coin<T>,\nLine: 109\t        ctx: &mut tx_context::TxContext\nLine: 110\t    ) {\nLine: 111\t        let leaderboard = Leaderboard<T> {\nLine: 112\t            id: object::new(ctx),\nLine: 113\t            creator: tx_context::sender(ctx),\nLine: 114\t            reward: coin::into_balance(reward_coin),\nLine: 115\t            claimed_reward_amount: 0,\nLine: 116\t            max_leaderboard_size: 30,\nLine: 117\t            top_projects: vector::empty<object::ID>(),\nLine: 118\t            top_balances: vector::empty<u64>(),\nLine: 119\t            end_timestamp_ms,\nLine: 120\t        };\nLine: 121\t        transfer::share_object(leaderboard);\nLine: 122\t    }\nLine: 123\t \nLine: 124\t    public fun deposit_reward<T>(\nLine: 125\t        leaderboard: &mut Leaderboard<T>,\nLine: 126\t        reward_coin: coin::Coin<T>,\nLine: 127\t        clock: &clock::Clock,\nLine: 128\t        ctx: &mut tx_context::TxContext\nLine: 129\t    ) {\nLine: 130\t        assert!(tx_context::sender(ctx) == leaderboard.creator, 1);\nLine: 131\t        balance::join(&mut leaderboard.reward, coin::into_balance(reward_coin));\nLine: 132\t        update_end_timestamp(leaderboard, clock::timestamp_ms(clock) + 259200000);\nLine: 133\t    }\nLine: 134\t \nLine: 135\t    public fun withdraw_reward<T>(\nLine: 136\t        leaderboard: &mut Leaderboard<T>,\nLine: 137\t        amount: u64,\nLine: 138\t        ctx: &mut tx_context::TxContext\nLine: 139\t    ): coin::Coin<T> {\nLine: 140\t        assert!(tx_context::sender(ctx) == leaderboard.creator, 1);\nLine: 141\t        let reward_balance = balance::split<T>(&mut leaderboard.reward, amount);\nLine: 142\t        coin::from_balance(reward_balance, ctx)\nLine: 143\t    }\nLine: 144\t \nLine: 145\t    public fun update_end_timestamp<T>(\nLine: 146\t        leaderboard: &mut Leaderboard<T>,\nLine: 147\t        new_end_timestamp: u64\nLine: 148\t    ) {\nLine: 149\t        assert!(new_end_timestamp > leaderboard.end_timestamp_ms, 1);\nLine: 150\t        leaderboard.end_timestamp_ms = new_end_timestamp;\nLine: 151\t    }\nLine: 152\t \nLine: 153\t    public fun create_project<T>(\nLine: 154\t        manager: &mut ProjectManager,\nLine: 155\t        leaderboard: &mut Leaderboard<T>,\nLine: 156\t        coin: coin::Coin<T>,\nLine: 157\t        ctx: &mut tx_context::TxContext\nLine: 158\t    ): ProjectOwnerCap<T> {\nLine: 159\t        let project = Project<T> {\nLine: 160\t            id: object::new(ctx),\nLine: 161\t            leaderboard_id: object::id(leaderboard),\nLine: 162\t            balance: coin::into_balance(coin),\nLine: 163\t        };\nLine: 164\t        let project_id = object::id(&project);\nLine: 165\t        update_leaderboard(leaderboard, project_id, balance::value(&project.balance));\nLine: 166\t        bag::add(&mut manager.projects, project_id, project);\nLine: 167\t        ProjectOwnerCap<T> {\nLine: 168\t            id: object::new(ctx),\nLine: 169\t            project_id,\nLine: 170\t        }\nLine: 171\t    }\nLine: 172\t \nLine: 173\t    public fun withdraw<T>(\nLine: 174\t        manager: &mut ProjectManager,\nLine: 175\t        owner_cap: ProjectOwnerCap<T>,\nLine: 176\t        leaderboard: &mut Leaderboard<T>,\nLine: 177\t        project_id: object::ID,\nLine: 178\t        clock: &clock::Clock,\nLine: 179\t        ctx: &mut tx_context::TxContext\nLine: 180\t    ): coin::Coin<T> {\nLine: 181\t        let project = bag::remove<object::ID, Project<T>>(&mut manager.projects, project_id);\nLine: 182\t        assert!(\nLine: 183\t            clock::timestamp_ms(clock) > leaderboard.end_timestamp_ms &&\nLine: 184\t            object::id(leaderboard) == project.leaderboard_id,\nLine: 185\t            1\nLine: 186\t        );\nLine: 187\t        let Project {\nLine: 188\t            id: project_id,\nLine: 189\t            leaderboard_id: _,\nLine: 190\t            balance: project_balance,\nLine: 191\t        } = project;\nLine: 192\t        let balance = project_balance;\nLine: 193\t        object::delete(project_id);\nLine: 194\t \nLine: 195\t        let ProjectOwnerCap {\nLine: 196\t            id: owner_cap_id,\nLine: 197\t            project_id: owner_project_id,\nLine: 198\t        } = owner_cap;\nLine: 199\t        let owner_project_id_copy = owner_project_id;\nLine: 200\t        object::delete(owner_cap_id);\nLine: 201\t \nLine: 202\t        let (found, index) = vector::index_of(&leaderboard.top_projects, &owner_project_id_copy);\nLine: 203\t        if (found) {\nLine: 204\t            vector::remove(&mut leaderboard.top_projects, index);\nLine: 205\t            vector::remove(&mut leaderboard.top_balances, index);\nLine: 206\t            leaderboard.claimed_reward_amount = leaderboard.claimed_reward_amount + 1;\nLine: 207\t \nLine: 208\t            let reward_value = balance::value(&leaderboard.reward);\nLine: 209\t            let split_amount = reward_value / (30 - leaderboard.claimed_reward_amount);\nLine: 210\t            let reward_split = balance::split(&mut leaderboard.reward, split_amount);\nLine: 211\t            balance::join(&mut balance, reward_split);\nLine: 212\t        };\nLine: 213\t        coin::from_balance(balance, ctx)\nLine: 214\t    }\nLine: 215\t \nLine: 216\t    public fun vote<T>(\nLine: 217\t        project_manager: &mut ProjectManager,\nLine: 218\t        leaderboard: &mut Leaderboard<T>,\nLine: 219\t        project_id: object::ID,\nLine: 220\t        coin: coin::Coin<T>,\nLine: 221\t        clock: &clock::Clock\nLine: 222\t    ) {\nLine: 223\t        let project = bag::borrow_mut<object::ID, Project<T>>(&mut project_manager.projects, project_id);\nLine: 224\t        assert!(clock::timestamp_ms(clock) < leaderboard.end_timestamp_ms, 1);\nLine: 225\t        balance::join(&mut project.balance, coin::into_balance(coin));\nLine: 226\t        update_leaderboard(\nLine: 227\t            leaderboard,\nLine: 228\t            object::id(project),\nLine: 229\t            balance::value(&project.balance)\nLine: 230\t        );\nLine: 231\t    }\nLine: 232\t\nLine: 233\t\n";

export const exampleAudit = `- function: check_out_project
- bugType: Design Logic
- level: High
- threatFrom: The leaderboard creator can drain people's projects.
- description: The 'check_out_project' function allows the leaderboard creator to withdraw all the balance from a project, effectively draining the project's funds.
- line: 91-104

- function: update_end_timestamp
- bugType: Function Declarations and Visibility
- level: High
- threatFrom: Anyone can update the end timestamp of the leaderboard.
- description: The 'update_end_timestamp' function is public and allows anyone to extend the leaderboard's duration indefinitely, which could prevent the game from ending.
- line: 145

- function: create_project
- bugType: Clock Usage
- level: Moderate
- threatFrom: Projects can be created after the end of the leaderboard and still receive rewards.
- description: The 'create_project' function does not check if the current time is past the leaderboard's end timestamp, allowing projects to be created and added to the leaderboard after the game has ended.
- line: 153-158

- function: withdraw
- bugType: Access Control
- level: High
- threatFrom: Anyone can withdraw someone else's project.
- description: The 'withdraw' function does not validate ownership of the project owner cap, allowing users to withdraw projects they do not own.
- line: 182-186

- function: withdraw
- bugType: Division Error
- level: Moderate
- threatFrom: Division by zero error when claimed_reward_amount exceeds 30.
- description: In the 'withdraw' function, if the claimed_reward_amount exceeds 30, the division calculation will result in a division by zero, causing a runtime error.
- line: 209

- function: vote
- bugType: Access Control
- level: High
- threatFrom: Voters can vote a project in a different leaderboard.
- description: The 'vote' function does not verify if the project belongs to the same leaderboard as the one being voted on, allowing cross-manager votes.
- line: 224
`;

export const exampleAuditJSON = [
  {
    function: "check_out_project",
    bugType: "Design Logic",
    level: "High",
    threatFrom: "The leaderboard creator can drain people's projects.",
    description:
      "The 'check_out_project' function allows the leaderboard creator to withdraw all the balance from a project, effectively draining the project's funds.",
    line: "91-104",
  },
  {
    function: "update_end_timestamp",
    bugType: "Function Declarations and Visibility",
    level: "High",
    threatFrom: "Anyone can update the end timestamp of the leaderboard.",
    description:
      "The 'update_end_timestamp' function is public and allows anyone to extend the leaderboard's duration indefinitely, which could prevent the game from ending.",
    line: "145",
  },
  {
    function: "create_project",
    bugType: "Clock Usage",
    level: "Moderate",
    threatFrom:
      "Projects can be created after the end of the leaderboard and still receive rewards.",
    description:
      "The 'create_project' function does not check if the current time is past the leaderboard's end timestamp, allowing projects to be created and added to the leaderboard after the game has ended.",
    line: "153-158",
  },
  {
    function: "withdraw",
    bugType: "Access Control",
    level: "High",
    threatFrom: "Anyone can withdraw someone else's project.",
    description:
      "The 'withdraw' function does not validate ownership of the project owner cap, allowing users to withdraw projects they do not own.",
    line: "182-186",
  },
  {
    bugType: "Division Error",
    level: "Moderate",
    function: "withdraw",
    threatFrom: "Division by zero error when claimed_reward_amount exceeds 30.",
    description:
      "In the 'withdraw' function, if the claimed_reward_amount exceeds 30, the division calculation will result in a division by zero, causing a runtime error.",
    line: "209",
  },
  {
    function: "vote",
    bugType: "Access Control",
    level: "High",
    threatFrom: "Voters can vote a project in a different leaderboard.",
    description:
      "The 'vote' function does not verify if the project belongs to the same leaderboard as the one being voted on, allowing cross-manager votes.",
    line: "224",
  },
];
