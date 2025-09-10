const fs = require("fs").promises;
const path = require("path");

const findFiles = async (sourceDirectories, options) => {
  sourceDirectories = Array.isArray(sourceDirectories)
    ? sourceDirectories
    : [sourceDirectories];

  const {
    extensions = [],
    excludedDirectories = [],
    findDown = false,
    findUp = false,
    findCurrent = true
  } = options || {};

  const files = [];

  if (findCurrent) {
    await findInDirectories(sourceDirectories, files, {
      extensions,
      excludedDirectories,
      recursion: false
    });
  }

  if (findDown) {
    await findDownInDirectories(sourceDirectories, files, {
      extensions,
      excludedDirectories,
      recursion: true
    });
  }

  return files;
};

async function findDownInDirectories(directories, files, options) {
  const childPaths = [];

  const promises = directories.map(async (dir) => {
    const fullPath = path.resolve(dir);
    const dirFiles = await fs.readdir(fullPath, { withFileTypes: true });
    dirFiles.forEach((dirFile) => {
      if (dirFile.isDirectory()) {
        childPaths.push(path.join(fullPath, dirFile.name));
      }
    });
    return Promise.resolve();
  });

  await Promise.all(promises);

  if (childPaths.length) {
    await findInDirectories(childPaths, files, options);
  }
}

async function findInDirectories(directories, files, options) {
  const promises = directories.map((dir) =>
    findInDirectory(dir, files, options)
  );

  await Promise.all(promises);
}

async function findInDirectory(directory, files, options) {
  const fullPath = path.resolve(directory);
  const dirFiles = await fs.readdir(fullPath, { withFileTypes: true });

  const filesPromises = dirFiles.map(async (dirFile) => {
    if (dirFile.isSymbolicLink()) {
      return Promise.resolve();
    }

    if (dirFile.isDirectory()) {
      return handleDirectory(dirFile, fullPath, files, options);
    }

    return handleFile(dirFile, fullPath, files, options);
  });

  await Promise.all(filesPromises);
}

async function handleDirectory(dirFile, parentPath, files, options) {
  const dirPath = path.join(parentPath, dirFile.name);

  const isExcluded = options.excludedDirectories
    .map((p) => path.normalize(p))
    .some((excluded) => {
      return (
        dirPath.startsWith(`${excluded}${path.sep}`) ||
        dirPath.endsWith(`${path.sep}${excluded}`) ||
        dirPath.includes(`${path.sep}${excluded}${path.sep}`)
      );
    });

  if (options.recursion && isExcluded === false) {
    await findInDirectory(dirPath, files, options);
  }

  return Promise.resolve();
}

async function handleFile(dirFile, parentPath, files, options) {
  const filePath = path.join(parentPath, dirFile.name);
  const isExcluded = options.excludedDirectories
    .map((p) => path.normalize(p))
    .some((excluded) => filePath.includes(`${path.sep}${excluded}${path.sep}`));

  if (isExcluded) {
    return Promise.resolve();
  }

  const isMatch = options.extensions.length
    ? options.extensions.some((ext) => dirFile.name.endsWith(ext))
    : true;

  if (isMatch) {
    files.push(filePath);
  }

  return Promise.resolve();
}

(async () => {
  console.log("Testing findFiles function:");
  console.log(
    await findFiles([".", "data"], {
      extensions: [".js", ".json"],
      excludedDirectories: ["node_modules"],
      findDown: true,
      findCurrent: true
    })
  );
})();
