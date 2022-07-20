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
let base_distance = 100;
let edge = 0;
let track_moves = 0;
let white_tile = "t15";
let difficulty = "easy";

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
    console.log(number, other);
    let n_gt_o = number === (other + 1);
    let n_lt_o = number === (other - 1);
    let n_eq_o = number === other;

    return n_gt_o || n_lt_o || n_eq_o;
}

// timing helper
// countdown from @time
function timer() {
    let sec = 0;
    setInterval(function () {
        document.getElementById('timer').innerHTML = '00:' + sec;
        sec++;
    }, 1000);
}

// accept the form here to then build out the game
function initializeGame(form) {
    let size = form.size.value;
    let img = form.img.value;
    let music = form.music.value;
    console.log(size);
    console.log(img);
    let choose = Math.floor(Math.random() * 3) + 1;

    switch (size) {
        case "4":
            base_distance = 400 / 4;
            white_tile = "t15";
            difficulty = "easy";
            edge = 4;
            buildBoard(4, `./assets/img/${img}_${choose}.jpg`);
            return true;
        case "5":
            base_distance = 400 / 5;
            white_tile = "t24";
            difficulty = "med";
            edge = 5;
            buildBoard(5, `./assets/img/${img}_${choose}.jpg`);
            return true;
        case "6":
            base_distance = 400 / 6;
            white_tile = "t35";
            difficulty = "hard";
            edge = 6;
            buildBoard(6, `./assets/img/${img}_${choose}.jpg`);
            return true;
    }

    switch (music) {
        case 'on':
            document.getElementById('bgm-music').play();
            break;
        case 'off':
            break;
    }

    // default
    base_distance = 400 / 4;
    white_tile = "t15";
    difficulty = "easy";
    buildBoard(4, "./assets/img/easy_2.jpg");
    return true;
}

// builds the play-board
function buildBoard(size, img) {
    let gameSection = document.getElementById('game-section');
    // for safety
    deleteChildren(gameSection);

    let currentTile = 0;
    for (const row of Array(size).keys()) {
        for (const col of Array(size).keys()) {
            // define the css here and pass it to the build function
            // let cssString = buildCss(row, col, currentTile);
            let tile = buildTile(row, col, currentTile, gameSection, (size * size), img);
            // tile.setAttribute('style', cssString);
            gameSection.append(tile);
            currentTile += 1;
        }
    }

    timer();
}

// builds an individual tile on the board
/*
        0   1   2   3
        4   5   6   7
        8   9   10  11
        12  13  14  15
    @tileLocation follows above convention
    @image is a string pointing to img location in server
 */
function buildTile(row, col, identifier, section, numTiles, img) {
    let tile = document.createElement('div');
    // id is original position according to our math
    tile.id = "t" + identifier;

    tile.innerText = identifier;

    // data-column, data-row give CURRENT location of tile
    tile.setAttribute('data-column', col);
    tile.setAttribute('data-row', row);
    tile.classList.add('tile');

    if (identifier === (numTiles - 1)) {
        // white tile
        tile.style.background = "white !important";
        tile.style.border = "2px solid white !important"
    } else {
        tile.style.backgroundImage = `url(${img})`;
        tile.addEventListener('click', checkMove);
    }
    // default for all tiles
    tile.style.width = (base_distance - 5) + "px";
    tile.style.height = (base_distance - 5) + "px";
    tile.style.backgroundPositionX = -(col * base_distance) + "px";
    tile.style.backgroundPositionY = -(row * base_distance) + "px";

    return tile;
}

// check if it can be moved
function checkMove(e) {
    // e gives us the calling div
    console.log(e);
    let tile = e.target;
    let emptyTile = document.getElementById(white_tile)

    let oneRowAway = isOneAway(Number(tile.dataset.row), Number(emptyTile.dataset.row));
    let oneColAway = isOneAway(Number(tile.dataset.column), Number(emptyTile.dataset.column));
    console.log(oneRowAway, oneColAway);
    if ( oneRowAway && oneColAway ) {
        // is one away and can be moved
        moveTile(emptyTile, tile);
    }

}

function moveTile(emptyTile, tile) {
    let emptyCopy = emptyTile.cloneNode(true);
    let tileCopy = tile.cloneNode(true);
    /*
    * .move-up {
    transform: translate(0, -100px);
}

.move-down {
    transform: translate(0, 100px);
}

.move-left {
    transform: translate(-100px, 0);
}

.move-right {
    transform: translate(100px, 0);
}*/
    // somehow convert ^ those into code

    // locate the tile w.r.t empty tile gives us the vector for movement
    // in (dY, dX)
    let dX = emptyTile.dataset.row - tile.dataset.row;
    let dY = emptyTile.dataset.column - tile.dataset.column;

    tileCopy.dataset.row = emptyTile.dataset.row;
    tileCopy.dataset.column = emptyTile.dataset.column;

    emptyCopy.dataset.row = tile.dataset.row;
    emptyCopy.dataset.column = tile.dataset.column;

    tileCopy.addEventListener('click', checkMove);

    // tile.style.transform = `translate(${dY * base_distance}px ${dX * base_distance}px`;
    // tile.style.transform = `translate`

    // simply reorder the elements :5head:
    document.getElementById('game-section').replaceChild(emptyCopy, tile);
    document.getElementById('game-section').replaceChild(tileCopy, emptyTile);
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
function shuffle() {
    let allTiles = document.getElementsByClassName('tile');

    for (let i = 0; i < 1000; i++) {
        //get the empty cell
        let emptyCell = document.getElementById('cell33');
        let neighbours = getNeighbours(3, 3)
        let randomCell = Math.floor(Math.random() * neighbours.length);
        let randomNeighbourtile = neighbours[randomCell];
        moveTile(emptyCell, randomNeighbourtile);

    }

}

// Extra feature Cheat Button
function gameSolver() {

}