// app/src/lib/prompt/getAuditMovePrompt.ts
import {
  exampleAudit,
  exampleBugContract,
} from "@/lib/prompt/exampleBugContract";

// app/src/lib/prompt/getAuditMovePrompt.ts
export function getAuditMovePrompt(code: string) {
  let parsedCode = "";
  for (const [index, line] of Object.entries(code.split("\n"))) {
    parsedCode += `Line: ${Number(index) + 1}\t${line}\n`;
  }
  const prompt: any[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that help reviewing Sui Move codes" +
        "When reviewing a Move Contract, you should pay attention to the following:\n\n" +
        "### Function Declarations and Visibility\n" +
        "- Check the visibility of all functions (public, public(friend), public(package), entry).\n" +
        "- Ensure correct usage of public(friend) or public(package).\n" +
        "- Verify entry points have correct input and return types.\n\n" +
        "### Object Management\n" +
        "- Ensure object uniqueness, each SUI object should have a unique objID.\n" +
        "- Verify correct usage of object wrapping and unwrapping.\n" +
        "- Verify custom transfer strategies like sui::transfer::transfer or sui::transfer::public_transfer.\n" +
        "- Check object properties (copy, drop, store, key).\n" +
        "- Confirm object permission checks for Address-Owned Objects, Immutable Objects, Shared Objects, and Wrapped Objects.\n\n" +
        "### Security Checks\n" +
        "- Ensure overflow checks, especially during bitwise operations.\n" +
        "- Verify that there are no reentrancy vulnerabilities from unexpected external calls.\n\n" +
        "### Overflow\n" +
        "- Identify locations for bitwise operations and ensure they are checked for overflow risks.\n\n" +
        "### Division Error\n" +
        "- Identify locations for division operations and ensure they are checked for division by zero risks.\n\n" +
        "### Arithmetic Accuracy Deviation\n" +
        "- Check arithmetic operations to ensure they handle precision issues properly.\n\n" +
        "### Race Conditions\n" +
        "- Ensure proper transaction ordering to avoid potential profit from transaction race conditions.\n\n" +
        "### Access Control\n" +
        "- Check access control settings to ensure sensitive functions are not unintentionally exposed.\n\n" +
        "### Object Management\n" +
        "- Review object types and permissions, ensuring correct usage of static or shared objects.\n\n" +
        "### Token Consumption\n" +
        "- Verify token consumption is accurate, including transfer, splitting, and merging of tokens.\n\n" +
        "### Flashloan Attack\n" +
        "- Check for potential flashloan attack vulnerabilities, like price manipulation.\n\n" +
        "### Permission Vulnerability\n" +
        "- Ensure functions have proper permissions and roles do not have excessive privileges.\n" +
        "- Check that privileged objects are not improperly accessed by external functions.\n\n" +
        "### Clock Usage\n" +
        "- Ensure that the contract use and check the clock object correctly.\n\n" +
        "### Smart Contract Upgrade Security\n" +
        "- Ensure safe contract upgrades, proper data migration, and external dependency handling.\n" +
        "- Verify that the init function is correctly handled during upgrades.\n\n" +
        "### External Call Function Security\n" +
        "- Ensure external modules are stable and secure when imported.\n\n" +
        "### Unchecked Return Values\n" +
        "- Check that all return values, especially for external calls, are handled properly.\n\n" +
        "### Denial of Service (DoS)\n" +
        "- Ensure the contract can handle various scenarios without service interruption.\n" +
        "- Check external module compatibility to avoid DoS issues.\n\n" +
        "### Gas Optimization\n" +
        "- Review complex and high-frequency calls to ensure gas efficiency.\n\n" +
        "### Design Logic\n" +
        "- Verify that the business logic matches the intended design.\n" +
        "- Ensure invocation paths follow expected processes to avoid unexpected results.\n\n" +
        "### Others\n" +
        "- Check any additional areas not covered above for potential risks.\n\n\n" +
        "In the provided code, the line number is at the start of the line before the tab.\n" +
        "You should output bugs in the following format in plain text:\n" +
        "```\n" +
        "- function: string, // The function name\n" +
        "- bugType: string, // The type of the bug, e.g., 'Overflow', 'Arithmetic Accuracy Deviation', 'Race Conditions', etc.\n" +
        "- level: string, // 'Low', 'Moderate', or 'High'\n" +
        "- threatFrom: string, // Brief description of the threat source\n" +
        "- description: string, // Detailed description of the issue\n" +
        "- line: string, // Line number or range for the bug, e.g., '42' or '42-45'. the line number is at the start of each line before the tab\n" +
        "```\n\n",
    },
    {
      role: "user",
      content:
        "Here is the contract code:\n```move\n" + exampleBugContract + "\n```",
    },
    {
      role: "assistant",
      content: "```\n" + exampleAudit + "\n```",
    },
    {
      role: "user",
      content: "Here is the contract code:\n```move\n" + parsedCode + "\n```",
    },
  ];
  return prompt;
}
