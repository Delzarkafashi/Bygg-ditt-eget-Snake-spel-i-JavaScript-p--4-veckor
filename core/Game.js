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
    this.score = 0;              // poäng som ökar när vi äter mat

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
      this._setGameOver();   // samla all game-over-logik på ett ställe
    }
  }

  _checkFoodCollision() {
    const head = this.snake.segments[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      // ormen växer och vi ökar poängen
      this.snake.grow();
      this.score += 1;

      this.food.randomize(this.snake.segments);
    }
  }

  // anropas när spelet ska ta slut
  _setGameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;

    // låt main.js få veta slutpoängen
    if (typeof this.onGameOver === "function") {
      this.onGameOver(this.score);
    }
  }

  reset() {
    this.snake = new Snake();
    this.food.randomize(this.snake.segments);
    this.isGameOver = false;
    this.score = 0;        // börja om med 0 poäng
  }
}
