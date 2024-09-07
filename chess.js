import chalk from "chalk";
import fs from "fs/promises";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//untuk memetakan kolom pada array(0-7) saat user bermain (untuk melangkah)
let columMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

const blackPieces = {
  "♙ ": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 7],
  ],
  "♖ ": [
    [0, 0],
    [0, 7],
  ],
  "♘ ": [
    [0, 1],
    [0, 6],
  ],
  "♗ ": [
    [0, 2],
    [0, 5],
  ],
  "♕ ": [[0, 3]],
  "♔ ": [[0, 4]],
};

const whitePieces = {
  "♟ ": [
    [6, 0],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 6],
    [6, 7],
  ],
  "♜ ": [
    [7, 0],
    [7, 7],
  ],
  "♞ ": [
    [7, 1],
    [7, 6],
  ],
  "♝ ": [
    [7, 2],
    [7, 5],
  ],
  "♛ ": [[7, 3]],
  "♚ ": [[7, 4]],
};

//untuk membuat papan chess (board chess)
function printBoard(board) {
  console.log(
    "    " +
      " a " +
      "  " +
      "b " +
      "  " +
      "c " +
      "  " +
      "d " +
      "  " +
      "e " +
      "  " +
      "f " +
      "  " +
      "g" +
      "  " +
      "h "
  );
  console.log();
  for (let i = 0; i < 8; i++) {
    let patch = 8 - i + " | ";
    for (let j = 0; j < 8; j++) {
      patch += board[i][j] + "  ";
    }
    console.log(patch + "| " + (8 - i));
  }
  console.log();
  console.log(
    "    " +
      "a " +
      "  " +
      "b " +
      "  " +
      "c " +
      "  " +
      "d " +
      "  " +
      "e " +
      "  " +
      "f " +
      "  " +
      "g " +
      "  " +
      "h "
  );
}

// untuk membuat papan catur sebagai array 2D terlebih dahulu agar semua bidak bisa dimasukan
function initializeBoard() {
  let board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = "__";
    }
  }
  return board;
}

// untuk memasukan bidak ke dalam papan / board sesuai dengan tempatnya (hitam / putih)
function placePieces(board, pieces) {
  for (let piece in pieces) {
    for (let position of pieces[piece]) {
      let [row, col] = position;
      board[row][col] = piece;
    }
  }
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

let chessBoard = initializeBoard();

placePieces(chessBoard, blackPieces);
placePieces(chessBoard, whitePieces);

function movePieces(chessBoard, from, to) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;

  //tukar row awal dan col awal ke row dan col selanjutnya
  chessBoard[toRow][toCol] = chessBoard[fromRow][fromCol];
  chessBoard[fromRow][fromCol] = "__"; // karena sudah move row dan col isi dengan "__"
}

/**
 * algoritma
 * let columMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
 * e2 e4 -> huruf = kolom , angka = baris
 * fromCol = e -> 4
 * fromRow = 2 -> 8 - 2 = 6 --> baris ke-6, kolom ke-4
 * toCol = e -> 4
 * toRow = 4 -> 8 - 4 = 4 --> baris ke- 4, kolom ke-4
 * outoutan = [[6, 4], [4, 4]]
 */

function conversPieces(query) {
  let [from, to] = query.split(" "); //ubah menjadi array
  let fromCol = columMap[from[0]];
  let fromRow = 8 - parseInt(from[1]);
  let toCol = columMap[to[0]];
  let toRow = 8 - parseInt(to[1]);
  return [
    [fromRow, fromCol],
    [toRow, toCol],
  ];
}

function validationCheck() {
  if (piece === "♔ ") {
    console.lain("Check King Black!");
    return false;
  } else if (piece === "♚ ") {
    console.lain("Check King White!");
    return false;
  }
  return true;
}

//♟ pawn / pion
function validationPawn(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      if (fromRow - toRow === 1 && fromCol === toCol) {
        return true;
      } else if (
        fromRow === 6 &&
        fromRow - toRow === 2 &&
        fromCol === toCol &&
        chessBoard[fromRow - 1][fromCol] === "__"
      ) {
        return true;
      } else if (fromRow - toRow === 1 && Math.abs(fromCol - toCol) === 1) {
        //pion bisa makan lawan hanya berwarna hitam
        return true;
      }
    }
  }

  if (currentUser.toLowerCase() === "black") {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      if (toRow - fromRow === 1 && fromCol === toCol) {
        return true;
      } else if (
        fromRow === 1 &&
        toRow - fromRow === 2 &&
        fromCol === toCol &&
        chessBoard[fromRow + 1][fromCol] === "__"
      ) {
        return true;
      } else if (
        Math.abs(toRow - fromRow) === 1 &&
        Math.abs(fromCol - toCol) === 1
      ) {
        return true;
      }
    }
  }
  return false;
}

//♜ rook / benteng
function valiationRook(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  // untuk validasi gerakannya adalah gerakan (horizontal atau vertikal)
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  // Cek apakah ada penghalang di sepanjang jalur
  if (fromRow === toRow) {
    // Gerakan horizontal
    let start = Math.min(fromCol, toCol);
    let end = Math.max(fromCol, toCol);
    for (let col = start + 1; col < end; col++) {
      if (chessBoard[fromRow][col] !== "__") {
        return false; // Ada penghalang
      }
    }
  } else if (fromCol === toCol) {
    // Gerakan vertikal
    let start = Math.min(fromRow, toRow);
    let end = Math.max(fromRow, toRow);
    for (let row = start + 1; row < end; row++) {
      if (chessBoard[row][fromCol] !== "__") {
        return false; // Ada penghalang
      }
    }
  }

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      return true;
    }
  } else {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      return true;
    }
  }
  return false;
}

//♞ Knight / kuda
function validationKnight(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) {
        return true;
      } else if (
        Math.abs(toRow - fromRow) === 1 &&
        Math.abs(toCol - fromCol) === 2
      ) {
        return true;
      }
    }
  }

  if (currentUser.toLowerCase() === "black") {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) {
        return true;
      } else if (
        Math.abs(toRow - fromRow) === 1 &&
        Math.abs(toCol - fromCol) === 2
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * algoritma
 * (c1, b2) --> c1 = 7,2 | b2 = 6,1
 * selisih dari c - b harus dama dengan 1 - 2
 * --> 7 - 6 === 2 - 1
 */

//♝ Bishop / Gajah
function validationBishop(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
    return false;
  }

  let rowDirection = fromRow > toRow ? -1 : 1; //untuk arah baris, (1) keatas, (-1) kebawah
  let colDirection = fromCol > toCol ? -1 : 1; //untuk arah kolom, (1) keatas, (-1) kebawah
  let row = fromRow + rowDirection;
  let col = fromCol + colDirection;

  //validasi jika ada bidak lain yang menghalangi
  while (row !== toRow && col !== toCol) {
    if (chessBoard[row][col] !== "__") {
      return false;
    }
    row += rowDirection;
    col += colDirection;
  }

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      return true;
    }
  } else if (currentUser.toLowerCase() === "black") {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      return true;
    }
  }
  return false;
}

// ♛ Queen / Menteri
function validationQueen(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  // untuk validasi gerakannya adalah gerakan (horizontal atau vertikal dan diagonal)
  if (
    fromRow !== toRow &&
    fromCol !== toCol &&
    Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)
  ) {
    return false;
  }

  let rowDirection = fromRow < toRow ? 1 : fromRow > toRow ? -1 : 0; //untuk arah baris, (1) keatas, (-1) kebawah
  let colDirection = fromCol < toCol ? 1 : fromCol > toCol ? -1 : 0; //untuk arah kolom, (1) keatas, (-1) kebawah
  let row = fromRow + rowDirection;
  let col = fromCol + colDirection;

  //validasi jika ada bidak lain yang menghalangi
  while (row !== toRow || col !== toCol) {
    if (chessBoard[row][col] !== "__") {
      return false;
    }
    row += rowDirection;
    col += colDirection;
  }

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      return true;
    }
  } else if (currentUser.toLowerCase() === "black") {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      return true;
    }
  }

  return false;
}

//♚ King / raja
function validationKing(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let [toRow, toCol] = to;
  let piece = chessBoard[toRow][toCol];

  // untuk validasi gerakannya adalah gerakan (horizontal atau vertikal atau diagonal)
  if (Math.abs(fromRow - toRow) > 1 || Math.abs(fromCol - toCol) > 1) {
    return false;
  }

  if (currentUser.toLowerCase() === "white") {
    if (piece === "__" || Object.keys(blackPieces).includes(piece)) {
      return true;
    }
  } else if (currentUser.toLowerCase() === "black") {
    if (piece === "__" || Object.keys(whitePieces).includes(piece)) {
      return true;
    }
  }
  return false;
}

function validMove(chessBoard, from, to, currentUser) {
  let [fromRow, fromCol] = from;
  let piece = chessBoard[fromRow][fromCol];

  // Cek apakah bidak yang digerakkan sesuai dengan warna user
  if (
    (currentUser.toLowerCase() === "white" && !whitePieces[piece]) ||
    (currentUser.toLowerCase() === "black" && !blackPieces[piece])
  ) {
    return false;
  }

  switch (
    piece.trim() //untuk menghapus spasi
  ) {
    case "♙":
    case "♟": // Pawn
      return validationPawn(chessBoard, from, to, currentUser);
    case "♜":
    case "♖": // Rook
      return valiationRook(chessBoard, from, to, currentUser);
    case "♞":
    case "♘": //knight
      return validationKnight(chessBoard, from, to, currentUser);
    case "♝":
    case "♗": //Bishop
      return validationBishop(chessBoard, from, to, currentUser);
    case "♛":
    case "♕": //Queen
      return validationQueen(chessBoard, from, to, currentUser);
    case "♚":
    case "♔": //King
      return validationKing(chessBoard, from, to, currentUser);
    default:
      return false;
  }
}

async function playGame() {
  let currentUser = "white";
  while (true) {
    console.log("\n");
    printBoard(chessBoard);

    let validUser =
      currentUser.toLowerCase() === "white"
        ? chalk.black.bgWhite("Move your chess pieces (white) (e2 e4): ")
        : chalk.white.bgBlack("Move your chess pieces (black) (e7 e5): ");

    let user = await question(validUser);

    if (user.toLowerCase() === "exit") {
      console.log("your exit, The game is over...");
      break;
    }

    if (user.toLowerCase().length !== 5) {
      console.log("invalid input!");
      continue;
    }

    let [from, to] = conversPieces(user);
    let [fromRow, fromCol] = from;
    let [toRow, toCol] = to;
    let piece = chessBoard[toRow][toCol];

    if (currentUser.toLowerCase() === "white" && piece === "♔ ") {
      console.log("Check King Black!");
      console.log("White is Winner!!!");
      break;
    } else if (currentUser.toLowerCase() === "black" && piece === "♚ ") {
      console.log("Check King White!");
      console.log("Black is Winner!!!");
      break;
    }

    // Cek apakah gerakan valid
    if (!validMove(chessBoard, from, to, currentUser)) {
      console.log("Invalid move, please try again.");
      continue;
    }

    movePieces(chessBoard, from, to);

    // Ubah giliran pemain
    currentUser = currentUser.toLowerCase() === "white" ? "black" : "white";
  }

  rl.close();
}

playGame();
