import { connection, Message } from "websocket";
import { Actions } from "../constant/actions.enum";
import { RoomService } from "../services/room.service";
import { GameService } from "../services/game.service";
import { ConnectionStates, RoomStates } from "../types/states";
import { WsError } from "../error/ws.error";
import { IWsResponse } from "../types/ws.respone";

export function messageHandler(con: connection) {
    const roomService = new RoomService();
    const gameService = new GameService();

    return function (msg: Message) {
        try {
            // do not send binary file
            if (msg.type === 'binary')
                return con.send(JSON.stringify({ action: Actions.error, message: "please send utf8 data" }))

            // parse File And Do Action
            let data = JSON.parse(msg.utf8Data);
            console.log(data)
            if (data.action === Actions.create) {
                const response = roomService.createRoom(data);
                return con.send(JSON.stringify(response));
            }

            if (data.action === Actions.join) {
                const resp = roomService.joinRoom(data)

                resp.players.forEach(player => {
                    ConnectionStates.get(player.connectionId)?.connection.send(JSON.stringify(resp));
                })

            }

            if (data.action === Actions.leave) {
                const resp = roomService.leaveRoom(data)
                return resp.game?.players.forEach(player => {
                    ConnectionStates.get(player.connectionId)?.connection.send(JSON.stringify(resp))
                })

            }

            if (data.action === Actions.move) {
                gameService.move(data)

                const game = RoomStates.get(data.gameId);

                const symbol = game!.players.find(player => player.connectionId === data.clientId)!.symbol;

                if (gameService.isUserWin(symbol)) {
                    game!.players.forEach(player => {

                        if (player.connectionId === data.clientId) {
                            const payload: IWsResponse = {
                                action: Actions.win,
                                gameId: data.gameId,
                                clientId: data.clientId,
                                message: "you win"
                            }
                            con.send(JSON.stringify(payload))
                        } else {
                            const payload: IWsResponse = {
                                action: Actions.lose,
                                gameId: data.gameId,
                                clientId: player.connectionId,
                                message: "you lose"
                            }
                            ConnectionStates.get(player.connectionId)?.connection.send(JSON.stringify(payload))
                        }
                    })
                    RoomStates.delete(data.gameId);
                    return;
                }


                game?.players.forEach(player => {
                    const paylaod: IWsResponse = {
                        action: Actions.move,
                        clientId: player.connectionId,
                        gameId: data.gameId,
                        x: data.move.x,
                        y: data.move.y,
                        symbol: symbol!.toString()
                    }
                    if (player.connectionId === data.clientId) {
                        player.myTurn = false;
                    } else {
                        player.myTurn = true;
                    }
                    ConnectionStates.get(player.connectionId)?.connection.send(JSON.stringify(paylaod))
                })
            }
        } catch (err) {
            if (err instanceof WsError)
                return con.send(JSON.stringify(err.error))

            if (err instanceof Error)
                return con.send(JSON.stringify({ action: Actions.error, message: err.message }))

        }
    }
}