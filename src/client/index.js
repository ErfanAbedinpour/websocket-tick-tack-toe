const ws = new WebSocket("ws://localhost:3000")
const ACTIONS = {
    create: "create",
    join: "join",
    connect: "connect",
    error: "error",
    leave: "leave",
    win: "win",
    move: "move",
    lose: "lose",
    draw: "draw"
}

// clientID
let clientId;
let gameId;

const infoDiv = document.getElementById("information");
const buttonsDiv = document.getElementById("buttons");
const newGameBtn = document.getElementById("newGame");
const leaveGameBtn = document.getElementById("leaveGame");
const gameInput = document.getElementById("gameId-input");
const joinBtn = document.getElementById("join");
const usersDiv = document.getElementById("users");
const gameIdEl = document.getElementById("gameId");
const board = document.getElementById("board")

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
        gameId = data.gameId;
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
        gameId = data.gameId;
        // write GameId to Display to User
        gameIdEl.textContent = `gameId: ${gameId}`;
        for (let i = 0; i < players.length; i++) {
            const p = document.createElement("p");
            p.id = `user-${i + 1}`;
            p.innerText = `user${i + 1}: ${players[i].connectionId}`;
            infoDiv.append(p);
        }

        enableButton(leaveGameBtn)
        enableButton(joinBtn)

        disableButton(newGameBtn)
        disableButton(joinBtn)
    }

    if (data.action === ACTIONS.leave) {
        clearInformations();
        disableButton(leaveGameBtn)
        enableButton(newGameBtn);
        enableButton(joinBtn);
        gameId = null;
    }
    if (data.action === ACTIONS.move) {
        const { x, y, symbol } = data;

        document.getElementById(`${x},${y}`).textContent = symbol;
    }
    if (data.action === ACTIONS.win) {
        gameStateAction("winner")
    }

    if (data.action === ACTIONS.lose) {
        gameStateAction("lose")
    }
    if (data.action === ACTIONS.draw) {
        gameStateAction("draw")
        gameId = null
    }

})

function gameStateAction(state) {
    alert(state)
    enableButton(newGameBtn)
    disableButton(leaveGameBtn)
    disableButton(joinBtn)
    clearInformations();
    clearGameBoard()
    gameId = null
}
// new  Game 
newGameBtn.addEventListener("click", () => {
    createRoom(clientId);
})
// leave Game
leaveGameBtn.addEventListener('click', leaveRoom)

document.querySelectorAll('.cell').forEach(el => {
    el.addEventListener('click', () => {
        if (!gameId)
            return alert("please join ot create new room")

        const [x, y] = el.id.split(",")

        const paylaod = {
            action: ACTIONS.move,
            clientId,
            gameId,
            move: {
                x,
                y
            }
        }
        ws.send(JSON.stringify(paylaod))
    })
})
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
    gameInput.value = "";
}

function clearGameBoard() {
    const nodes = board.childNodes;
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

function move(position) {

}