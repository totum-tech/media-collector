import glob from "glob";
import logger from "./logger";

logger.info("Hello world!");

const INPUT_DIRECTORY = "/Volumes/photo/raws";

type DirectoryPath = string;
type MediaPath = string;
type Filetype = string;

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

findCompatibleMedia(INPUT_DIRECTORY).then((matches) =>
  logger.info("Media 4 U", matches)
);
