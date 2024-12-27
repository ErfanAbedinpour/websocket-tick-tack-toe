import { IWsResponse } from "../types/ws.respone";

export abstract class WsError extends Error {
    error: IWsResponse;
    constructor(message: string, error: IWsResponse) {
        super(message)
        this.error = error;
    }
}