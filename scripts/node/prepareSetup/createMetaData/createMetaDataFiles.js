const { file } = require("../../common");
const { META_DATA_DEFINATIONS } = require("./constants");
const {
  getSfdxApiVersion,
  createMetaData,
  deleteMetaData
} = require("./createMetaDataHelper");

const createMetaDataFiles = async () => {
  const apiVersion = getSfdxApiVersion();
  console.log(`\n Using API Version: ${apiVersion}`);

  for (const metaData of Object.keys(META_DATA_DEFINATIONS)) {
    const { label, directory, suffix, metaSuffix } =
      META_DATA_DEFINATIONS[metaData];

    console.log(`\n Finding existing ${label} files...`);
    const allFiles = await file.findFiles(["force-app"], {
      extensions: [suffix, metaSuffix],
      excludedDirectories: ["node_modules"],
      findDown: true,
      findCurrent: true
    });

    const existingFiles = allFiles.filter((f) => f.endsWith(suffix));
    const existingMetaFiles = allFiles.filter((f) => f.endsWith(metaSuffix));

    const filesToCreateMeta = existingFiles.filter((f) => {
      const metaFile = f.replace(suffix, metaSuffix);
      return !existingMetaFiles.includes(metaFile);
    });

    const filesToDeleteMeta = existingMetaFiles.filter((f) => {
      const originalFile = f.replace(metaSuffix, suffix);
      return !existingFiles.includes(originalFile);
    });

    console.log(` Found ${existingFiles.length} ${label} files.`);
    console.log(` Found ${existingMetaFiles.length} ${label} metadata files.`);
    console.log(` ${filesToCreateMeta.length} metadata files to create.`);
    console.log(` ${filesToDeleteMeta.length} metadata files to delete.`);

    if (filesToCreateMeta.length === 0 && filesToDeleteMeta.length === 0) {
      console.log(
        ` No metadata files to create or delete for ${label}. Skipping...`
      );
      continue;
    }

    // Logic to find existing files using the above variables
    console.log(`\n Creating or Deleting missing ${label} metadata files...`);
    const createMetaPromise = createMetaData(
      filesToCreateMeta,
      metaData,
      apiVersion
    );

    const deleteMetaPromise = deleteMetaData(filesToDeleteMeta);

    await Promise.all([createMetaPromise, deleteMetaPromise]);

    console.log(` Completed processing ${label} metadata files.`);
  }
};

module.exports = {
  createMetaDataFiles
};
