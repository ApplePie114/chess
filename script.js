/*
    PIECE IDS

    0-pawn
    1-rook
    2-bishop
    3-knight
    4-queen
    5-king

    COLOURS

    a-white
    b-black
*/

function startGame(){
    makeCoordinates();

    asignPiece(0, 1, "b", 1);
    asignPiece(1, 3, "b", 1);
    asignPiece(2, 2, "b", 1);
    asignPiece(3, 4, "b", 1);
    asignPiece(4, 5, "b", 1);
    asignPiece(5, 2, "b", 2);
    asignPiece(6, 3, "b", 2);
    asignPiece(7, 1, "b", 2);
    asignPiece(8, 0, "b", 1);
    asignPiece(9, 0, "b", 2);
    asignPiece(10, 0, "b", 3);
    asignPiece(11, 0, "b", 4);
    asignPiece(12, 0, "b", 5);
    asignPiece(13, 0, "b", 6);
    asignPiece(14, 0, "b", 7);
    asignPiece(15, 0, "b", 8);

    asignPiece(48, 0, "a", 1);
    asignPiece(49, 0, "a", 2);
    asignPiece(50, 0, "a", 3);
    asignPiece(51, 0, "a", 4);
    asignPiece(52, 0, "a", 5);
    asignPiece(53, 0, "a", 6);
    asignPiece(54, 0, "a", 7);
    asignPiece(55, 0, "a", 8);
    asignPiece(56, 1, "a", 1);
    asignPiece(57, 3, "a", 1);
    asignPiece(58, 2, "a", 1);
    asignPiece(59, 4, "a", 1);
    asignPiece(60, 5, "a", 1);
    asignPiece(61, 2, "a", 2);
    asignPiece(62, 3, "a", 2);
    asignPiece(63, 1, "a", 2);

    for(i=0; i<64; i++){
        if(cells[i].pieceID !== "none"){
            pieces[cells[i].pieceID] = {
                pieceID: cells[i].pieceID,
                cellID: i,
                row: cells[i].row,
                column: cells[i].column,
                piece: cells[i].piece,
                colour: cells[i].colour,
                hasMoved: false
            }
        }
    };

    refreshDangerZone();
    colourCells();
};

function makeCoordinates(){
    cell.forEach((item) => {
        if(item.id % 8 == 0){
            cells[item.id].column = 1;
        } else if(item.id % 8 == 1){
            cells[item.id].column = 2;
        } else if(item.id % 8 == 2){
            cells[item.id].column = 3;
        } else if(item.id % 8 == 3){
            cells[item.id].column = 4;
        } else if(item.id % 8 == 4){
            cells[item.id].column = 5;
        } else if(item.id % 8 == 5){
            cells[item.id].column = 6;
        } else if(item.id % 8 == 6){
            cells[item.id].column = 7;
        } else if(item.id % 8 == 7){
            cells[item.id].column = 8;
        }
    });
    cell.forEach((item) => {
        if(item.id < 8) {
            cells[item.id].row = 1;
        } else if(item.id < 16) {
            cells[item.id].row = 2;
        } else if(item.id < 24) {
            cells[item.id].row = 3;
        } else if(item.id < 32) {
            cells[item.id].row = 4;
        } else if(item.id < 40) {
            cells[item.id].row = 5;
        } else if(item.id < 48) {
            cells[item.id].row = 6;
        } else if(item.id < 56) {
            cells[item.id].row = 7;
        } else if(item.id < 64) {
            cells[item.id].row = 8;
        } 
    })
};

function asignPiece(cellID, pieceID, colour, additionalIDs){
    cell[cellID].innerHTML = `<img src="images/${pieceID}${colour}.png" alt=""></img>`
    cells[cellID].pieceID = `${pieceID}${colour}(${additionalIDs})`;
    cells[cellID].piece = pieceID;
    cells[cellID].colour = colour;
}

function clearCell(cellID){
    cell[cellID].innerHTML = ""
    cells[cellID].pieceID = "none";
    cells[cellID].colour = "none";
}

function colourCells(){
    cell.forEach((item) => {
        if((Number(item.id) + cells[item.id].row) % 2 === 0){
            item.style.backgroundColor = "#999"
        }
    })
}

function showAvailableMoves(cellID){
    let listOfMoves = pieceBehavior[cells[cellID].piece](cellID, cells[cellID].colour).moves;
    let listOfCaptures = pieceBehavior[cells[cellID].piece](cellID, cells[cellID].colour).captures;
    let newListOfMoves = removeKingInDangerMoves(cellID, listOfMoves, currentTurn);
    let newListOfCaptures = removeKingInDangerMoves(cellID, listOfCaptures, currentTurn);
    markCells(newListOfMoves);
    markPiece(cellID);
    markCaptures(newListOfCaptures);
    selectedCell = cellID;
}

function movePiece(sourceCellID, targetCellID){
    clearMarkers();

    if(cells[targetCellID].pieceID !== "none"){
        delete pieces[cells[targetCellID].pieceID];
    }

    cell[targetCellID].innerHTML = cell[sourceCellID].innerHTML;
    cell[sourceCellID].innerHTML = "";
    
    const currentPiece = pieces[cells[sourceCellID].pieceID];
    currentPiece.cellID = Number(targetCellID);
    currentPiece.row = cells[targetCellID].row;
    currentPiece.column = cells[targetCellID].column;
    currentPiece.hasMoved = true;

    cells[targetCellID].piece = cells[sourceCellID].piece;
    cells[targetCellID].pieceID = cells[sourceCellID].pieceID;
    cells[targetCellID].colour = cells[sourceCellID].colour;

    cells[sourceCellID].piece = "none";
    cells[sourceCellID].pieceID = "none";
    cells[sourceCellID].colour = "none";

    if(currentTurn === "a"){
        currentTurn = "b";
    } else if(currentTurn === "b"){
        currentTurn = "a";
    };

    if(checkIfCheck(targetCellID)){
        markKing(currentTurn);
    };
    refreshDangerZone();
}

function checkIfCheck(cellID){
    let whiteDangerZoneIncludesBlackKing = false;
    let blackDangerZoneIncludesWhiteKing = false;
    let whiteDangerZone = pieceBehavior[cells[cellID].piece](cellID, cells[cellID].colour).whiteDangerZone;
    let blackDangerZone = pieceBehavior[cells[cellID].piece](cellID, cells[cellID].colour).blackDangerZone;
    whiteDangerZone.forEach((item) => {
        if(cells[item].pieceID === "5b(1)"){
            whiteDangerZoneIncludesBlackKing = true;
        }
    });
    blackDangerZone.forEach((item) => {
        if(cells[item].pieceID === "5a(1)"){
            blackDangerZoneIncludesWhiteKing = true;
        }
    });
    if((cells[cellID].colour === "a" &&
        whiteDangerZoneIncludesBlackKing) ||
        (cells[cellID].colour === "b" &&
        blackDangerZoneIncludesWhiteKing)){
            return true;
    } else {
            return false;
    }
}

function clearMarkers(){
    let marked = document.querySelectorAll(".marked");
    marked.forEach((item) => {
        item.classList.remove("marked");
    });
    let markedPiece = document.querySelectorAll(".markedPiece");
    markedPiece.forEach((item) => {
        item.classList.remove("markedPiece");
    });
    let markedForCapture = document.querySelectorAll(".markedForCapture");
    markedForCapture.forEach((item) => {
        item.classList.remove("markedForCapture");
    });
    let markedKing = document.querySelectorAll(".markedKing");
    markedKing.forEach((item) => {
        item.classList.remove("markedKing");
    });
}

function markCells(arr){
    let hasMarker = document.querySelectorAll(".marked");
    hasMarker.forEach((item) => {
        item.classList.remove("marked");
    });
    arr.forEach((item) => {
        cell[item].classList.add("marked");
    })
}

function markPiece(cellID){
    let hasMarker = document.querySelectorAll(".markedPiece");
    hasMarker.forEach((item) => {
        item.classList.remove("markedPiece");
    });
    cell[cellID].classList.add("markedPiece");
}

function markCaptures(arr){
    let hasMarker = document.querySelectorAll(".markedForCapture");
    hasMarker.forEach((item) => {
        item.classList.remove("markedForCapture");
    });
    arr.forEach((item) => {
        cell[item].classList.add("markedForCapture");
    })
}

function markKing(colour){
    if(colour === "a"){
        cell[pieces["5a(1)"].cellID].classList.add("markedKing");
    } else if(colour === "b"){
        cell[pieces["5b(1)"].cellID].classList.add("markedKing");
    }
}

function refreshDangerZone(){
    let whiteDangerZone = document.querySelectorAll(".whiteDangerZone");
    whiteDangerZone.forEach((item) => {
        item.classList.remove("whiteDangerZone");
    });
    let blackDangerZone = document.querySelectorAll(".blackDangerZone");
    blackDangerZone.forEach((item) => {
        item.classList.remove("blackDangerZone");
    });
    cell.forEach((item) => {
        let currentPiece = pieces[cells[item.id].pieceID];
        if(currentPiece !== undefined && cells[item.id].piece !== "none"){
            let whiteListOfCaptures = pieceBehavior[cells[item.id].piece](item.id, currentPiece.colour).whiteDangerZone;
            whiteListOfCaptures.forEach((item) => {
                cell[item].classList.add("whiteDangerZone");
            });

            let blackListOfCaptures = pieceBehavior[cells[item.id].piece](item.id, currentPiece.colour).blackDangerZone;
            blackListOfCaptures.forEach((item) => {
                cell[item].classList.add("blackDangerZone");
            });
        }
    })
}

function testIfKingIsSafe(sourceCellID, targetCellID, colour){
    //set original source cells and target cells to restore
    let ogSourcePiece = cells[sourceCellID].piece;
    let ogTargetPiece = cells[targetCellID].piece;

    //clear source cell to see if king is still safe
    cells[sourceCellID].piece = "none";
    //refresh danger zone
    refreshDangerZone();
    //if same colour king is in the opposite colour danger zone, return false
    if(((cell[pieces["5a(1)"].cellID].classList.contains("blackDangerZone") &&
        colour === "a") ||
       (cell[pieces["5b(1)"].cellID].classList.contains("whiteDangerZone") &&
        colour === "b")) &&
        ogSourcePiece !== 5){
            //if current piece appears on target cell, is king safe?
            //set target cell to current piece
            cells[targetCellID].piece = ogSourcePiece;
            //refresh danger zone
            refreshDangerZone();
            //if same colour king is in the opposite colour danger zone, return false
            if((cell[pieces["5a(1)"].cellID].classList.contains("blackDangerZone") &&
                colour === "a") ||
                (cell[pieces["5b(1)"].cellID].classList.contains("whiteDangerZone") &&
                colour === "b")){
                    //restore source cell
                    cells[sourceCellID].piece = ogSourcePiece;
                    refreshDangerZone();

                    //restore target cell
                    cells[targetCellID].piece = ogTargetPiece;
                    refreshDangerZone();

                    return false;
            } else {
                //restore source cell
                cells[sourceCellID].piece = ogSourcePiece;
                refreshDangerZone();

                //restore target cell
                cells[targetCellID].piece = ogTargetPiece;
                refreshDangerZone();

                return true;
            }
    } else {
            //if source cell is king
            if(ogSourcePiece === 5){
                //if current piece appears on target cell, is king safe?
                //if same colour king is in the opposite colour danger zone, return false
                if((cell[targetCellID].classList.contains("blackDangerZone") &&
                    colour === "a") ||
                    (cell[targetCellID].classList.contains("whiteDangerZone") &&
                    colour === "b")){
                        //restore source cell
                        cells[sourceCellID].piece = ogSourcePiece;
                        refreshDangerZone();

                        //restore target cell
                        cells[targetCellID].piece = ogTargetPiece;
                        refreshDangerZone();

                        return false;
                }
            };
            //restore source cell
            cells[sourceCellID].piece = ogSourcePiece;
            refreshDangerZone();

            //restore target cell
            cells[targetCellID].piece = ogTargetPiece;
            refreshDangerZone();

            return true;
    }
}

function removeKingInDangerMoves(sourceCellID, movesArr, colour){
    return movesArr.filter((item) => {
        if(testIfKingIsSafe(sourceCellID, item, colour)){
            return true;
        } else {
            return false;
        }
    });
}

function triggerCheckMate(colour){
    if(colour === "a"){
        alert("White wins!");
    } else if(colour === "b"){
        alert("Black wins!");
    }
}

startGame();

cell.forEach((item) => {
    item.addEventListener("click", () => {
        if((currentTurn === "a" && cells[item.id].colour === "a" ) ||
           (currentTurn === "b" && cells[item.id].colour === "b" )){
            showAvailableMoves(item.id);
        }
    });
    item.addEventListener("click", () => {
        if(selectedCell !== "none" &&
           item.classList.contains("marked")){
            movePiece(selectedCell, item.id)
        }
    });
})