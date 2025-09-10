const fs = require("fs");
const path = require("path");

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

module.exports = {
  getSfdxApiVersion
};
