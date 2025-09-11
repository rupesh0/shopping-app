const fs = require("fs");
const path = require("path");
const { META_DATA_TYPES, META_DATA_DEFINATIONS } = require("./constants");

const getSfdxApiVersion = () => {
  const sfdxProjectFilePath = path.join(process.cwd(), "sfdx-project.json");

  if (!fs.existsSync(sfdxProjectFilePath)) {
    throw new Error(
      `sfdx-project.json not found at path: ${sfdxProjectFilePath}`
    );
  }

  const sfdxProject = JSON.parse(fs.readFileSync(sfdxProjectFilePath, "utf-8"));
  return sfdxProject.sourceApiVersion;
};

async function createMetaData(filesToCreateMeta, metaData, apiVersion) {
  const filePromises = filesToCreateMeta.map(async (filePath) => {
    const { suffix, metaSuffix } = META_DATA_DEFINATIONS[metaData];

    const metaFileContent = getMetaFileContent(metaData, apiVersion);
    const metaFilePath = filePath.replace(suffix, metaSuffix);

    await fs.promises.writeFile(metaFilePath, metaFileContent, "utf-8");
  });

  await Promise.all(filePromises);
}

async function deleteMetaData(filesToDeleteMeta) {
  const deletePromises = filesToDeleteMeta.map(async (filePath) => {
    await fs.promises.unlink(filePath);
  });

  await Promise.all(deletePromises);
}

function getMetaFileContent(type, apiVersion) {
  if (type === META_DATA_TYPES.APEX_CLASS) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>${apiVersion}</apiVersion>
    <status>Active</status>
</ApexClass>`;
  }

  if (type === META_DATA_TYPES.APEX_TRIGGER) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ApexTrigger xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>${apiVersion}</apiVersion>
    <status>Active</status>
</ApexTrigger>`;
  }

  if (type === META_DATA_TYPES.LIGHTNING_WEB_COMPONENT) {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>${apiVersion}</apiVersion>
    <isExposed>false</isExposed>
</LightningComponentBundle>`;
  }

  return null;
}

module.exports = {
  getSfdxApiVersion,
  createMetaData,
  deleteMetaData
};
