// app/src/lib/prompt/parseAuditString.ts

const exampleAuditString = `
- function: check_out_project
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

interface AuditEntry {
  function: string;
  bugType: string;
  level: string;
  threatFrom: string;
  description: string;
  line: string;
}

export function parseAuditString(auditString: string): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const entryRegex =
    /- function: (.*?)\n- bugType: (.*?)\n- level: (.*?)\n- threatFrom: (.*?)\n- description: (.*?)\n- line: (.*?)(\n|$)/g;

  let match;
  while ((match = entryRegex.exec(auditString)) !== null) {
    const [, func, bugType, level, threatFrom, description, line] = match;
    entries.push({
      function: func,
      bugType: bugType,
      level: level,
      threatFrom: threatFrom,
      description: description,
      line: line.trim(),
    });
  }

  return entries;
}
