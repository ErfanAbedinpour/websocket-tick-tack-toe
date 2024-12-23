import { connection } from "websocket";

interface IConnection {
    connection: connection
}

interface IGame {
    Players: connection[]
}

export const ConnectionStates = new Map<string, IConnection>();
export const GameStates = new Map<string, IGame>(); 