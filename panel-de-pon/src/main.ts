import { Panel, getRandomPanel, FALLING, FIXED } from "./panels";

// パネルでポンをTypeScriptで作る
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const BLOCK_SIZE = 60;
const COLUMNS = 6; // よこ
const ROWS = 12; // たて

const FIELD_WIDTH = BLOCK_SIZE * COLUMNS;
const FIELD_HEIGHT = BLOCK_SIZE * ROWS;

canvas.width = FIELD_WIDTH;
canvas.height = FIELD_HEIGHT;
canvas.style.border = "1px solid black";

let field: (0 | Panel)[][] = [
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0]
];

const createPanel = (x: number, y: number, panel: Panel | 0) => {
  let px = x * BLOCK_SIZE;
  let py = y * BLOCK_SIZE;

  // パネルの描画
  ctx.fillStyle = panel === 0 ? "red" : panel.type;
  ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  // 枠線
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
};

const drawFieldPanels = () => {
  ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (field[y][x] !== 0) createPanel(x, y, field[y][x]);
    }
  }
};

type Cursor = {
  x: number;
  y: number;
};

const cursor: Cursor = { x: 0, y: 0 };

const drawCursor = () => {
  ctx.fillStyle = "black";  
  let shortSide = BLOCK_SIZE / 12;
  let longSide = BLOCK_SIZE / 4;
  let left_x = cursor.x * BLOCK_SIZE;
  let left_y = cursor.y * BLOCK_SIZE;
  // 左カーソル
  ctx.fillRect(left_x, left_y, longSide, shortSide);
  ctx.fillRect(left_x, cursor.y * BLOCK_SIZE, shortSide, longSide);
  ctx.fillRect(left_x + BLOCK_SIZE * 3 / 4, left_y, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE * 11 / 12, left_y, shortSide, longSide);
  ctx.fillRect(left_x, left_y + BLOCK_SIZE * 11 / 12, longSide, shortSide);
  ctx.fillRect(left_x, left_y + BLOCK_SIZE * 3 / 4, shortSide, longSide);
  ctx.fillRect(left_x + BLOCK_SIZE * 3 / 4, left_y + BLOCK_SIZE * 11 / 12, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE * 11 / 12, left_y + BLOCK_SIZE * 3 / 4, shortSide, longSide);
  
  // 右カーソル
  ctx.fillRect(left_x + BLOCK_SIZE, left_y, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE, cursor.y * BLOCK_SIZE, shortSide, longSide);
  ctx.fillRect(left_x + BLOCK_SIZE + BLOCK_SIZE * 3 / 4, left_y, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE + BLOCK_SIZE * 11 / 12, left_y, shortSide, longSide);
  ctx.fillRect(left_x + BLOCK_SIZE, left_y + BLOCK_SIZE * 11 / 12, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE, left_y + BLOCK_SIZE * 3 / 4, shortSide, longSide);
  ctx.fillRect(left_x + BLOCK_SIZE + BLOCK_SIZE * 3 / 4, left_y + BLOCK_SIZE * 11 / 12, longSide, shortSide);
  ctx.fillRect(left_x + BLOCK_SIZE + BLOCK_SIZE * 11 / 12, left_y + BLOCK_SIZE * 3 / 4, shortSide, longSide);
};

const checkMove = (x: number, y: number) => {
  if (x < 0 || x >= COLUMNS || y < 0 || y >= ROWS) {
    return false;
  }
  return true;
};
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (checkMove(cursor.x - 1, cursor.y)) cursor.x--;
      break;
    case "ArrowRight":
      if (checkMove(cursor.x + 2, cursor.y)) cursor.x++;
      break;
    case "ArrowUp":
      if (checkMove(cursor.x, cursor.y - 1)) cursor.y--;
      break;
    case "ArrowDown":
      if (checkMove(cursor.x, cursor.y + 1)) cursor.y++;
      break;
    case " ":
      if (field[cursor.y][cursor.x] !== 0 && field[cursor.y][cursor.x + 1] === 0) {
        field[cursor.y][cursor.x + 1] = field[cursor.y][cursor.x];
        field[cursor.y][cursor.x] = 0;
        break;
      }
      if (field[cursor.y][cursor.x] === 0 && field[cursor.y][cursor.x + 1] !== 0) {
        field[cursor.y][cursor.x] = field[cursor.y][cursor.x + 1];
        field[cursor.y][cursor.x + 1] = 0; 
        break;
      }
  }
  drawFieldPanels();
  drawCursor();
});

const updateDropState = () => {
  // 一番下から2行目から
  for (let y = ROWS - 2; y >= 0; y--) {
    // 一番左から
    for (let x = 0; x < COLUMNS; x++) {
      let block = field[y][x];
      if (block === 0) {
        continue; // パネルがなければ次へ
      } else if (block.state === FALLING) {
        // 下にパネルがあればstateをFIXEDに
        if (field[y + 1][x] !== 0) {
          block.state = FIXED;
        }
      } else if (field[y + 1][x] === 0) {
        // 下にパネルがなければstateをFALLINGに
        block.state = FALLING;
      }
    }
  }
  drawFieldPanels();
  drawCursor();
}

const dropDown = () => {
  // 一番下から2行目から
  for (let y = ROWS - 2; y >= 0; y--) {
    // 一番左から
    for (let x = 0; x < COLUMNS; x++) {
      let block = field[y][x];
      if (block === 0) {
        continue; // パネルがなければ次へ
      } else {
        if (block.state === FALLING) {
          // 下にパネルがなければstateをFALLINGに
          field[y + 1][x] = block;
          field[y][x] = 0;
        }
      }
    }
  }
}

// ゲームインターバル
setInterval(() => {
  updateDropState();
  dropDown();
  drawFieldPanels();
  drawCursor();
}, 1000)

const init = () => {
  for (let y = 0; y < ROWS; y++) {
    field[y] = [];
    for (let x = 0; x < COLUMNS; x++) {
      field[y][x] = 0;
    }
  }
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      // 適当にパネルを配置する位置を決める TODO: あとで消す
      if (Math.random() < 0.3) field[y][x] = getRandomPanel();
    }
  }
  drawFieldPanels();
  drawCursor();
};

init();


