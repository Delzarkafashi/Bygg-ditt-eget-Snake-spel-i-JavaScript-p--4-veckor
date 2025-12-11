import { Board } from "./Board.js";
import { Snake } from "./Snake.js";
import { Food } from "./Food.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.tileSize = 20;
    this.cols = 20;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);
    this.snake = new Snake();

    this.isGameOver = false;
    this.food = new Food(this.cols, this.rows, this.tileSize, this.ctx);
    this.food.randomize(this.snake.segments);

    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  start() {
    window.addEventListener("keydown", this._handleKeyDown);
    this.loopId = setInterval(() => this.update(), 150);
  }

  update() {
    if (this.isGameOver) return;

    this.snake.update();
    this._checkWallCollision();
    this._checkFoodCollision();

    this.board.clear();
    this.board.drawGrid();
    this.food.draw();
    this.snake.draw(this.ctx, this.tileSize);
  }

  _handleKeyDown(event) {
    if (this.isGameOver && event.key === "Enter") {
      this.reset();
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        this.snake.setDirection(0, -1);
        break;
      case "ArrowDown":
        this.snake.setDirection(0, 1);
        break;
      case "ArrowLeft":
        this.snake.setDirection(-1, 0);
        break;
      case "ArrowRight":
        this.snake.setDirection(1, 0);
        break;
    }
  }

  _checkWallCollision() {
    const head = this.snake.segments[0];
    if (
      head.x < 0 ||
      head.x >= this.cols ||
      head.y < 0 ||
      head.y >= this.rows
    ) {
      this.isGameOver = true;
    }
  }

  _checkFoodCollision() {
    const head = this.snake.segments[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      //låter Snake växa via sin egen metod
      this.snake.grow();
      this.food.randomize(this.snake.segments);
    }
  }

  reset() {
    this.snake = new Snake();
    this.food.randomize(this.snake.segments);
    this.isGameOver = false;
  }
}
