import { Universe, Cell, Direction } from "wasm-game-of-life/hello";
import { memory } from "wasm-game-of-life/hello_bg";

const CELL_SIZE = 40; // px
const GRID_COLOR = "#CCCCCC";
const WHITE_COLOR = "#FFFFFF";
const GRAY_COLOR = "#FF0000";
const BLACK_COLOR = "#000000";
const ANT_SIZE = 25.6;

const universe = Universe.new();
const width = universe.width();
const height = universe.height();
const ant = new Path2D(
  "m0 23.931c-1.026 0.841 7.226 11.285 7.735 11.893 7.05 8.436 14.029 8.726 14.892 9.985 0.87 1.251 5.028 5.437 12.424 6.668 0.028 1.923 0.134 3.74 0.332 5.466-4.546-1.252-9.666-2.327-12.53-2.32-3.019-0.007-13.244 2.85-15.075 3.706-0.644 0.304-12.325 0.007-12.325 1.279 0 1.287 11.632 1.761 12.113 1.111 4.221 0.671 16.178-1.514 17.451-1.287 1.273 0.24 11.066 3.09 11.137 3.104 0.735 3.38 1.803 5.225 3.069 7.481-4.865-0.141-13.598 4.674-18.47 9.546-4.044 4.045-10.783 10.585-11.801 12.028-3.805 5.374-2.101 22.179 0.007 22.179 1.654 0-2.306-15.044 1.499-20.418 1.096-1.549 13.35-9.914 14.778-11.555 1.429-1.64 9.023-3.988 12.205-6.364-3.203 2.072-5.395 5.311-5.395 9.766 0 16.541 8.633 23.211 15.118 23.291 0 0 0.007 0.02 0.021 0.02h0.127c6.477-0.08 15.069-6.77 15.069-23.283 0.007-4.151-1.91-7.269-4.752-9.348 3.458 2.213 10.239 4.384 11.582 5.926 1.436 1.633 13.632 9.998 14.732 11.554 3.82 5.367-0.14 20.431 1.53 20.431 2.09 0 3.81-16.811 0-22.185-1.02-1.435-7.755-7.969-11.8-12.014-4.879-4.879-13.598-9.694-18.47-9.546 1.266-2.255 2.327-4.15 3.069-7.537 0.064-0.008 9.857-2.815 11.137-3.048s13.23 1.959 17.454 1.28c0.48 0.657 12.12 0.177 12.11-1.103 0.01-1.28-11.71-1.004-12.35-1.308-1.83-0.863-12.002-3.713-15.029-3.713-2.864 0.007-8.025 1.082-12.572 2.32 0.198-1.712 0.346-3.529 0.375-5.452 7.396-1.245 11.561-5.424 12.416-6.675 0.87-1.252 7.849-1.542 14.9-9.992 0.5-0.601 8.76-11.052 7.73-11.886-1.21-0.983-8.78 8.761-9.08 9.616-2.05 1.019-11.796 7.51-12.97 7.977-1.181 0.459-7.12 2.581-13.435 6.364-0.969-3.699-3.408-6.209-6.392-7.538 4.122-0.007 7.121-0.813 7.121-5.353 0-4.964-0.955-9.539-2.56-13.209 4.391-2.284 7.573-4.73 8.527-5.077 0.955-0.36 1.323-1.676-0.487-4.999-2.984-5.4589-6.216-10.189-6.916-9.9278-0.7 0.2758 2.567 10.911 5.367 13.202-3.316 0.587-5.494 1.662-8.259 3.578-2.178-3.295-4.978-5.275-8.068-5.325-0.007-0.007-0.014-0.028-0.021-0.021-0.029 0-0.064-0.007-0.092-0.007-3.097 0.042-5.954 2.051-8.125 5.353-2.772-1.909-4.935-3.012-8.245-3.606 2.8-2.277 6.088-12.905 5.388-13.167-0.7-0.2614-3.952 4.4338-6.936 9.893-1.818 3.33-1.422 4.674-0.467 5.02 0.962 0.354 4.144 2.8 8.535 5.084-1.612 3.663-2.567 8.252-2.567 13.216 0 4.526 2.998 5.346 7.113 5.346-2.976 1.336-5.416 3.846-6.385 7.531-6.314-3.784-12.282-5.877-13.456-6.343-1.181-0.46-10.918-7.001-12.968-8.019-0.297-0.848-7.849-10.578-9.065-9.588z"
);

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const renderLoop = () => {
  universe.tick();

  drawGrid();
  drawCells();
  drawAnt();

  setTimeout(() => {
    requestAnimationFrame(renderLoop);
  }, 400);
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Black ? BLACK_COLOR : WHITE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const drawAnt = () => {
  const antPtr = universe.ant();
  const antInfo = new Uint32Array(memory.buffer, antPtr, 3);
  const xPos = antInfo[0];
  const yPos = antInfo[1];
  const direction = antInfo[2];
  if (xPos >= height || yPos >= width) {
    return;
  }
  let m = document
    .createElementNS("http://www.w3.org/2000/svg", "svg")
    .createSVGMatrix();
  m = m
    .translate(
      yPos * (CELL_SIZE + 1) + 1 + (CELL_SIZE - ANT_SIZE) / 2,
      xPos * (CELL_SIZE + 1) + 1 + (CELL_SIZE - ANT_SIZE) / 2
    )
    .scale(0.2, 0.2);
  switch (direction) {
    case Direction.Right:
      m = m.translate(3 * CELL_SIZE, 0).rotate(90, 0);
      break;
    case Direction.Down:
      m = m.translate(0, 3.5 * CELL_SIZE).flipY();
      break;
    case Direction.Left:
      m = m.translate(0, 3 * CELL_SIZE).rotate(-90, 0);
      break;
  }
  const p = transformPath2D(ant, m);
  ctx.fillStyle = GRAY_COLOR;
  ctx.fill(p);
};

function transformPath2D(path, matrix) {
  const p = new Path2D();
  p.addPath(path, matrix);
  return p;
}

drawGrid();
drawCells();
drawAnt();

setTimeout(() => {
  requestAnimationFrame(renderLoop);
}, 1000);
