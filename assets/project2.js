/*
    Build a table of divs by following the html tag style for tables
 */
// defining the base distance for each side of the program
// can be used for a bunch of functions including calculating the div background locations


/*
    Shardul - TODO:
        * Finish making the tiles interactible
        * Get timer working - 1 feature (game time + music)
        * Finish UI builder - 1 feature (different puzzles sizes)
        * Add in more backgrounds - 1 feature (multiple backgrounds)
        * Multi-select on hover - 1 feature (multi-select)

    *** FIGURE OUT EXTRA FEATURE??? - Second scale of difficulty (all white/all black tiles)??? ***

    Ruchita - TODO:
        * Finish Shuffler
        * Finish Solver - 1 Feature (solver)
        * End of game notification - 1 Feature (EoG noti)
*/
const BASE_DISTANCE = 100;
let track_moves = 0;

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
function shuffleAnArray(array) {
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
    setInterval(function(){
        document.getElementById('timer').innerHTML='00:' + sec;
        sec++;
    }, 1000);
}

// check if it can be moved
function checkMove() {

}

// accept the form here to then build out the game
function initializeGame(form) {
    let size = form.size.value;
    let img = form.image.value;

    // TODO: Add validation

    buildBoard(size, img);
}

// builds the play-board
function buildBoard(size, img) {
    let gameSection = document.getElementById('game-section');
    // for safety
    deleteChildren(gameSection);

    let currentTile = 0;
    for (const row of Array(size).keys()) {
        for (const col of Array(size).keys()) {
            gameSection.append(buildTile(row, col, currentTile, gameSection, (size * size)));
            currentTile += 1;
        }
    }

    // second to last thing to do is start the audio and timer
    document.getElementById('bgm-music').play();
    timer();
}

// builds an individual tile on the board
function buildTile(row, col, identifier, section, numTiles, img) {
    let tile = document.createElement('div');
    // id is original position according to our math
    tile.id = identifier;

    tile.innerText = identifier;
    // data-column, data-row give CURRENT location of tile
    tile.setAttribute('data-column', col);
    tile.setAttribute('data-row', row);
    tile.addEventListener('click', checkMove);

    tile.style.width = (section.clientWidth / numTiles) - 10 + "px";
    tile.style.height = (section.clientHeight / numTiles) - 10 + "px";

    // builds the individual img for us
    tile.appendChild(buildImg(img, identifier))

    return tile;
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

    // TODO: underlying assumption img is forced into 400 x 400

    return imgElement;
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