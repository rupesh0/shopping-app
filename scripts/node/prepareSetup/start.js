(async () => {
  try {
    console.log("⚡ Starting Setup...\n");

    console.log("\n🎉 Setup completed successfully!");
  } catch (err) {
    console.error("\n🔥 Setup aborted due to critical error.", err);
    process.exit(1);
  }
})();
