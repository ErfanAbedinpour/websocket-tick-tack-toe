import { join } from 'path'
const CLIENT_DIR = join(process.cwd(), 'src', 'client');

export const CONSTANTS = {
    indexPage: `${CLIENT_DIR}/index.html`,
    notFoundPage: `${CLIENT_DIR}/notFound.html`,
    jsFile: `${CLIENT_DIR}/index.js`
}