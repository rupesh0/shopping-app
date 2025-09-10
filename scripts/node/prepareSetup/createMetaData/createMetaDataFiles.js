const { getSfdxApiVersion } = require("./createMetaDataHelper");

const createMetaDataFiles = async () => {
  const apiVersion = getSfdxApiVersion();
  console.log(`\n Using API Version: ${apiVersion}`);
};

module.exports = {
  createMetaDataFiles
};
