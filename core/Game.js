import { Board } from "./Board.js";
import { Snake } from "./Snake.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.tileSize = 20;
    this.cols = 20;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);
    this.snake = new Snake();
  }

  start() {
    setInterval(() => this.update(), 150);
  }

  update() {
    this.board.clear();
    this.board.drawGrid();
    this.snake.draw(this.ctx, this.tileSize);
  }
}
