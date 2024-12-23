const ws = new WebSocket("ws://localhost:3000")
let id;

ws.addEventListener("message", msg => {
    if (!id && msg.data)
        id = msg.data;


})