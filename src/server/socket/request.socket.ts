import { randomUUID } from "crypto";
import { request } from "websocket";
import { ConnectionStates } from "../types/states";
import { IWsResponse } from "../types/ws.respone";
import { Actions } from "../constant/actions.enum";
import { messageHandler } from "./message.socket";

export function acceptRequest(req: request) {
    const con = req.accept(null, req.origin);
    const clientId = randomUUID();

    // store user states
    ConnectionStates.set(clientId, { connection: con });

    const response: IWsResponse = {
        action: Actions.connect,
        id: clientId
    }
    // send clientId to Client
    con.send(JSON.stringify(response));
    // register message handler
    con.on('message', messageHandler(con));
    return;
}