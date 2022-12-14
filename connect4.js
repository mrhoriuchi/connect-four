/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array -DONE!
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board" -DONE!
  const htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  // This creates the top section where you put the pieces in
  // changed top from a var to const
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    // changed the forloop var to let
    // made headCell from var to const
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // This makes the board.
  // changed the vars in the for loops to lets
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }

  changePlayerText();
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`player${currPlayer}`);
  const place = document.getElementById(`${y}-${x}`);
  place.append(piece);
}

/** endGame: announce game end */

const endGame = (msg) => {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  // changed the var x to const x
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  // changed the var y to const y
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board -DONE!
  board[y][x] = currPlayer;
  placeInTable(y, x);
  document.body.append(
    Object.assign(document.createElement("style"), {
      textContent: `@keyframes place { 0% { transform: translateY(${
        -350 + (5 - y) * 50
      }px) } 100% { transform: translateY(0px)}`,
    })
  );

  const whoseTurn = document.getElementById('whoseTurn');
  // check for win
  if (checkForWin()) {
    const top = document.querySelector("tr");
    top.removeEventListener("click", handleClick);
    whoseTurn.innerText = `Player ${currPlayer} won!!!`
    whoseTurn.style.color = currPlayer === 1 ? 'red' : 'blue';
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell))) {
    whoseTurn.innerText = `The Game Ends in a Tie!`
    whoseTurn.style.color = 'black';
    return endGame(`Tie!`);
  }
  
  currPlayer = currPlayer === 1 ? 2 : 1;
  changePlayerText();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Changed the vars in the for loops to lets
      // Below gives the win scenarios for the game, checking if any of the cases are true for the current player
      // Changed the vars below to consts
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

const changePlayerText = () => {
  // I wrote this function so that we will know whose turn it is when playing
  const whoseTurn = document.getElementById('whoseTurn');
  if(currPlayer===1){
    whoseTurn.innerText = "It is currently Player 1's turn";
    whoseTurn.style.color = 'red';
  } else{
    whoseTurn.innerText = "It is currently Player 2's turn";
    whoseTurn.style.color = 'blue';
  }
}

const clearBoard = () => {
  // This function will clear the board
  const htmlBoard = document.getElementById("board");
  while(htmlBoard.firstChild){
    htmlBoard.removeChild(htmlBoard.firstChild);
  }
  board = [];
  currPlayer = 1;
}

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () =>{
  clearBoard();
  makeBoard();
  makeHtmlBoard();
})

makeBoard();
makeHtmlBoard();
