import { createServer } from 'http'
import { connection, server } from 'websocket'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { Router } from './router'
import { states } from './types/states'



const http = createServer(function (req, res) { })

http.on("request", (req, res) => new Router(req, res));

const ws = new server({ httpServer: http });


ws.on('request', (req) => {
    req.accept(null, req.origin);
})

ws.on("connect", (con) => {
    const clientId = randomUUID();

    // store user states
    states.push({ id: clientId, connection: con });

    // send clientId to Client
    con.send(clientId);
})



const PORT = process.env.PORT || 3000
http.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
