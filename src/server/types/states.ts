import { connection } from "websocket";

interface IConnection {
    id: string;
    connection: connection
}

export const states: IConnection[] = [];