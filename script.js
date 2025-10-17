const boardElement = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');

let board = Array.from({ length: 8 }, () => Array(8).fill(0));
let currentTurn = 1;
let selectedPiece = null;

// Randomly assign this browser as player 1 or 2
let playerId = 0; 
// Build tiles
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    const tile = document.createElement('div');
    tile.classList.add('tile', (r + c) % 2 === 0 ? 'light' : 'dark');
    tile.dataset.row = r;
    tile.dataset.col = c;

    tile.addEventListener('click', () => onTileClick(r, c));
    boardElement.appendChild(tile);
  }
}

// Click a piece
function onPieceClick(r, c) {
  if (board[r][c] !== currentTurn || currentTurn !== playerId) return;

  if (selectedPiece && selectedPiece[0] === r && selectedPiece[1] === c) {
    selectedPiece = null;
  } else {
    selectedPiece = [r, c];
  }
  renderBoard();
}

// Click a tile
function onTileClick(r, c) {
  if (!selectedPiece || currentTurn !== playerId) return;

  const [sr, sc] = selectedPiece;
  const pieceVal = board[sr][sc];
  const dr = r - sr;
  const dc = c - sc;

  // Single diagonal move (normal)
  if (Math.abs(dr) === 1 && Math.abs(dc) === 1 && board[r][c] === 0 && !canJump(sr, sc)) {
    // normal move only allowed if no jumps available
    movePiece(sr, sc, r, c);
    return;
  }

  // Jump move (2 steps)
  if (Math.abs(dr) === 2 && Math.abs(dc) === 2 && board[r][c] === 0) {
    const jumpedR = sr + dr / 2;
    const jumpedC = sc + dc / 2;
    const jumpedPiece = board[jumpedR][jumpedC];

    if (jumpedPiece !== 0 && isOpponent(pieceVal, jumpedPiece)) {
      board[jumpedR][jumpedC] = 0; // remove jumped piece
      movePiece(sr, sc, r, c);
    }
  }
}

function isOpponent(piece, target) {
  if ((piece <= 2 && target >= 3) || (piece >= 3 && target <= 2)) return true;
  if ((piece === 1 && target === 2) || (piece === 2 && target === 1)) return true;
  return false;
}

// Move piece and change turn
function movePiece(sr, sc, dr, dc) {
  let pieceVal = board[sr][sc];
  board[dr][dc] = pieceVal;
  board[sr][sc] = 0;

  // Check for kinging
  if (pieceVal === 1 && dr === 0) board[dr][dc] = 3; // Red reaches top
  if (pieceVal === 2 && dr === 7) board[dr][dc] = 4; // Black reaches bottom

  selectedPiece = null;
  
  // Check for additional jumps
  if (!canJump(dr, dc)) {
    currentTurn = currentTurn === 1 ? 2 : 1; // switch turn
  } else {
    selectedPiece = [dr, dc]; // must continue jump
  }

  saveBoard();
  renderBoard();
}
function canJump(r, c) {
  const pieceVal = board[r][c];
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  for (let [dr, dc] of directions) {
    const nr = r + dr * 2;
    const nc = c + dc * 2;
    const mr = r + dr;
    const mc = c + dc;

    if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
    if (board[nr][nc] !== 0) continue;

    const mid = board[mr][mc];
    if (!mid) continue;

    // Opponent piece
    if ((pieceVal <= 2 && mid >= 3) || (pieceVal >= 3 && mid <= 2)) {
      return true; // jump possible
    }
  }
  return false;
}

// Render the board
function renderBoard() {
  document.querySelectorAll('.piece').forEach(p => p.remove());

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const val = board[r][c];
      if (val !== 0) {
        const piece = document.createElement('div');
        piece.classList.add('piece');

        if (val === 1) piece.classList.add('player1');
        if (val === 2) piece.classList.add('player2');
        if (val === 3) { piece.classList.add('player1'); piece.textContent = 'K'; }
        if (val === 4) { piece.classList.add('player2'); piece.textContent = 'K'; }

        piece.dataset.row = r;
        piece.dataset.col = c;
        piece.addEventListener('click', e => { e.stopPropagation(); onPieceClick(r, c); });

        if (selectedPiece && selectedPiece[0] === r && selectedPiece[1] === c) piece.classList.add('selected');

        const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
        if (tile) tile.appendChild(piece);
      }
    }
  }

  turnIndicator.textContent = `Player ${currentTurn}'s Turn (${currentTurn <= 2 ? 'Red' : 'Black'}) | You are Player ${playerId}`;
}


// Save board to server
function saveBoard() {
  const dataStr = board.flat().join('');
  fetch('save.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'board=' + encodeURIComponent(dataStr) + '&turn=' + currentTurn
  });
}

// Load board from server
function loadBoard() {
  fetch('load.php?nocache=' + Math.random())
    .then(r => r.text())
    .then(txt => {
      const lines = txt.trim().split('\n');
      if (lines.length < 2) return;

      const bstring = lines[0].trim();
      currentTurn = parseInt(lines[1]);

      let index = 0;
      for (let r = 0; r < 8; r++) {
        board[r] = [];
        for (let c = 0; c < 8; c++) {
          board[r][c] = parseInt(bstring[index]) || 0;
          index++;
        }
      }

      renderBoard();
    });
}

// Initialize
window.onload = () => {
  loadBoard();
  setInterval(loadBoard, 4096);
};

document.getElementById('reset').addEventListener('click', () => {
  fetch('save.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'reset=1'
  }).then(() => loadBoard());
});
