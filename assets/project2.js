/*
    Build a table of divs by following the html tag style for tables
 */
// defining the base distance for each side of the program
// can be used for a bunch of functions including calculating the div background locations
const BASE_DISTANCE = 100;

// helper functions
// deletes all children of a given element
function deleteChildren(element) {
    let child = element.lastElementChild;
    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
    }
}

// shuffles the contents of a given 1D array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (array.length));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

 function isOneAway(number, other) {
    return number === (other + 1) || number === (other - 1);
 }

// timing helper
// countdown from @time
function timer(){
    let sec = 0;
    let timer = setInterval(function(){
        document.getElementById('timer').innerHTML='00:' + sec;
        sec++;
    }, 1000);
}

// check if it can be moved
function checkMove() {

}

// builds the play-board
function buildBoard(size) {
    let gameSection = document.getElementById('game-section');
    // for safety
    deleteChildren(gameSection);

    // second to last thing to do is start the audio and timer
    document.getElementById('bgm-music').play();
    timer();
}

// builds an individual tile on the board
function buildTile(identifier, section, numTiles) {
    let tile = document.createElement('div');
    // id is original position according to our math
    tile.id = identifier;
    // data-column, data-row give CURRENT location of tile
    tile.setAttribute('data-column', );
    tile.setAttribute('data-row',);
    tile.addEventListener('click', checkMove);

    tile.style.width = (section.clientWidth / numTiles) - 10 + "px";
    tile.style.height = (section.clientHeight / numTiles) - 10 + "px";

    // builds the individual img for us
    tile.appendChild(buildImg(img, identifier))
}

/*
        0   1   2   3
        4   5   6   7
        8   9   10  11
        12  13  14  15
    @tileLocation follows above convention
    @image is a string pointing to img location in server
 */
function buildImg(image, tileLocation) {
    let imgElement = document.createElement('img');
    imgElement.src = image;

    // underlying assumption img is forced into 400 x 400
}

function moveTile(emptyTile,Tile){

}

function getNeighbours(row, column) {
    let allTiles = document.getElementsByClassName('tile');
    let neighbours = [];
    for (const tile of allTiles) {
        if (isOneAway(tile.dataset.row, row) && isOneAway(tile.dataset.column, column)) {
            neighbours.push(tile);
        }
    }

    return neighbours;
}


//shuffle Algorithm
function shuffle(){
    let allTiles = document.getElementsByClassName('tile');

    for(let i=0;i<1000;i++){
        //get the empty cell
        let emptyCell=document.getElementById('cell33');
        let neighbours = getNeighbours(3,3)
        let randomCell = Math.floor(Math.random() * neighbours.length);
        let randomNeighbourtile = neighbours[randomCell];
        moveTile(emptyCell,randomNeighbourtile);

    }

}

// Extra feature Cheat Button
function gameSolver(){

}