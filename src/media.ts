import glob from "glob";
import { ExifTool } from "exiftool-vendored";
import fs from "fs";
import parseTsv from "csv-parse/lib/sync";
import { parse } from "json2csv";
import { Media, Path, DirectoryPath, MediaPath, Filetype } from "./types";
import logger from "./logger";

const exifReader = new ExifTool();

const SUPPORTED_PHOTOS = ["jpg", "png"];
const SUPPORTED_VIDEOS = ["mov", "mp4"];
const SUPPORTED_FILETYPES = SUPPORTED_PHOTOS.concat(SUPPORTED_VIDEOS);

function loadTSV(path: Path) {
    return fs.promises.readFile(path, "utf-8");
}

export function loadMedia(path) {
    return async function () {
        const loadedTsv = await loadTSV(path);

        return parseTsv(loadedTsv, {
            delimiter: "\t",
            columns: true,
            skipEmptyLines: true,
        });
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


function createSupportedFileGlob(filetypes: Filetype[]): string {
    const allcaps = filetypes.map((type) => type.toUpperCase());
    return filetypes.concat(allcaps).join("|");
}

async function findCompatibleMedia(
    pathToSearch: DirectoryPath
): Promise<MediaPath[]> {
    return new Promise((resolve, reject) => {
        const supportedFileGlob = createSupportedFileGlob(SUPPORTED_FILETYPES);
        logger.info("looking for", { supportedFileGlob });
        glob(
            `${pathToSearch}/**/*.@(${supportedFileGlob})`,
            {},
            function (err, files) {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            }
        );
    });
}

async function extractExifForFiles(files: MediaPath[]): Promise<Media[]> {
    const exifs = await Promise.all(
        files.map((mediaPath) => {
            return exifReader.read(mediaPath);
        })
    );

    await exifReader.end();

    return exifs;
}

export function collectMedia(path): Promise<void | { databasePath: Path}> {
    const tsvPath = `${path}/database.tsv`;

    return findCompatibleMedia(path)
        .then(extractExifForFiles)
        .then(writeToTSV(tsvPath))
        .then(loadMedia(tsvPath))
        .then((media) => ({ databasePath: tsvPath, media }));
}
