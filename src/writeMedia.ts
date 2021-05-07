import fs from "fs";
const { createReadStream, createWriteStream } = require("fs");
const { parse } = require("json2csv");

import logger from "./logger";
import { Media, Path } from "./types";

function rowToTSV(item: Media) {
  return function (rowString, key, i) {
    if (i === 0) {
      return `${rowString}${item[key]}\t`;
    }
    return `${rowString}\t${item[key]}`;
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

  return async function writeNewTSV(media: Media[]): Promise<void> {
    const fields = Object.keys(media[0]);
    const opts = { fields, delimiter: "\t" };
    const tsv = parse(media, opts);

    return fs.promises.writeFile(path, tsv);
  };
}
