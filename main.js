const cells = document.querySelectorAll(".cell");

const displayController = (function () {
  const changeTile = (tile, symbol) => {
    cells[tile].textContent = symbol;
  };

  const displayWinner = (winner) => {
    console.log(winner);
  };

  return {
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
  const gameBoard = [null, null, null, null, null, null, null, null, null];
  let emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getEmptyCells = () => [...emptyCells];

  const checkWinner = () => {
    for (condition of winConditions) {
      if (
        gameBoard[condition[0]] === gameBoard[condition[1]] &&
        gameBoard[condition[1]] === gameBoard[condition[2]]
      )
        return true;
    }
  };

  const changeTile = (index, player) => {
    if (!gameBoard[index]) {
      gameBoard[index] = player;
      emptyCells = emptyCells.filter((cell) => !gameBoard[cell]);
      displayController.changeTile(index, player);
      return true;
    }

    return false;
  };

  return {
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
        if (game.getEmptyCells().length)
          game.changeTile(opponent.play(), opponent.weapon);
      }
    })
);
