import { connection } from "websocket";

interface IConnection {
    connection: connection
}

interface IGame {
    isMax: boolean;
    players: string[]
}

export const ConnectionStates = new Map<string, IConnection>();
export const GameStates = new Map<string, IGame>(); 