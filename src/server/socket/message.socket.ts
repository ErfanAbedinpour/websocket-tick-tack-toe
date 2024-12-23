import { connection, Message } from "websocket";
import { Actions } from "../constant/actions.enum";
import { RoomService } from "../services/room.service";

export function messageHandler(con: connection) {
    const roomService = new RoomService(con);

    return function (msg: Message) {
        // do not send binary file
        if (msg.type === 'binary')
            return con.send(JSON.stringify({ action: Actions.error, message: "please send utf8 data" }))

        // parse File And Do Action
        const data = JSON.parse(msg.utf8Data);

        if (data.action === Actions.create) {
            return roomService.createRoom(data);

        }

        if (data.action === Actions.join) {
            return roomService.joinRoom(data)

        }


        if (data.action === Actions.leave) {
            return roomService.leaveRoom(data)

        }
    }
}