import glob from "glob";
import logger from "./logger";
import { ExifTool } from "exiftool-vendored";

logger.info("Hello world!");
const exifReader = new ExifTool();

const INPUT_DIRECTORY = "/Volumes/photo/raws";

type DirectoryPath = string;
type MediaPath = string;
type Filetype = string;
type Media = any;

const SUPPORTED_PHOTOS = ["jpg", "png", "arw", "dng"];
const SUPPORTED_VIDEOS = ["mov", "mp4"];
const SUPPORTED_FILETYPES = SUPPORTED_PHOTOS.concat(SUPPORTED_VIDEOS);

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

findCompatibleMedia(INPUT_DIRECTORY)
  .then(extractExifForFiles)
  .then((media) => logger.info("Media 4 U", media));
