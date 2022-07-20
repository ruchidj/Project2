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
let movesArray = [];
let gridSize = 0;

// helper functions
// deletes all children of a given element
function deleteChildren(element) {
  let child = element.lastElementChild;
  while (child) {
    element.removeChild(child);
    child = element.lastElementChild;
  }
}

const checkWinStatus = () =>
  Array.from(document.querySelectorAll(".tile")).every(
    (tile, index) => parseInt(tile.dataset.tileNumber, 10) === index
  );

// shuffles the contents of a given 1D array
function shuffleAnArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * array.length);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// timing helper
// countdown from @time
function timer() {
  let sec = 0;
  setInterval(function () {
    document.getElementById("timer").innerHTML = "00:" + sec;
    sec++;
  }, 1000);
}

// accept the form here to then build out the game
function initializeGame(form) {
  let size = form.size.value;
  gridSize = size;
  let img = form.img.value;
  let music = form.music.value;
  //   console.log(size);
  //   console.log(img);
  let choose = Math.floor(Math.random() * 3) + 1;

  switch (music) {
    case "on":
      document.getElementById("bgm-music").play();
      break;
    default:
      break;
  }

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
    default:
      base_distance = 400 / 4;
      white_tile = "t15";
      difficulty = "easy";
      buildBoard(4, "./assets/img/easy_2.jpg");
      return true;
  }
}

// builds the play-board
function buildBoard(size, img) {
  let gameSection = document.getElementById("game-section");
  // for safety
  deleteChildren(gameSection);

  let currentTile = 0;
  for (const row of Array(size).keys()) {
    for (const col of Array(size).keys()) {
      // define the css here and pass it to the build function
      // let cssString = buildCss(row, col, currentTile);
      let tile = buildTile(
        row,
        col,
        currentTile,
        gameSection,
        size * size,
        img
      );
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
  let tile = document.createElement("div");
  // id is original position according to our math
  tile.id = "t" + identifier;

  tile.innerText = identifier;

  // data-column, data-row give CURRENT location of tile
  tile.setAttribute("data-column", col);
  tile.setAttribute("data-row", row);
  tile.setAttribute("data-tile-number", identifier);
  tile.classList.add("tile");

  if (identifier === numTiles - 1) {
    // white tile
    tile.style.background = "white !important";
    tile.style.border = "2px solid white !important";
  } else {
    tile.style.backgroundImage = `url(${img})`;
    tile.addEventListener("click", handleTileClick);
  }
  // default for all tiles
  tile.style.width = base_distance - 5 + "px";
  tile.style.height = base_distance - 5 + "px";
  tile.style.backgroundPositionX = -(col * base_distance) + "px";
  tile.style.backgroundPositionY = -(row * base_distance) + "px";

  return tile;
}

// check if it can be moved
function checkMove(tile, emptyTile) {
  const tileRow = parseInt(tile.dataset.row, 10);
  const tileColumn = parseInt(tile.dataset.column, 10);

  const emptyTileRow = parseInt(emptyTile.dataset.row, 10);
  const emptyTileColumn = parseInt(emptyTile.dataset.column, 10);

  const possibleValidRows = [];
  const possibleValidColumns = [];

  if (emptyTileRow !== gridSize - 1) {
    possibleValidRows.push(emptyTileRow + 1);
  }

  if (emptyTileRow !== 0) {
    possibleValidRows.push(emptyTileRow - 1);
  }

  if (emptyTileColumn !== gridSize - 1) {
    possibleValidColumns.push(emptyTileColumn + 1);
  }

  if (emptyTileColumn !== 0) {
    possibleValidColumns.push(emptyTileColumn - 1);
  }

  return (
    (tileColumn === emptyTileColumn && possibleValidRows.includes(tileRow)) ||
    (tileRow === emptyTileRow && possibleValidColumns.includes(tileColumn))
  );
}

const handleTileClick = (e) => {
  const tile = e.target;
  const emptyTile = document.getElementById(white_tile);
  const isValidMove = checkMove(tile, emptyTile);

  if (!isValidMove) return;

  moveTile(emptyTile, tile);
  const isWinStatus = checkWinStatus();

  if (isWinStatus) {
    // TODO: Announce win.
    win();
    
  }
};

function moveTile(emptyTile, tile, skipMoveStorage) {
  let emptyCopy = emptyTile.cloneNode(true);
  let tileCopy = tile.cloneNode(true);

  // somehow convert ^ those into code

  // locate the tile w.r.t empty tile gives us the vector for movement
  // in (dY * base_distance, dX * distance)
  let dX = emptyTile.dataset.column - tile.dataset.column;
  let dY = emptyTile.dataset.row - tile.dataset.row;

  if (!skipMoveStorage) {
    // (x, y)
    movesArray.push([emptyTile.dataset.column, emptyTile.dataset.row]);
  }

  tileCopy.dataset.row = emptyTile.dataset.row;
  tileCopy.dataset.column = emptyTile.dataset.column;

  emptyCopy.dataset.row = tile.dataset.row;
  emptyCopy.dataset.column = tile.dataset.column;

  tileCopy.addEventListener("click", handleTileClick);

  // tile.style.transform = `translate(${dY * base_distance}px ${dX * base_distance}px`;
  // tile.style.transform = `translate`

  // simply reorder the elements :5head:
  document.getElementById("game-section").replaceChild(emptyCopy, tile);
  document.getElementById("game-section").replaceChild(tileCopy, emptyTile);
  track_moves = track_moves + 1;
}

function getNeighbors(tile) {
  const tileRow = parseInt(tile.dataset.row, 10);
  const tileColumn = parseInt(tile.dataset.column, 10);

  const possibleValidRows = [];
  const possibleValidColumns = [];

  if (tileRow !== gridSize - 1) {
    possibleValidRows.push(tileRow + 1);
  }

  if (tileRow !== 0) {
    possibleValidRows.push(tileRow - 1);
  }

  if (tileColumn !== gridSize - 1) {
    possibleValidColumns.push(tileColumn + 1);
  }

  if (tileColumn !== 0) {
    possibleValidColumns.push(tileColumn - 1);
  }

  const neighbors = [];

  possibleValidRows.forEach((row) => {
    const neighbor = document.querySelector(
      `[data-column="${tileColumn}"][data-row="${row}"]`
    );
    neighbors.push(neighbor);
  });

  possibleValidColumns.forEach((column) => {
    const neighbor = document.querySelector(
      `[data-column="${column}"][data-row="${tileRow}"]`
    );
    neighbors.push(neighbor);
  });

  return neighbors;
}

//shuffle Algorithm
function shuffle() {
  for (let i = 0; i < 1000; i++) {
    //get the empty cell
    const emptyTile = document.getElementById(white_tile);
    const neighbors = getNeighbors(emptyTile);
    const randomCell = Math.floor(Math.random() * neighbors.length);
    let randomNeighborTile = neighbors[randomCell];
    moveTile(emptyTile, randomNeighborTile);
  }
}

// Extra feature Cheat Button
async function gameSolver() {
  // Reverse the moves, since we want to iterate from the back.
  movesArray.reverse();

  // Iterate over the moves.
  for (let move of movesArray) {
    const fromTile = document.getElementById(white_tile);
    const toTile = document.querySelector(
      `[data-column="${move[0]}"][data-row="${move[1]}"]`
    );

    // Reverse the move.
    moveTile(fromTile, toTile, true);
    await new Promise((r) => setTimeout(r, 5));
  }

  // Announce win.

  // Clear the moves.
  movesArray = [];
  win();
}

function win(){
    
    let modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    let Time = document.getElementById("Timer");
    let moves = document.getElementById("moves");
    
    Time.innerHTML="Time Taken in seconds "+ document.getElementById("timer").textContent
    moves.innerHTML="Number of Moves "+ track_moves;
    span.onclick = function() {
        modal.style.display = "none";
    }

      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    movesArray = [];
    track_moves=0;
}
