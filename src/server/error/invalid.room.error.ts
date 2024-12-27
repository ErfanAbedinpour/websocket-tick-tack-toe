import { Actions } from "../constant/actions.enum";
import { WsError } from "./ws.error";

export class RoomNotFound extends WsError {
    constructor(message: string) {
        super(message, { action: Actions.error, message })
    }
}