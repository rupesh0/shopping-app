const { runSfdx } = require("./sfdxRunner");

const {
  DEFINITION_FILE_PATH,
  ORG_DURATION,
  ORG_ALIAS,
  ASSIGN_PERMISSION_SETS_APEX_FILE,
  DATA_IMPORT_PATH
} = require("./constants");

function getCreateOrgCommand() {
  return `org create scratch --definition-file ${DEFINITION_FILE_PATH} --set-default --duration-days ${ORG_DURATION} -a ${ORG_ALIAS} --json`;
}

async function createScratchOrg() {
  try {
    console.log("🚀 Creating Scratch Org...");

    const command = getCreateOrgCommand();
    await runSfdx(command);

    console.log("✅ Scratch Org created");
  } catch (err) {
    console.error("❌ Failed to create scratch org.");
    throw new Error(err);
  }
}

function getDeployCodeCommand() {
  return `project deploy start --ignore-conflicts --json`;
}

async function deployCode() {
  try {
    console.log("📦 Deploying Code...");

    const command = getDeployCodeCommand();
    await runSfdx(command);

    console.log("✅ Code deployed");
  } catch (err) {
    console.error("❌ Failed to deploy code.");
    throw new Error(err);
  }
}

function getAssignPermissionSetsCommand() {
  return `apex run --file ${ASSIGN_PERMISSION_SETS_APEX_FILE} --json`;
}

async function assignPermissionSets() {
  try {
    console.log("🔐 Assigning Permission Sets...");

    const command = getAssignPermissionSetsCommand();
    await runSfdx(command);

    console.log(`✔ Assigned permission sets`);
  } catch (err) {
    console.error("❌ Failed to assign permission sets.");
    throw new Error(err);
  }
}

function getImportDataCommand() {
  return `data import tree --plan ${DATA_IMPORT_PATH} --json`;
}

async function importData() {
  try {
    console.log("📥 Importing Data...");

    const command = getImportDataCommand();
    await runSfdx(command);

    console.log("✅ Data imported");
  } catch (err) {
    console.error("❌ Failed to import data.");
    throw new Error(err);
  }
}

module.exports = {
  importData,
  deployCode,
  createScratchOrg,
  assignPermissionSets
};
