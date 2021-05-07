import { collectMedia } from './media';
import { startServer } from './server';

const INPUT_DIRECTORY = "/Volumes/photo/exports";

collectMedia(INPUT_DIRECTORY).then(startServer)

