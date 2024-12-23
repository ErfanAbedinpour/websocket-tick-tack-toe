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
const gameInput = document.getElementById("gameId-input");
const joinBtn = document.getElementById("join");
const usersDiv = document.getElementById("users");
const gameIdEl = document.getElementById("gameId");

ws.addEventListener("message", msg => {
    const data = JSON.parse(msg.data);

    // error handler 
    if (data.action === ACTIONS.error) {
        return errorHander(data.message)
    }
    // get Client Id
    if (data.action === ACTIONS.connect) {
        clientId = data.id;
        return;
    }
    // when user create room
    if (data.action === ACTIONS.create) {
        // disable button
        const gameId = data.gameId;
        // disable newGameBtn and enable leave Room
        enableButton(leaveGameBtn);
        disableButton(newGameBtn);
        disableButton(joinBtn)
        // create p for show roomID
        gameIdEl.textContent = `gameId : ${gameId}`;
        // append tag to page
        return
    }

    // user joined to room
    if (data.action === ACTIONS.join) {
        const players = data.players;
        const gameId = data.gameId;
        // write GameId to Display to User
        gameIdEl.textContent = `gameId: ${gameId}`;
        for (let i = 0; i < players.length; i++) {
            const p = document.createElement("p");
            p.id = `user-${i + 1}`;
            p.innerText = `user${i + 1}: ${players[i]}`;
            infoDiv.append(p);
        }

        enableButton(leaveGameBtn)
        enableButton(joinBtn)

        disableButton(newGameBtn)
        disableButton(joinBtn)
    }

    if (data.action === ACTIONS.leave) {
        clearInformations();
        // gameIdEl.innerText = "gameId : ";
        disableButton(leaveGameBtn)
        enableButton(newGameBtn);
        enableButton(joinBtn);
    }


})

// new  Game 
newGameBtn.addEventListener("click", () => {
    createRoom(clientId);
})
// leave Game
leaveGameBtn.addEventListener('click', leaveRoom)


// join Game
joinBtn.addEventListener('click', () => {
    const gameId = gameInput.value;
    console.log("client id is ", clientId)

    const paylaod = {
        action: ACTIONS.join,
        clientId,
        gameId
    }

    ws.send(JSON.stringify(paylaod))
})
// functions

function errorHander(msg) {
    alert(msg)
}
// disable element
function disableButton(btn) {
    btn.disabled = true;
    return;
}
// enable element
function enableButton(btn) {
    btn.disabled = false;
    return;
}
// create new room
function createRoom(clientId) {
    const paylaod = {
        clientId: clientId,
        action: ACTIONS.create
    }

    ws.send(JSON.stringify(paylaod));
}

function clearInformations() {
    const nodes = infoDiv.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        console.log(nodes[i])
        nodes[i].innerText = "";
    }
}
// leave room
function leaveRoom() {
    const gameId = gameIdEl.textContent.split(':')[1];

    // leave from Room 
    const payload = {
        action: ACTIONS.leave,
        clientId,
        gameId: gameId.trim()
    }

    ws.send(JSON.stringify(payload));
}