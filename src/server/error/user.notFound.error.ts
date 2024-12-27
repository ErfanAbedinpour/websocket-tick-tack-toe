import { Actions } from "../constant/actions.enum";
import { WsError } from "./ws.error";

export class UserNotFound extends WsError {
    constructor(message: string) {
        super(message, { action: Actions.error, message: message })
    }
}