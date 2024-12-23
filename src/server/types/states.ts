import { connection } from "websocket";

interface IConnection {
    clientId: string;
    connection: connection
}

interface IGame {
    gameId: string;
    Players: connection[]
}

export const ConnectionStates = new Map<string, IConnection>();
export const GameStates = new Map<string, IGame>(); 