const ws = new WebSocket("ws://localhost:3000")
const ACTIONS = {
    create: "create",
    join: "join",
    connect: "connect",
    error: "error",
    leave: "leave"
}

// clientID
let clientId;

const infoDiv = document.getElementById("information");
const buttonsDiv = document.getElementById("buttons");
const newGameBtn = document.getElementById("newGame");
const leaveGameBtn = document.getElementById("leaveGame");

ws.addEventListener("message", msg => {
    const data = JSON.parse(msg.data);

    // error handler 
    if (data.action === ACTIONS.error) {
        return errorHander(data.message)
    }
    // get Client Id
    if (data.action === ACTIONS.connect)
        clientId = data.id;

    if (data.action === ACTIONS.create) {
        // disable button
        const gameId = data.gameId;
        // disable newGameBtn and enable leave Room
        enableButton(leaveGameBtn);
        disableButton(newGameBtn);
        // create p for show roomID
        const p = document.createElement("p");
        p.id = "gameId";
        p.innerHTML = `gameId : ${gameId}`;
        // append tag to page
        infoDiv.append(p);
        return
    }

})

// new  Game 
newGameBtn.addEventListener("click", () => {
    createRoom(clientId);
})
// leave Game
leaveGameBtn.addEventListener('click', leaveRoom)

// functions
function errorHander(msg) {
    alert(msg)
}

function disableButton(btn) {
    btn.disabled = true;
    return;
}

function enableButton(btn) {
    btn.disabled = false;
    return;
}

function createRoom(clientId) {
    const paylaod = {
        clientId: clientId,
        action: ACTIONS.create
    }

    ws.send(JSON.stringify(paylaod));
}

function leaveRoom() {
    const gameIdTag = document.getElementById("gameId");
    const gameId = gameIdTag.textContent.split(':')[1];

    gameIdTag.remove();

    disableButton(leaveGameBtn)
    enableButton(newGameBtn);
    // leave from Room 
    const payload = {
        action: ACTIONS.leave,
        clientId,
        gameId: gameId.trim()
    }

    ws.send(JSON.stringify(payload));
}