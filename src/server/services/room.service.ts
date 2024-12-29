import { randomUUID } from "crypto";
import { connection } from "websocket";
import { RoomDto } from "./dto/create-toom.dto";
import { ConnectionStates, RoomStates } from "../types/states";
import { IWsResponse } from "../types/ws.respone";
import { Actions } from "../constant/actions.enum";
import { JoinRoomDto } from "./dto/join-room.dto";
import { LeaveRoomDto } from "./dto/leave-room.dto";
import { GameUserSymbol } from "./game.service";
import { FullRoomRoom } from "../error/maxRoom.error";
import { RoomNotFound } from "../error/invalid.room.error";

export class RoomService {
    // create room
    createRoom(data: RoomDto) {
        const gameId = randomUUID();
        const clientId = data.clientId;


        const board = Array(3).fill(undefined).map(() => Array(3).fill(null));

        RoomStates.set(gameId, {
            players: [{
                connectionId: clientId,
                symbol: GameUserSymbol.x,
                myTurn: true

            }], isMax: false, board
        });

        const response: IWsResponse = {
            action: Actions.create,
            gameId: gameId
        }

        return response
    }
    // join room
    joinRoom(data: JoinRoomDto) {
        const gameId = data.gameId;
        const clientId = data.clientId;
        const game = RoomStates.get(gameId);

        if (!game) {
            throw new RoomNotFound("room not found");
        }

        if (game.isMax) {
            throw new FullRoomRoom("room is max ");
        }

        game.players.push({
            connectionId: clientId,
            symbol: GameUserSymbol.y,
            myTurn: false
        });
        game.isMax = true;

        const paylaod = {
            action: Actions.join,
            gameId: gameId,
            players: game.players
        }

        return paylaod;
    }
    // leave room
    leaveRoom(data: LeaveRoomDto) {
        const gameId = data.gameId.trim();
        const clientId = data.clientId;
        const game = RoomStates.get(gameId);

        RoomStates.delete(gameId);

        const paylaod = {
            action: Actions.leave,
            clientId: clientId,
            gameId: gameId,
        }

        return { paylaod, game };
    }
}