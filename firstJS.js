let newX = 0;
let newY = 0;
let startX = 0;
let startY = 0;
let OGstartX = 0;
let OGstartY = 0;

var w = -1;
var selectedPiece;
var possibleMoves = [];
var enPassantCaptures = -1;

const board = phpBoard;
// const boardIndexes = new Map();
// for(var h = 0; h < board.length; h++){
//     boardIndexes.set(h, board[h][2]);
// }

const squaresPerRow = phpSquaresPerRow;
const tempSquareColors = new Map();

let moves = new Array();

let turn = !phpPlayingBlack;//true = white

console.log("board " + board);
console.log(squaresPerRow);

const piece = document.getElementsByClassName('piece');
const square = document.getElementsByClassName('square');



for(var i = 0; i < piece.length; i++){
    // console.log(piece.length);
    piece[i].addEventListener('mousedown', mouseDown);

}


function mouseDown(e){

    console.log(e.target);
    w = parseInt(e.target.id);
    console.log("w " + w);
    console.log("mouseDown");
    console.log(w);
    

    startX = e.clientX;
    startY = e.clientY;
    
    OGstartX = piece[w].style.left;
    OGstartY = piece[w].style.top;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    selectedPiece = board[w];
    console.log("selected piece " + selectedPiece);
    getPossibleMoves();
    glowPossibleSquares();

}

function mouseMove(e){
    // console.log("mouseMove");
    // console.log(w);
    
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    piece[w].style.top = (piece[w].offsetTop - newY) + 'px';
    piece[w].style.left = (piece[w].offsetLeft - newX) + 'px';
}

function mouseUp(e){
    // console.log("mouseUp");
    // console.log(w);
    unglowPossibleSquares();
    for(let i = 0; i < square.length; i++){
        // console.log(i);
        if (((square[i].offsetLeft < piece[w].offsetLeft) && ((piece[w].offsetLeft+ piece[w].offsetWidth)< (square[i].offsetLeft+square[i].offsetWidth)) && (piece[w].offsetTop > square[i].offsetTop) && ((square[i].offsetTop+square[i].offsetHeight)> (piece[w].offsetTop+piece[w].offsetHeight))) && isMoveLegal(i, selectedPiece[2], possibleMoves)){
        
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        
        console.log("f1");
        // console.log("break!");

        possibleMoves = [];
        enPassantCaptures = -1;

        return;

        }else{
            
            // window.alert(square.style.left + " " + newX + " " + square.style.right);
            // console.log("no");
        }
        // console.log("gsl: " + square[i].offsetLeft);
        // console.log("Xoffset: " + piece[w].offsetLeft);
        // console.log("gsr: " + square[i].offsetLeft+square[i].offsetWidth);

        // console.log("gsb: " + square[i].offsetTop);
        // console.log("Yoffset: " + piece[w].offsetTop);
        // console.log("gst: " + square[i].offsetTop+square[i].offsetHeight);
        // console.log("left: " + (square[i].offsetLeft < piece[w].offsetLeft));
        // console.log("right: " + ((piece[w].offsetLeft+ piece[w].offsetWidth)< (square[i].offsetLeft+square[i].offsetWidth)));
        // console.log("top: " + (piece[w].offsetTop > square[i].offsetTop));
        // console.log("bottom: " + ((square[i].offsetTop+square[i].offsetHeight)> (piece[w].offsetTop+piece[w].offsetHeight)));

        

    }
    
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    piece[w].style.left = (OGstartX);
    piece[w].style.top = (OGstartY);
    

    
    // console.log("OGX: " + OGstartX);
    // console.log("OGY: " + OGstartY);
    // piece.removeEventListener('mousedown', mouseDown);
    // document.createElement()
    // window.alert("cheese");

}


function flipBoard(){
    console.log("f5");
    var mid = getMiddleOfBoard();
    var distanceFromMid;
    // var i = 7;
    // distanceFromMid = mid - (square[i].offsetLeft + (square[i].offsetWidth / 2));
    // square[i].style.left = (+distanceFromMid) + 'px';
    // square[0].style.left = (square[63].offsetLeft) + 'px';
    // square[63].style.left = (square[8].offsetLeft) + 'px';
    var currentLeft;
    for(let i = 0; i < square.length; i++){
        currentLeft = parseInt(square[i].style.left) || 0;
        currentTop = parseInt(square[i].style.top) || 0;
        distanceFromMidX = mid - (square[i].offsetLeft + (square[i].offsetWidth/2));
        distanceFromMidY = mid - (square[i].offsetTop + (square[i].offsetHeight/2));
        // console.log("p " + currentLeft);
        // console.log("i " + i);
        // console.log("d " + distanceFromMid);
        // console.log("s " + square[i].offsetLeft);
        square[i].style.left = (currentLeft + (2 * distanceFromMidX)) + 'px';
        square[i].style.top = (currentTop + (2 * distanceFromMidY)) + 'px';
        // square[i].style.left = (currentLeft + 10) + 'px';
        // console.log("n " +  square[i].offsetLeft);
        
    }

    for(let i = 0; i < piece.length; i++){
        currentLeft = parseInt(piece[i].style.left) || 0;
        currentTop = parseInt(piece[i].style.top) || 0;
        distanceFromMidX = mid - (piece[i].offsetLeft + (piece[i].offsetWidth/2));
        distanceFromMidY = mid - (piece[i].offsetTop + (piece[i].offsetHeight/2));
        
        piece[i].style.left = (currentLeft + (2 * distanceFromMidX)) + 'px';
        piece[i].style.top = (currentTop + (2 * distanceFromMidY)) + 'px';
        
        
    }

}

function getMiddleOfBoard(){
    const half = squaresPerRow/2;
    var squareLen = square[0].offsetWidth;
    
    return squareLen * half;

}

///////////////////////////////////////////////////////////////////////////////////////
function isMoveLegal(newSquareIndex, oldSquareIndex, possibleMoves){
    if (possibleMoves.includes(newSquareIndex)){
        turn = !turn;
        //flipBoard();

        if(enPassantCaptures != -1 && ((newSquareIndex == moves[moves.length-1][1][2] + squaresPerRow) || (moves[moves.length-1][1][2] - squaresPerRow))){
            doCapture(enPassantCaptures, true);
            console.log("EN PASSANT");
        }else{
            doCapture(newSquareIndex, false);
        }

        selectedPiece[2] = newSquareIndex;
        moves.push([[selectedPiece[0],selectedPiece[1],oldSquareIndex], [selectedPiece[0],selectedPiece[1],newSquareIndex]]);
        
    }else if(newSquareIndex == oldSquareIndex){
        return true; // I know this seems like it should be false, but true is correct
    }

    
    return possibleMoves.includes(newSquareIndex);

}

//This function will have a lot to it lol
//Calculated when the piece is picked up
function getPossibleMoves(){
    if (!((selectedPiece[0] == 0 && turn == false) || (selectedPiece[0] == 1 && turn == true))){
        // possibleMoves = [selectedPiece[2]];
        if(selectedPiece[1] == 0){
            pawnRules();
        }
    }
    


}

function glowPossibleSquares(){
    for(var i = 0; i < possibleMoves.length; i++){
        if(square[possibleMoves[i]].style.backgroundColor != "blue"){
            tempSquareColors.set(possibleMoves[i], square[possibleMoves[i]].style.backgroundColor);
        }
        
        square[possibleMoves[i]].style.backgroundColor = "blue";
        
        

    }
}

function unglowPossibleSquares(){
    console.log("unglow");
    for(var i = 0; i < possibleMoves.length; i++){
        // console.log(tempSquareColors.get(possibleMoves[i]));
        square[possibleMoves[i]].style.backgroundColor = tempSquareColors.get(possibleMoves[i]);
        // console.log(square[possibleMoves[i]].style.backgroundColor);

        

    }
    tempSquareColors.clear();


}


function pawnRules(){
    //Thought about doing some crazy math so black and white could use the same calculation. But then decided against it bc it's only for pawns
    //Normal move
    if(selectedPiece[0] == 0 && (checkOccupied(selectedPiece[2] - squaresPerRow) == -1)){
        possibleMoves.push(selectedPiece[2] - squaresPerRow);
    }else if(selectedPiece[0] == 1 && (checkOccupied(selectedPiece[2] + squaresPerRow) == -1)){
        possibleMoves.push(selectedPiece[2] + squaresPerRow);
    }


    //Moving two on the first move
    if((selectedPiece[0] == 0) && (squaresPerRow * (squaresPerRow -2)) <= (selectedPiece[2]) && (selectedPiece[2]) < (squaresPerRow * (squaresPerRow -1)) && checkOccupied(selectedPiece[2] - (2 * squaresPerRow)) == -1){
        possibleMoves.push(selectedPiece[2] - (2 * squaresPerRow));
    }else if((selectedPiece[0] == 1) && (squaresPerRow) <= (selectedPiece[2]) && (selectedPiece[2]) < (squaresPerRow * 2) && checkOccupied(selectedPiece[2] + (2 * squaresPerRow)) == -1){
        possibleMoves.push(selectedPiece[2] + (2 * squaresPerRow));
    }

    //Capturing
    if(selectedPiece[0] == 0 && (checkOccupied(selectedPiece[2] - squaresPerRow + 1) == 1) && (selectedPiece[2] % squaresPerRow != squaresPerRow -1)){
        possibleMoves.push(selectedPiece[2] - squaresPerRow + 1);
    }else if(selectedPiece[0] == 1 && (checkOccupied(selectedPiece[2] + squaresPerRow + 1) == 0) && (selectedPiece[2] % squaresPerRow != squaresPerRow -1)){
        possibleMoves.push(selectedPiece[2] + squaresPerRow + 1);
    }

    if(selectedPiece[0] == 0 && (checkOccupied(selectedPiece[2] - squaresPerRow - 1) == 1) && (selectedPiece[2] % squaresPerRow != 0)){
        possibleMoves.push(selectedPiece[2] - squaresPerRow - 1);
    }else if(selectedPiece[0] == 1 && (checkOccupied(selectedPiece[2] + squaresPerRow - 1) == 0) && (selectedPiece[2] % squaresPerRow != 0)){
        possibleMoves.push(selectedPiece[2] + squaresPerRow - 1);
    }

    //En Passant
    if (moves.length > 0){
 
        if((moves[moves.length-1][0][1] == 0) && (moves[moves.length-1][1][2] == moves[moves.length-1][0][2] + (squaresPerRow * 2)) && (selectedPiece[0] == 0) && ((selectedPiece[2] == moves[moves.length-1][1][2] + 1) || (selectedPiece[2] == moves[moves.length-1][1][2] - 1)) && (squaresPerRow*3 <= selectedPiece[2]) && selectedPiece[2] < squaresPerRow*4){//The last two conditions are just for wrap around but I didn't feel like doing the mod math
            possibleMoves.push(moves[moves.length-1][0][2] + squaresPerRow);
            enPassantCaptures = (moves[moves.length-1][1][2]);
        }
        if((moves[moves.length-1][0][1] == 0) && (moves[moves.length-1][1][2] == moves[moves.length-1][0][2] - (squaresPerRow * 2)) && (selectedPiece[0] == 1) && ((selectedPiece[2] == moves[moves.length-1][1][2] + 1) || (selectedPiece[2] == moves[moves.length-1][1][2] - 1)) && (squaresPerRow*(squaresPerRow-4) <= selectedPiece[2]) && selectedPiece[2] < squaresPerRow*(squaresPerRow-3)){//The last two conditions are just for wrap around but I didn't feel like doing the mod math
            possibleMoves.push(moves[moves.length-1][0][2] - squaresPerRow);
            enPassantCaptures = (moves[moves.length-1][1][2]);
        }
    }
    
    

    

}

//return -1 for empty, 0 for white, 1 for black
function checkOccupied(index){
    for(var i = 0; i < board.length; i++){
        if(board[i][2] == index){
            return board[i][0];
        }

    }
    return -1;
}

function doCapture(squareIndex, isEnpassant){
    if (!isEnpassant && checkOccupied(squareIndex) == -1){
        return;
    }else{
        for (var i = 0; i < board.length; i++){
            if (board[i][2] == squareIndex){
                console.log("capture");
                board[i][2] = -1;
                piece[i].style.display = 'none'; //Way easier than removing from DOM and remapping indexes. I don't care if it's a bad practice
                console.log(board);
                // boardIndexes.delete(i);
                // console.log(boardIndexes);
                console.log(piece);
                // piece[i].remove();
            }
        }
    }

}