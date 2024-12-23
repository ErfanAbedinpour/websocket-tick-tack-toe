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

    const response: IWsResponse = {
        action: Actions.connect,
        id: clientId
    }

    // send clientId to Client
    con.send(JSON.stringify(response));

    con.on("message", msg => {
        // do not send binary file
        if (msg.type === 'binary')
            return con.send(JSON.stringify({ action: Actions.error, message: "please send utf8 data" }))

        // parse File And Do Action

        const data = JSON.parse(msg.utf8Data) as IWsRequest;

        if (data.action === Actions.create) {

            const gameId = randomUUID();
            const clientId = data.clientId;


            GameStates.set(gameId, { players: [clientId], isMax: false });

            const response: IWsResponse = {
                action: Actions.create,
                gameId: gameId
            }

            return con.send(JSON.stringify(response));
        }

        if (data.action === Actions.join) {
            const gameId = data.gameId;
            const clientId = data.clientId;
            const game = GameStates.get(gameId);

            if (!game) {
                const payload: IWsResponse = {
                    action: Actions.error,
                    message: "game not found"
                }
                return con.send(JSON.stringify(payload));
            }
            if (game.isMax) {
                const payload: IWsResponse = {
                    action: Actions.error,
                    message: "game is ful"
                }
                return con.send(JSON.stringify(payload));
            }

            game.players.push(clientId);
            game.isMax = true;
            const paylaod = {
                action: Actions.join,
                gameId: gameId,
                players: game.players
            }

            game.players.forEach(id => {
                ConnectionStates.get(id)?.connection.send(JSON.stringify(paylaod));
            })

            return;
        }


        if (data.action === Actions.leave) {
            const gameId = data.gameId.trim();
            const clientId = data.clientId;
            const game = GameStates.get(gameId);

            GameStates.delete(gameId);

            const paylaod = {
                action: Actions.leave,
                clientId: clientId,
                gameId: gameId,
            }

            game?.players.forEach(id => {
                ConnectionStates.get(id)?.connection.send(JSON.stringify(paylaod))
            })
            return;
        }
    })

})



const PORT = process.env.PORT || 3000
http.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
