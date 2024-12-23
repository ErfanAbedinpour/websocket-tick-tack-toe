import { randomUUID } from "crypto";
import { connection } from "websocket";
import { RoomDto } from "./dto/create-toom.dto";
import { ConnectionStates, GameStates } from "../types/states";
import { IWsResponse } from "../types/ws.respone";
import { Actions } from "../constant/actions.enum";
import { JoinRoomDto } from "./dto/join-room.dto";
import { LeaveRoomDto } from "./dto/leave-room.dto";

export class RoomService {
    constructor(private con: connection) { }
    // create room
    createRoom(data: RoomDto) {
        const gameId = randomUUID();
        const clientId = data.clientId;


        GameStates.set(gameId, { players: [clientId], isMax: false });

        const response: IWsResponse = {
            action: Actions.create,
            gameId: gameId
        }

        return this.con.send(JSON.stringify(response));
    }

    // join room
    joinRoom(data: JoinRoomDto) {
        const gameId = data.gameId;
        const clientId = data.clientId;
        const game = GameStates.get(gameId);

        if (!game) {
            const payload: IWsResponse = {
                action: Actions.error,
                message: "game not found"
            }
            return this.con.send(JSON.stringify(payload));
        }

        if (game.isMax) {
            const payload: IWsResponse = {
                action: Actions.error,
                message: "game is ful"
            }
            return this.con.send(JSON.stringify(payload));
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
    // leave room
    leaveRoom(data: LeaveRoomDto) {
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
}