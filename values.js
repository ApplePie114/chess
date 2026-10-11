const board = document.querySelector(".board");

for(i = 0; i < 64; i++){
    board.innerHTML += `<li class="cell" id="${i}"></li>`
}

const cell = document.querySelectorAll(".cell");

let cells = {};
let pieces = {};

cell.forEach((item) => {
    cells[item.id] = {
        id: item.id,
        row: undefined,
        column: undefined,
        pieceID: "none",
        piece: "none",
        colour: "none"
    }
})

let selectedCell = "none";
let currentTurn = "a";
let cheats = false;

let enemyColour = {
    "a": "b",
    "b": "a"
};

let pieceBehavior = {
    0: pawnBehavior,
    1: rookBehavior,
    2: bishopBehavior,
    3: knightBehavior,
    4: queenBehavior,
    5: kingBehavior
};