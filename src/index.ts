import * as fs from "fs";
import * as path from "path";
import logger from "./logger";

logger.info("Hello world!");

const INPUT_DIRECTORY = "/Volumes/photo/raws";

type DirectoryPath = string;

function identity(truthy: any) {
  return !!truthy;
}

async function pathIsDirectory(pathToCheck: DirectoryPath): Promise<boolean> {
  const fileInfo = await fs.promises.stat(pathToCheck);
  return fileInfo.isDirectory();
}

async function listDirectories(
  pathToSearch: DirectoryPath
): Promise<DirectoryPath[]> {
  const filenames = await fs.promises.readdir(pathToSearch);

  const results = await Promise.all(
    filenames.map(async (filename) => {
      const fullFilePath = path.join(pathToSearch, filename);
      const isDirectory = await pathIsDirectory(fullFilePath);
      if (isDirectory) {
        return fullFilePath;
      }
      return null;
    })
  );

  const directories = results.filter(identity);
  return directories;
}

async function recursivelyCrawlDirectory(
  pathToCrawl: DirectoryPath,
  directoriesFound: DirectoryPath[],
  depth: number = 0
): Promise<DirectoryPath[]> {
  const directories = await listDirectories(pathToCrawl);

  if (directories.length === 0) {
    return directoriesFound;
  }

  let collectedDirectories = [];

  for (const directoryPath of directories) {
    let accumulatedDirectories = [];
    if (depth > 0) {
      accumulatedDirectories = directoriesFound.concat(directories);
    }
    const recursivelyCollectedDirectories = await recursivelyCrawlDirectory(
      directoryPath,
      accumulatedDirectories,
      depth + 1
    );

    collectedDirectories.push(...recursivelyCollectedDirectories);
  }

  return collectedDirectories;
}

recursivelyCrawlDirectory(INPUT_DIRECTORY, []).then((directories) =>
  logger.info("Recursively Found Directories", directories)
);
