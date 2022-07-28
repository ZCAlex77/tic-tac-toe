const cells = document.querySelectorAll(".cell");

const displayController = (function () {
  const winDisplay = document.querySelectorAll(".win-display");

  const resetBoard = () => {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.style.color = "#aaa";
    });
  };

  const changeTile = (tile, symbol) => {
    cells[tile].textContent = symbol;
    cells[tile].style.color = "#111";
  };

  const displayWinner = (winner) => {
    winDisplay.forEach((dis) => {
      dis.textContent = winner
        ? `${winner.toUpperCase()} WINS!`
        : "IT'S A TIE!";
      dis.style.transform = "translateY(0)";
      dis.style.opacity = "1";
    });
  };

  const resetWinnerDisplay = () => {
    winDisplay.forEach((dis) => {
      dis.style.transform = "translateY(-100%)";
      dis.style.opacity = "0";
    });
  };

  return {
    resetBoard,
    resetWinnerDisplay,
    changeTile,
    displayWinner,
  };
})();

const game = (function () {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let gameBoard = [null, null, null, null, null, null, null, null, null];
  let emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let isOver = false;

  const getEmptyCells = () => [...emptyCells];

  const restart = () => {
    gameBoard = gameBoard.map((el) => null);
    emptyCells = gameBoard.map((el, i) => i);
    displayController.resetBoard();
    displayController.resetWinnerDisplay();
    isOver = false;
  };

  const checkWinner = () => {
    for (condition of winConditions) {
      if (
        gameBoard[condition[0]] === gameBoard[condition[1]] &&
        gameBoard[condition[1]] === gameBoard[condition[2]] &&
        gameBoard[condition[0]] !== null
      ) {
        displayController.displayWinner(
          gameBoard[condition[0]] === player.weapon
            ? player.name
            : opponent.name
        );
        isOver = true;
        return true;
      }
    }

    if (!emptyCells.length) {
      displayController.displayWinner(null);
      isOver = true;
      return true;
    }

    return false;
  };

  const changeTile = (index, player) => {
    if (!gameBoard[index] && !isOver) {
      gameBoard[index] = player;
      emptyCells = emptyCells.filter((cell) => !gameBoard[cell]);
      displayController.changeTile(index, player);
      return true;
    }

    return false;
  };

  return {
    restart,
    getEmptyCells,
    checkWinner,
    changeTile,
  };
})();

const playerFactory = (name, weapon) => {
  const play = () => {
    let emptyCells = game.getEmptyCells();
    return emptyCells[Math.floor(Math.random() * game.getEmptyCells().length)];
  };

  return { name, weapon, play };
};

let player = playerFactory("Player", "x"),
  opponent = playerFactory("Computer", "o");

cells.forEach(
  (cell) =>
    (cell.onclick = function () {
      if (
        game.changeTile(Number(this.getAttribute("data-index")), player.weapon)
      ) {
        if (game.getEmptyCells().length && !game.checkWinner()) {
          game.changeTile(opponent.play(), opponent.weapon);
        }
        game.checkWinner();
      }
    })
);

document.querySelector("#restart").onclick = () => game.restart();
