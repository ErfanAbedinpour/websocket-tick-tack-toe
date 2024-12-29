import { connection } from "websocket";
import { GameUserSymbol } from "../services/game.service";

interface IConnection {
    connection: connection
}

interface Player {
    connectionId: string;
    symbol: GameUserSymbol,
    myTurn: boolean
}

interface IRoom {
    isMax: boolean;
    players: Player[],
    board: (string | null)[][]
}

export const ConnectionStates = new Map<string, IConnection>();
export const RoomStates = new Map<string, IRoom>(); 