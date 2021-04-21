import * as fs from "fs";
import * as path from "path";
import glob from "glob";
import logger from "./logger";

logger.info("Hello world!");

const INPUT_DIRECTORY = "/Volumes/photo/raws";

type DirectoryPath = string;
type MediaPath = string;

async function findCompatibleMedia(
  pathToSearch: DirectoryPath
): Promise<MediaPath[]> {
  return new Promise((resolve, reject) => {
    glob(`${pathToSearch}/**/*.dng`, {}, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

findCompatibleMedia(INPUT_DIRECTORY).then((matches) =>
  logger.info("Media 4 U", matches)
);
