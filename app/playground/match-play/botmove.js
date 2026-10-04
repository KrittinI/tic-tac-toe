const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};

const minimax = (board, isMaximizing, depth) => {
  const winner = checkWinner(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every((cell) => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        const nextBoard = [...board];
        nextBoard[i] = "O";

        bestScore = Math.max(bestScore, minimax(nextBoard, false, depth + 1));
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      const nextBoard = [...board];
      nextBoard[i] = "X";

      bestScore = Math.min(bestScore, minimax(nextBoard, true, depth + 1));
    }
  }

  return bestScore;
};

const getBestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      const nextBoard = [...board];
      nextBoard[i] = "O";

      const score = minimax(nextBoard, false, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const getEmptyCells = (board) => {
  return board
    .map((cell, index) => (cell === "" ? index : -1))
    .filter((index) => index !== -1);
};

const getWinningMove = (board, symbol) => {
  for (const index of getEmptyCells(board)) {
    const next = [...board];
    next[index] = symbol;

    if (checkWinner(next) === symbol) {
      return index;
    }
  }

  return -1;
};

const getRandomMove = (board) => {
  const emptyCells = getEmptyCells(board);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const getBotMove = (board, score) => {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) return -1;

  if (score < 20) {
    return getRandomMove(board);
  }

  if (score < 70) {
    const winMove = getWinningMove(board, "O");
    if (winMove !== -1) return winMove;

    const blockMove = getWinningMove(board, "X");
    if (blockMove !== -1) return blockMove;

    return getRandomMove(board);
  }

  if (score < 100) {
    if (Math.random() < 0.7) {
      return getBestMove(board);
    }

    return getRandomMove(board);
  }

  return getBestMove(board);
};
