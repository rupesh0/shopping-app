const {
  importData,
  createScratchOrg,
  deployCode,
  assignPermissionSets
} = require("./sfdxHelper");

(async () => {
  try {
    console.log("⚡ Starting Scratch Org Setup...\n");
    //   await createScratchOrg();
    await deployCode();
    await assignPermissionSets();
    await importData();
    console.log("\n🎉 Scratch org setup completed successfully!");
  } catch (err) {
    console.error("\n🔥 Setup aborted due to critical error.", err);
    process.exit(1);
  }
})();
