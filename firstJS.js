let newX = 0;
let newY = 0;
let startX = 0;
let startY = 0;
let OGstartX = 0;
let OGstartY = 0;

var w = -1;

const board = phpBoard;
const squaresPerRow = phpSquaresPerRow;
console.log(board);
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
    console.log("mouseDown");
    console.log(w);
    

    startX = e.clientX;
    startY = e.clientY;
    
    OGstartX = piece[w].style.left;
    OGstartY = piece[w].style.top;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
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
    for(let i = 0; i < square.length; i++){
        // console.log(i);
        if ((square[i].offsetLeft < piece[w].offsetLeft) && ((piece[w].offsetLeft+ piece[w].offsetWidth)< (square[i].offsetLeft+square[i].offsetWidth)) && (piece[w].offsetTop > square[i].offsetTop) && ((square[i].offsetTop+square[i].offsetHeight)> (piece[w].offsetTop+piece[w].offsetHeight))){
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        flipBoard();
        console.log("f1");
        // console.log("break!");
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


