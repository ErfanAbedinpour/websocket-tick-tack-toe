import { createServer } from 'http'
import { server } from 'websocket'
import 'dotenv/config'
import { Router } from './router'


const http = createServer(function (req, res) { })


http.on("request", (req, res) => new Router(req, res));

const ws = new server({ httpServer: http });

ws.on('request', (req) => {
    const connection = req.accept(null, req.origin);
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
