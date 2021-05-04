import fs from "fs";
import logger from "./logger";
import { Media } from "./types";

export function writeToTSV(path) {
  return async function writeToTSV(media: Media[]): Promise<void> {
    const keys = Object.keys(media[0]);
    logger.info("writeToTSV input", {
      firstMedia: media[0],
      keys,
    });

    const tsv = media.reduce((tsvString, item, i) => {
      const row = keys.reduce((rowString, key) => {
        return `${rowString}${item[key]}\t`;
      }, "");

      return `${tsvString}\n${row}`;
    }, keys.join("\t"));

    logger.info("writeToTSV output", { tsv });

    return fs.promises.writeFile(path, tsv);
  };
}
