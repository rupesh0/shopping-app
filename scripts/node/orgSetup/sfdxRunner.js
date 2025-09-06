const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

async function runSfdx(command, parseJson = false) {
  try {
    const { stdout, stderr } = await execAsync(`sf ${command}`);

    if (stderr) {
      console.error("SFDX stderr:", stderr);
    }

    if (parseJson) {
      try {
        return JSON.parse(stdout);
      } catch (e) {
        console.error("Failed to parse JSON output:", e);
        return stdout;
      }
    }

    return stdout;
  } catch (err) {
    console.error("SFDX command failed:", err.message);
    throw err;
  }
}

module.exports = {
  runSfdx
};
