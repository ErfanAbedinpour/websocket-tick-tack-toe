import { readFileSync } from "fs";
import { Request, Response } from "./types/index.types";
import { CONSTANTS } from "./constant/constants";


export class Router {
    constructor(req: Request, res: Response) {
        if (req.method?.toLocaleLowerCase() == 'get' && req.url === '/index.js') {
            this.loadJsFile(res);
        }
        else if (req.method?.toLowerCase() === 'get' && req.url === '/') {
            this.serveIndex(req, res);
        } else {
            this.serverNotFound(req, res)
        }
    }

    private loadJsFile(res: Response) {
        const data = readFileSync(CONSTANTS.jsFile);
        res.writeHead(200, {
            'Content-Type': 'application/javascript',
        })
        return res.end(data)
    }

    serveIndex(_: Request, res: Response) {
        res.writeHead(200, { "content-type": "text/html" })
        const page = readFileSync(CONSTANTS.indexPage)
        return res.end(page);
    }

    serverNotFound(_: Request, res: Response) {
        res.writeHead(200, { "content-type": "text/html" })
        const page = readFileSync(CONSTANTS.notFoundPage)
        return res.end(page);
    }
}