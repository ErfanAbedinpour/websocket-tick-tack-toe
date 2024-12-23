import { createServer } from 'http'
import { server } from 'websocket'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { Router } from './router'
import { ConnectionStates, GameStates } from './types/states'
import { Actions } from './constant/actions.enum'
import { IWsResponse } from './types/ws.respone'
import { acceptRequest } from './socket/request.socket'

const http = createServer(function (req, res) { })
http.on("request", (req, res) => new Router(req, res));

const ws = new server({ httpServer: http });

ws.on('request', acceptRequest);

const PORT = process.env.PORT || 3000
http.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
