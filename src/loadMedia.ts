import fs from "fs";
import parse from "csv-parse/lib/sync";
import { Path } from "./types";

function loadTSV(path: Path) {
  return fs.promises.readFile(path, "utf-8");
}

export function loadMedia(path) {
  return async function () {
    const loadedTsv = await loadTSV(path);

    return parse(loadedTsv, {
      delimiter: "\t",
      columns: true,
      skipEmptyLines: true,
    });
  };
}
