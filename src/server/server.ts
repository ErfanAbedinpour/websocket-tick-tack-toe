import { createServer } from 'http'
import { server } from 'websocket'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { Router } from './router'
import { ConnectionStates, GameStates } from './types/states'
import { Actions } from './constant/actions.enum'
import { IWsRequest } from './types/ws.request'
import { IWsResponse } from './types/ws.respone'



const http = createServer(function (req, res) { })

http.on("request", (req, res) => new Router(req, res));

const ws = new server({ httpServer: http });


ws.on('request', (req) => {
    const con = req.accept(null, req.origin);
})

ws.on("connect", (con) => {
    const clientId = randomUUID();

    // store user states
    ConnectionStates.set(clientId, { connection: con });

    const response = JSON.stringify({
        code: Actions.connect,
        id: clientId
    })

    // send clientId to Client
    con.send(response);

    con.on("message", msg => {

        if (msg.type === 'binary')
            return con.send(JSON.stringify({ action: Actions.error, message: "please send utf8 data" }))

        const data = JSON.parse(msg.utf8Data) as IWsRequest;

        if (data.action === Actions.create) {

            const gameId = randomUUID();

            GameStates.set(gameId, { Players: [con] });

            const response: IWsResponse = {
                action: Actions.create,
                gameId: gameId
            }

            return con.send(JSON.stringify(response));
        }

        if (data.action === Actions.join) { }


        if (data.action === Actions.leave) {
            const gameId = data.gameId.trim();
            console.log(gameId)
            GameStates.delete(gameId);

            console.log(GameStates)
            return;
        }
    })

})



const PORT = process.env.PORT || 3000
http.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
