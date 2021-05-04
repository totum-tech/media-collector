import p from "papaparse";
import fs from "fs";
import logger from "./logger";
import { Media, Path } from "./types";

function rowToTSV(item: Media) {
  return function (rowString, key) {
    return `${rowString}${item[key]}\t`;
  };
}

function loadTSV(path: Path) {
  return fs.promises.readFile(path, "utf-8");
}

function mediaIsNew(data: string) {
  return function isLogged(media: Media): boolean {
    return !data.includes(media.SourceFile);
  };
}

export function writeToTSV(path) {
  let databaseExists = fs.existsSync(path);

  if (databaseExists) {
    return async function writeToExistingTSV(media: Media[]): Promise<void> {
      const existingData = await loadTSV(path);
      const keys = existingData.split("\n")[0].split("\t");
      logger.info("writeToTSV input", {
        firstMedia: media[0],
        keys,
      });

      const tsv = media
        .filter(mediaIsNew(existingData))
        .reduce((tsvString, item) => {
          const row = keys.reduce(rowToTSV(item), "");

          return `${tsvString}\n${row}`;
        }, existingData);

      logger.info("writeToTSV output", { tsv });

      return fs.promises.appendFile(path, tsv);
    };
  }
  // if it doesn't exist
  else {
    return async function writeNewTSV(media: Media[]): Promise<void> {
      const keys = Object.keys(media[0]);
      logger.info("writeToNewTSV input", {
        firstMedia: media[0],
        keys,
      });

      const tsv = media.reduce((tsvString, item) => {
        const row = keys.reduce(rowToTSV(item));

        return `${tsvString}\n${row}`;
      }, keys.join("\t"));

      logger.info("writeToTSV output", { tsv });

      return fs.promises.writeFile(path, tsv);
    };
  }
}
