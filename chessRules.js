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
var isMouseDown = false;

const boardArray = phpBoard;

class bPiece{ //boardPiece
    //White/black 0=white, piece_type pawn=0 bishop=1 knight=2 rook=3 queen=4 king=5, square index
    #color;
    #pieceType;
    #location;
    constructor(color, pieceType, location){
        if (color == 0 || color == "white"){
            this.#color = "white";
        }
        else{
            this.#color = "black";
        }

        if (pieceType == 0 || pieceType == "pawn"){
            this.#pieceType= "pawn";
        }
        else if (pieceType == 1 || pieceType == "bishop"){
            this.#pieceType = "bishop";
        }
        else if (pieceType == 2 || pieceType == "knight"){
            this.#pieceType = "knight";
        }
        else if (pieceType == 3 || pieceType == "rook"){
            this.#pieceType = "rook";
        }
        else if (pieceType == 4 || pieceType == "queen"){
            this.#pieceType = "queen";
        }
        else if (pieceType == 5 || pieceType == "king"){
            this.#pieceType = "king";
        }

        this.#location = location;

    }


    setPieceType(newPieceType){
        this.#pieceType = newPieceType;
    }

    setLocation(newLocation){
        this.#location = newLocation;
    }


    getColor(){
        return this.#color;
    }
    getPieceType(){
        return this.#pieceType;
    }
    getLocation(){
        return this.#location;
    }


}



// const boardIndexes = new Map();
// for(var h = 0; h < board.length; h++){
//     boardIndexes.set(h, board[h][2]);
// }

const squaresPerRow = phpSquaresPerRow;
const tempSquareColors = new Map();

var moves = new Array();

let turn = !phpPlayingBlack;//true = white

console.log(squaresPerRow);

const piece = document.getElementsByClassName('piece');
const square = document.getElementsByClassName('square');

var board = new Array(boardArray.length);
for (var i = 0; i < boardArray.length; i++){
    board[i] = new bPiece(boardArray[i][0], boardArray[i][1], boardArray[i][2]);
}





for(var i = 0; i < piece.length; i++){
    // console.log(piece.length);
    piece[i].addEventListener('mousedown', mouseDown);
    piece[i].style.zIndex = '50';

}


function mouseDown(e){
    if(isMouseDown){
        return;
    }
    isMouseDown = true;
    console.log(e.target);
    w = parseInt(e.target.id);
    console.log("w " + w);
    console.log("mouseDown");
    

    startX = e.clientX;
    startY = e.clientY;
    
    OGstartX = piece[w].style.left;
    OGstartY = piece[w].style.top;


    console.log("1 OGstartX " + OGstartX);
    console.log("1 OGstartY " + OGstartY);

    piece[w].style.zIndex = '100';

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    selectedPiece = board[w];
    console.log("selected piece " + selectedPiece.getLocation());
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
    isMouseDown = false;
    // console.log("mouseUp");
    // console.log(w);
    unglowPossibleSquares();
    piece[w].style.zIndex = '50';
    for(let i = 0; i < square.length; i++){
        // console.log(i);
        if (((square[i].offsetLeft < piece[w].offsetLeft) && ((piece[w].offsetLeft+ piece[w].offsetWidth)< (square[i].offsetLeft+square[i].offsetWidth)) && (piece[w].offsetTop > square[i].offsetTop) && ((square[i].offsetTop+square[i].offsetHeight)> (piece[w].offsetTop+piece[w].offsetHeight))) && isMoveLegal(i, selectedPiece.getLocation(), possibleMoves)){
        
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);

        
        // console.log("break!");

        possibleMoves = [];
        enPassantCaptures = -1;
        selectedPiece = null;

        return;

        }else{
            
            // window.alert("what");
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
    console.log("REVERT TO OG X AND Y");
    console.log("2 OGstartX " + OGstartX);
    console.log("2 OGstartY " + OGstartY);
    possibleMoves = [];
    
    

    
    // console.log("OGX: " + OGstartX);
    // console.log("OGY: " + OGstartY);
    // piece.removeEventListener('mousedown', mouseDown);
    // document.createElement()
    // window.alert("cheese");

}


function flipBoard(){
    var mid = getMiddleOfBoard();
    // var distanceFromMid;
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
        // flipBoard();

        if(enPassantCaptures != -1 && ((newSquareIndex == moves[moves.length-1][1].getLocation() + squaresPerRow) || (moves[moves.length-1][1].getLocation() - squaresPerRow))){
            doCapture(enPassantCaptures, true);
            // console.log("EN PASSANT");
        }else{
            doCapture(newSquareIndex, false);
        }

        if(selectedPiece.getPieceType() == "king" && Math.abs(newSquareIndex - oldSquareIndex) == 2){
            console.log("HERE");
            moveRookForCastle(newSquareIndex, oldSquareIndex);
        }

        var oldPiece = new bPiece(selectedPiece.getColor(), selectedPiece.getPieceType(), oldSquareIndex);
        selectedPiece.setLocation(newSquareIndex);
        moves.push([oldPiece, selectedPiece]);

        
    }else if(newSquareIndex == oldSquareIndex){
        return true; // I know this seems like it should be false, but true is correct
    }

    
    return possibleMoves.includes(newSquareIndex);

}

//This function will have a lot to it lol
//Calculated when the piece is picked up
function getPossibleMoves(){
    // console.log("gpm " + (!((selectedPiece.getColor == "white" && turn == false) || (selectedPiece.getColor() == "black" && turn == true))));
    if (!((selectedPiece.getColor() == "white" && turn == false) || (selectedPiece.getColor() == "black" && turn == true))){
        // possibleMoves = [selectedPiece[2]];
        if(selectedPiece.getPieceType() == "pawn"){
            possibleMoves.push(...pawnRules());
        }

        else if(selectedPiece.getPieceType() == "bishop"){
            possibleMoves.push(...bishopRules());
        }

        else if(selectedPiece.getPieceType() == "rook"){
            possibleMoves.push(...rookRules());
        }

        else if(selectedPiece.getPieceType() == "queen"){
            possibleMoves.push(...bishopRules());
            possibleMoves.push(...rookRules());
            
        }

        else if(selectedPiece.getPieceType() == "knight"){
            possibleMoves.push(...knightRules());
        }
        else if(selectedPiece.getPieceType() == "king"){
            possibleMoves.push(...kingRules());
        }
    }


    // checkCheck(-1, "white", ["UP", "UPRIGHT", "RIGHT", "DOWNRIGHT", "DOWN", "DOWNLEFT", "LEFT", "UPLEFT"]);
    


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
    var localPossibleMoves = [];
    //Thought about doing some crazy math so black and white could use the same calculation. But then decided against it bc it's only for pawns
    //Normal move
    if(selectedPiece.getColor() == "white" && (checkOccupied(selectedPiece.getLocation() - squaresPerRow, board) == -1)){
        localPossibleMoves.push(selectedPiece.getLocation() - squaresPerRow);
    }else if(selectedPiece.getColor() == "black" && (checkOccupied(selectedPiece.getLocation() + squaresPerRow, board) == -1)){
        localPossibleMoves.push(selectedPiece.getLocation() + squaresPerRow);
    }


    //Moving two on the first move
    if((selectedPiece.getColor() == "white") && (squaresPerRow * (squaresPerRow -2)) <= (selectedPiece.getLocation()) && (selectedPiece.getLocation()) < (squaresPerRow * (squaresPerRow -1)) && checkOccupied(selectedPiece.getLocation() - (2 * squaresPerRow), board) == -1 && checkOccupied(selectedPiece.getLocation() - squaresPerRow, board) == -1){
        localPossibleMoves.push(selectedPiece.getLocation() - (2 * squaresPerRow));
    }else if((selectedPiece.getColor() == "black") && (squaresPerRow) <= (selectedPiece.getLocation()) && (selectedPiece.getLocation()) < (squaresPerRow * 2) && checkOccupied(selectedPiece.getLocation() + (2 * squaresPerRow), board) == -1 && checkOccupied(selectedPiece.getLocation() + squaresPerRow, board) == -1){
        localPossibleMoves.push(selectedPiece.getLocation() + (2 * squaresPerRow));
    }

    //Capturing
    
    if(selectedPiece.getColor() == "white" && (checkOccupied(selectedPiece.getLocation() - squaresPerRow + 1, board) == "black") && (selectedPiece.getLocation() % squaresPerRow != squaresPerRow -1)){
        localPossibleMoves.push(selectedPiece.getLocation() - squaresPerRow + 1);
    }else if(selectedPiece.getColor() == "black" && (checkOccupied(selectedPiece.getLocation() + squaresPerRow + 1, board) == "white") && (selectedPiece.getLocation() % squaresPerRow != squaresPerRow -1)){
        localPossibleMoves.push(selectedPiece.getLocation() + squaresPerRow + 1);
    }

    if(selectedPiece.getColor() == "white" && (checkOccupied(selectedPiece.getLocation() - squaresPerRow - 1, board) == "black") && (selectedPiece.getLocation() % squaresPerRow != 0)){
        localPossibleMoves.push(selectedPiece.getLocation() - squaresPerRow - 1);
    }else if(selectedPiece.getColor() == "black" && (checkOccupied(selectedPiece.getLocation() + squaresPerRow - 1, board) == "white") && (selectedPiece.getLocation() % squaresPerRow != 0)){
        localPossibleMoves.push(selectedPiece.getLocation() + squaresPerRow - 1);
    }

    //En Passant
    if (moves.length > 0){
        console.log("moves, checking for en " + moves[moves.length-1][0].getPieceType());
        if((moves[moves.length-1][0].getPieceType() == "pawn") && (moves[moves.length-1][1].getLocation() == moves[moves.length-1][0].getLocation() + (squaresPerRow * 2)) && (selectedPiece.getColor() == "white") && ((selectedPiece.getLocation() == moves[moves.length-1][1].getLocation() + 1) || (selectedPiece.getLocation() == moves[moves.length-1][1].getLocation() - 1)) && (squaresPerRow*3 <= selectedPiece.getLocation()) && selectedPiece.getLocation() < squaresPerRow*4){//The last two conditions are just for wrap around but I didn't feel like doing the mod math
            localPossibleMoves.push(moves[moves.length-1][0].getLocation() + squaresPerRow);
            enPassantCaptures = (moves[moves.length-1][1].getLocation());
        }
        if((moves[moves.length-1][0].getPieceType() == "pawn") && (moves[moves.length-1][1].getLocation() == moves[moves.length-1][0].getLocation() - (squaresPerRow * 2)) && (selectedPiece.getColor() == "black") && ((selectedPiece.getLocation() == moves[moves.length-1][1].getLocation() + 1) || (selectedPiece.getLocation() == moves[moves.length-1][1].getLocation() - 1)) && (squaresPerRow*(squaresPerRow-4) <= selectedPiece.getLocation()) && selectedPiece.getLocation() < squaresPerRow*(squaresPerRow-3)){//The last two conditions are just for wrap around but I didn't feel like doing the mod math
            localPossibleMoves.push(moves[moves.length-1][0].getLocation() - squaresPerRow);
            enPassantCaptures = (moves[moves.length-1][1].getLocation());
        }
    }

    console.log("before " + localPossibleMoves);
    localPossibleMoves = checkCheckCallFunc(selectedPiece.getColor(), localPossibleMoves);
    console.log("after " + localPossibleMoves);

    return localPossibleMoves;
    
}

function bishopRules(){
    var localPossibleMoves = [];
    var location = selectedPiece.getLocation(); //Avoiding doing the same function call several times
    var color = selectedPiece.getColor();
    
    localPossibleMoves.push(...directionalCheck(location, squaresPerRow + 1, color, board));
    localPossibleMoves.push(...directionalCheck(location, squaresPerRow - 1, color, board));
    localPossibleMoves.push(...directionalCheck(location, -squaresPerRow + 1, color, board));
    localPossibleMoves.push(...directionalCheck(location, -squaresPerRow - 1, color, board));



    localPossibleMoves = checkCheckCallFunc(color, localPossibleMoves);

    return localPossibleMoves;
}

function rookRules(){ //Castling will be handled by the king, or it's own function. idk
    var localPossibleMoves = [];
    var location = selectedPiece.getLocation(); //Avoiding doing the same function call several times
    var color = selectedPiece.getColor();
    
    localPossibleMoves.push(...directionalCheck(location, 1, color, board));
    localPossibleMoves.push(...directionalCheck(location, -1, color, board));
    localPossibleMoves.push(...directionalCheck(location, squaresPerRow, color, board));
    localPossibleMoves.push(...directionalCheck(location, -squaresPerRow, color, board));

    
    localPossibleMoves = checkCheckCallFunc(color, localPossibleMoves);

    return localPossibleMoves;
   
}

function checkCheckCallFunc(color, possibleMoves){
    for (var i = 0; i < possibleMoves.length; i++){
        if(checkCheck(possibleMoves[i], color, ["UP", "UPRIGHT", "RIGHT", "DOWNRIGHT", "DOWN", "DOWNLEFT", "LEFT", "UPLEFT"])){
            possibleMoves.splice(i--, 1);
        }
    }
    return possibleMoves;
}

function directionalCheck(oldIndex, increment, checkColor, board){ //Returns array of open squares or an opponent in that direction - bishops, rooks, queens
    var retVal = [];
    var prevIndex = oldIndex;
    index = oldIndex + increment;
    
    var modValue = -1;//Straight up or down
    if (increment == 1 || increment == squaresPerRow + 1 || increment == -squaresPerRow + 1){
        modValue = squaresPerRow-1;
    }else if(increment == -1 || increment == squaresPerRow - 1 || increment == -squaresPerRow - 1){
        modValue = 0;
    }
    
    while ((index >= 0) && (index < squaresPerRow * squaresPerRow) && (prevIndex  % squaresPerRow != modValue) && (checkOccupied(index, board) != checkColor) && (checkOccupied(prevIndex, board) == -1 || prevIndex == oldIndex)){ 
        retVal.push(index);

        prevIndex = index;
        index += increment;
    }

    return retVal;
}



function knightRules(){
    //Just checking 8 squares
    var localPossibleMoves = [];
    var location = selectedPiece.getLocation();
    var color = selectedPiece.getColor();

    var checkSquare = location - (squaresPerRow * 2) - 1;
    for(var i = 0; i < 8; i ++){
    if(checkOneSquare(checkSquare, location, color, board)){
        localPossibleMoves.push(checkSquare);
    }

    checkSquare = knightMoveCycler(checkSquare, location);
        
    }


    localPossibleMoves = checkCheckCallFunc(color, localPossibleMoves);

    return localPossibleMoves;
}


function kingRules(){
    //Just checking 8 squares
    var localPossibleMoves = [];
    var location = selectedPiece.getLocation();
    var color = selectedPiece.getColor();

    var checkSquare = location - squaresPerRow;
    for(var i = 0; i < 8; i ++){
    if(checkOneSquare(checkSquare, location, color, board)){
        localPossibleMoves.push(checkSquare);
    }
    checkSquare = kingMoveCycler(checkSquare, location);
        
    }

    if(canCastle("right", board)){
        localPossibleMoves.push(location + 2);
    }

    if(canCastle("left", board)){
        localPossibleMoves.push(location - 2);
    }

    localPossibleMoves = checkCheckCallFunc(color, localPossibleMoves);

    return localPossibleMoves;
    
}

function canCastle(direction, localBoard){
    var squaresToRook;
    if (!(checkCheck(possibleMoves[i], selectedPiece.getColor(), ["UP", "UPRIGHT", "RIGHT", "DOWNRIGHT", "DOWN", "DOWNLEFT", "LEFT", "UPLEFT"]))){
        if(direction == "left"){
            increment = -1;
        }
        else{
            increment = 1;
        }
        squaresToRook = directionalCheck(selectedPiece.getLocation(), increment, selectedPiece.getColor(), localBoard);

        if(squaresToRook.length == 0){
            return false;
        }
        if(direction == "left" && checkPieceType(squaresToRook[squaresToRook.length-1] + increment, localBoard) != "rook" && selectedPiece.getLocation() % squaresPerRow > ((squaresToRook[squaresToRook.length-1] - 1) % squaresPerRow)){
            return false;
        }
        if(direction == "right" && checkPieceType(squaresToRook[squaresToRook.length-1] + increment, localBoard) != "rook" && selectedPiece.getLocation() % squaresPerRow < ((squaresToRook[squaresToRook.length-1] + 1) % squaresPerRow)){
            return false;
        }
        
        for(let i = 0; i < moves.length; i ++){
            if (moves[i][1].getLocation() == squaresToRook[squaresToRook.length-1] + increment){
                return false;
            }
        }
        for(let i = 0; i < moves.length; i ++){
            if (moves[i][1].getLocation() == selectedPiece.getLocation()){
                return false;
            }
        }
        for(let i = 0; i < squaresToRook.length; i++){
            if(checkOccupied(squaresToRook[i], localBoard) != -1){
                return false;
            }
        }
        for(let i = 0; i < 2; i++){
            if(isUnderAttack(selectedPiece.getLocation()-i + increment, localBoard, selectedPiece.getColor(), ["UP", "UPRIGHT", "RIGHT", "DOWNRIGHT", "DOWN", "DOWNLEFT", "LEFT", "UPLEFT"], -1)){
                return false;
            }
        }
        
        console.log("CAN CASTLE");
        return true;
    }


    return false;
}

function moveRookForCastle(newSquareIndex, oldSquareIndex){
    var increment;
    if(newSquareIndex > oldSquareIndex){
        increment = 1
    }else{
        increment = -1;
    }

    squaresToRook = directionalCheck(oldSquareIndex, increment, selectedPiece.getColor(), board);
    rookIndex = squaresToRook[squaresToRook.length-1]+increment;

    var i = 0;
    while(board[i].getLocation() != rookIndex){
        i++
    }
    console.log(i);
    
    board[i].setLocation(newSquareIndex-increment);


    //Graphics
    // console.log("piece[i].style.left " + piece[i].style.left)
    console.log("i " + i);
    console.log("(piece[w].offsetLeft + (square[0].offsetWidth * increment)) " + (piece[w].offsetLeft + (square[0].offsetWidth * increment)));
    piece[i].style.left =  (piece[w].offsetLeft - (increment * square[0].offsetWidth)) + 'px';
    

}

function checkOneSquare(targetSquare, startSquare, color, board){ //For knights and kings
    if (0 <= targetSquare && targetSquare < (squaresPerRow * squaresPerRow) && (checkOccupied(targetSquare, board) != color) && Math.abs((startSquare % squaresPerRow) - (targetSquare %  squaresPerRow)) < squaresPerRow - 2){
        return true;
    }else{
        return false;
    }

}
//return -1 for empty or color
function checkOccupied(index, board){
    for(var i = 0; i < board.length; i++){
        if(board[i].getLocation() == index){
            return board[i].getColor();
        }

    }
    return -1;
}

function checkPieceType(index, board){
    for(var i = 0; i < board.length; i++){
        if(board[i].getLocation() == index){
            return board[i].getPieceType();
        }

    }
    return -1;
}

function doCapture(squareIndex, isEnpassant){
    if (!isEnpassant && checkOccupied(squareIndex, board) == -1){
        return;
    }else{
        for (var i = 0; i < board.length; i++){
            if (board[i].getLocation() == squareIndex){
                console.log("capture");
                board[i].setLocation(-1);
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

function checkCheck(newPotentialIndex, kingColor, directionsToCheck){ 
    retVal = false;

    if(newPotentialIndex != -1){
        var checkBoard = cloneBoardWithEdit(newPotentialIndex);
    }else{
        checkBoard = board;
    }
    
    for (var i = 0; i < checkBoard.length; i++){
        checkBoard[i].getLocation();
    }

    

////////////////
    kingLocations = [];
    // for (var i = 0; i < checkBoard.length; i++){ //Used a for loop. Gonna account for multiple kings in case people are weird. 
    //     if(pieceType == "king" && checkOccupied(selectedPiece.getLocation(), checkBoard) != -1){
    //         kingLocations.push(newPotentialIndex);
    //     }else if (checkBoard[i].getColor() == kingColor && checkBoard[i].getPieceType() == "king" && selectedPiece.location != i){
    //         kingLocations.push(checkBoard[i].getLocation()); 
    //     }
    // }

    for (var i = 0; i < checkBoard.length; i++){ //Used a for loop. Gonna account for multiple kings in case people are weird. 
        if (checkBoard[i].getColor() == kingColor && checkBoard[i].getPieceType() == "king"){
            kingLocations.push(checkBoard[i].getLocation()); 
        }
    }

////////////////
//Doing all these checks separately because I want to return if it's check rather than continuing on.
//UP, DOWN, etc are going to be from king's POV
    
    

    
    for(var i = 0; i < kingLocations.length; i++){
        return isUnderAttack(kingLocations[i], checkBoard, kingColor, directionsToCheck);
    }

}
function isUnderAttack(checkLocation, checkBoard, kingColor, directionsToCheck, newPotentialIndex){
    if(kingColor == "white"){
        var oppColor = "black"
    }else{
        oppColor = "white";
    }

    for(var i = 0; i < directionsToCheck.length; i++){
        if(checkCheckDirectionalCheck(directionsToCheck[i], kingColor, oppColor, checkBoard, newPotentialIndex, checkLocation) == true){
            return true;
        }
    }

    var location = checkLocation;
    var checkSquare = location - squaresPerRow;
    for(var j = 0; j < 8; j ++){
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "king" && checkSquare != newPotentialIndex){
            return true;
        }
        checkSquare = kingMoveCycler(checkSquare, location);
        
    }

    checkSquare = location - (squaresPerRow * 2) - 1;
    for(var j = 0; j < 8; j ++){
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "knight" && checkSquare != newPotentialIndex){
            return true;
        }
        checkSquare = knightMoveCycler(checkSquare, location);
    }

    if(kingColor == "white"){
        checkSquare = location - squaresPerRow -1, checkBoard;
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "pawn" && checkSquare != newPotentialIndex){
            return true;
        }
        checkSquare = location - squaresPerRow +1, checkBoard;
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "pawn" && checkSquare != newPotentialIndex){
            return true;
        }
    }else{
        checkSquare = location + squaresPerRow -1, checkBoard;
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "pawn" && checkSquare != newPotentialIndex){
            return true;
        }
        checkSquare = location + squaresPerRow +1, checkBoard;
        if(checkOccupied(checkSquare, checkBoard) == oppColor && checkPieceType(checkSquare, checkBoard) == "pawn" && checkSquare != newPotentialIndex){
            return true;
        }
    }

    return false;

}



function checkCheckDirectionalCheck(direction, kingColor, oppColor, checkBoard, newPotentialIndex, kingLocation){
    var increment;
    var secondPiece;
    if(direction == "UP"){
        increment = -squaresPerRow;
        secondPiece = "rook";
    }else if(direction == "UPRIGHT"){
        increment = -squaresPerRow + 1;
        secondPiece = "bishop";
    }else if(direction == "RIGHT"){
        increment = + 1;
        secondPiece = "rook";
    }else if(direction == "DOWNRIGHT"){
        increment = +squaresPerRow + 1;
        secondPiece = "bishop";
    }else if(direction == "DOWN"){
        increment = squaresPerRow;
        secondPiece = "rook";
    }else if(direction == "DOWNLEFT"){
        increment = squaresPerRow - 1;
        secondPiece = "bishop";
    }else if(direction == "LEFT"){
        increment = -1;
        secondPiece = "rook";
    }else if(direction == "UPLEFT"){
        increment = -squaresPerRow - 1;
        secondPiece = "bishop";
    }else{
        return false;
    }
    
    let checkArray = [];
    checkArray = directionalCheck(kingLocation, increment, kingColor, checkBoard);
    

    if(checkArray.length > 0){
        if(checkArray[checkArray.length-1] != newPotentialIndex && checkOccupied(checkArray[checkArray.length-1], checkBoard) == oppColor && (checkPieceType(checkArray[checkArray.length-1], checkBoard) == secondPiece || checkPieceType(checkArray[checkArray.length-1], checkBoard) == "queen")){
            // console.log("CHECK");
            return true;
        }
    }  
    



    return false;

////////////
    

}


function cloneBoardWithEdit(newIndex){
    retVal = [];
    loc = selectedPiece.getLocation();

    for (var i = 0; i < board.length; i++){
        // console.log(i);
        
        if (loc == board[i].getLocation()){
            retVal.push(new bPiece(board[i].getColor(), board[i].getPieceType(), newIndex));
        }else{
            retVal.push(new bPiece(board[i].getColor(), board[i].getPieceType(), board[i].getLocation()));
        }
        
    }

    return retVal;
}


function knightMoveCycler(checkSquare, location){
    switch (checkSquare){
    case location - (squaresPerRow * 2) - 1:
        checkSquare = location - (squaresPerRow * 2) + 1;
        break;
    case location - (squaresPerRow * 2) + 1:
        checkSquare = location - squaresPerRow + 2;
        break;
    case location - squaresPerRow + 2:
        checkSquare = location + squaresPerRow + 2;
        break;
    case location + squaresPerRow + 2:
        checkSquare = location + (squaresPerRow * 2) + 1;
        break;
    case location + (squaresPerRow * 2) + 1:
        checkSquare = location + (squaresPerRow * 2) - 1;
        break;
    case location + (squaresPerRow * 2) - 1:
        checkSquare = location + squaresPerRow - 2;
        break;
    case location + squaresPerRow - 2:
        checkSquare = location - squaresPerRow - 2;
        break;
    }

    return checkSquare;
}

function kingMoveCycler(checkSquare, location){
    switch (checkSquare){
    case location - squaresPerRow:
        checkSquare = location - squaresPerRow + 1;
        break;
    case location - squaresPerRow + 1:
        checkSquare = location + 1;
        break;
    case location + 1:
        checkSquare = location + squaresPerRow + 1;
        break;
    case location + squaresPerRow + 1:
        checkSquare = location + squaresPerRow;
        break;
    case location + squaresPerRow:
        checkSquare = location + squaresPerRow - 1;
        break;
    case location + squaresPerRow - 1:
        checkSquare = location - 1;
        break;
    case location - 1:
        checkSquare = location - squaresPerRow - 1;
        break;
    }


    return checkSquare;
}