import { Board } from "./Board.js";
import { Snake } from "./Snake.js";
import { Food } from "./Food.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.tileSize = 20;
    this.cols = 30;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);

    this.isGameOver = false;
    this.lastResult = null;

    this.playerCount = 1;
    this.snakes = [];
    this.scores = [];

    this.loser = null;

    this.food = new Food(this.cols, this.rows, this.tileSize, this.ctx);

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.loopId = null;

    // Multiplayer
    this.netMode = "local"; // "local" | "host" | "client"
    this.onState = null;
    this.onGameOver = null;

    this.setPlayers(1);
  }

  setNetMode(mode) {
    this.netMode = mode;
  }

  setPlayers(count) {
    this.playerCount = count;

    if (count === 2) {
      this.snakes = [new Snake("black"), new Snake("blue")];

      this.snakes[0].segments = [
        { x: 2, y: this.rows - 3 },
        { x: 1, y: this.rows - 3 },
        { x: 0, y: this.rows - 3 },
      ];
      this.snakes[0].direction = { x: 1, y: 0 };
      this.snakes[0].nextDirection = { x: 1, y: 0 };

      this.snakes[1].segments = [
        { x: this.cols - 3, y: 2 },
        { x: this.cols - 2, y: 2 },
        { x: this.cols - 1, y: 2 },
      ];
      this.snakes[1].direction = { x: -1, y: 0 };
      this.snakes[1].nextDirection = { x: -1, y: 0 };

      this.scores = [0, 0];
    } else {
      this.snakes = [new Snake("black")];
      this.snakes[0].segments = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      this.snakes[0].direction = { x: 1, y: 0 };
      this.snakes[0].nextDirection = { x: 1, y: 0 };

      this.scores = [0];
    }

    this.isGameOver = false;
    this.lastResult = null;
    this.loser = null;

    this.food.randomize(this._allSegments());
  }

  start() {
    this.stop();

    if (this.netMode !== "client") {
      window.addEventListener("keydown", this._handleKeyDown);
    }

    this.loopId = setInterval(() => this.update(), 500);
  }

  stop() {
    if (this.loopId) clearInterval(this.loopId);
    this.loopId = null;
    window.removeEventListener("keydown", this._handleKeyDown);
  }

  update() {
    if (this.isGameOver) return;

    if (this.netMode === "client") {
      this._draw();
      return;
    }

    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].update();
    }

    this._checkWallCollision();
    if (this.isGameOver) return;

    this._checkFoodCollision();
    if (this.isGameOver) return;

    this._checkSelfCollision();
    if (this.isGameOver) return;

    this._checkSnakeCollision();
    if (this.isGameOver) return;

    this._draw();

    if (this.netMode === "host" && typeof this.onState === "function") {
      this.onState(this.getState());
    }
  }

  _draw() {
    this.board.clear();
    this.board.drawGrid();
    this.food.draw();

    for (let snake of this.snakes) {
      snake.draw(this.ctx, this.tileSize);
    }
  }

  _handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp": this.snakes[0].setDirection(0, -1); break;
      case "ArrowDown": this.snakes[0].setDirection(0, 1); break;
      case "ArrowLeft": this.snakes[0].setDirection(-1, 0); break;
      case "ArrowRight": this.snakes[0].setDirection(1, 0); break;
    }

    if (this.playerCount === 2) {
      if (event.key === "w" || event.key === "W") this.snakes[1].setDirection(0, -1);
      if (event.key === "s" || event.key === "S") this.snakes[1].setDirection(0, 1);
      if (event.key === "a" || event.key === "A") this.snakes[1].setDirection(-1, 0);
      if (event.key === "d" || event.key === "D") this.snakes[1].setDirection(1, 0);
    }
  }

  _checkWallCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      const h = this.snakes[i].segments[0];
      if (h.x < 0 || h.x >= this.cols || h.y < 0 || h.y >= this.rows) {
        this._setGameOver(i);
        return;
      }
    }
  }

  _checkFoodCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      const h = this.snakes[i].segments[0];
      if (h.x === this.food.x && h.y === this.food.y) {
        this.snakes[i].grow();
        this.scores[i]++;
        this.food.randomize(this._allSegments());
      }
    }
  }

  _checkSelfCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      if (this.snakes[i].hasSelfCollision()) {
        this._setGameOver(i);
        return;
      }
    }
  }

  _checkSnakeCollision() {
    if (this.playerCount !== 2) return;

    const h0 = this.snakes[0].segments[0];
    const h1 = this.snakes[1].segments[0];

    if (h0.x === h1.x && h0.y === h1.y) {
      this._setGameOver(null);
      return;
    }

    for (let seg of this.snakes[1].segments) {
      if (seg.x === h0.x && seg.y === h0.y) {
        this._setGameOver(0);
        return;
      }
    }

    for (let seg of this.snakes[0].segments) {
      if (seg.x === h1.x && seg.y === h1.y) {
        this._setGameOver(1);
        return;
      }
    }
  }

  _setGameOver(loserIndex = null) {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.loser = loserIndex;
    this.lastResult = this._getResult();

    this.stop();

    if (typeof this.onGameOver === "function") {
      this.onGameOver(this.lastResult.bestScore, this.lastResult.winner);
    }

    if (this.netMode === "host" && typeof this.onState === "function") {
      this.onState(this.getState());
    }
  }

  _getResult() {
    if (this.playerCount === 1) {
      return { winner: 1, bestScore: this.scores[0] };
    }

    if (this.loser !== null) {
      return {
        winner: this.loser === 0 ? 2 : 1,
        bestScore: Math.max(...this.scores),
      };
    }

    const [s0, s1] = this.scores;
    const l0 = this.snakes[0].segments.length;
    const l1 = this.snakes[1].segments.length;

    if (s0 !== s1) return { winner: s0 > s1 ? 1 : 2, bestScore: Math.max(s0, s1) };
    if (l0 !== l1) return { winner: l0 > l1 ? 1 : 2, bestScore: s0 };

    return { winner: 0, bestScore: s0 };
  }

  _allSegments() {
    return this.snakes.flatMap(s => s.segments);
  }

  getState() {
    return {
      playerCount: this.playerCount,
      isGameOver: this.isGameOver,
      result: this.lastResult,
      scores: [...this.scores],
      food: { x: this.food.x, y: this.food.y },
      snakes: this.snakes.map(s => ({
        color: s.color,
        direction: { ...s.direction },
        nextDirection: { ...s.nextDirection },
        segments: s.segments.map(seg => ({ ...seg })),
      })),
    };
  }

  applyState(state) {
    if (!state) return;

    this.playerCount = state.playerCount;
    this.isGameOver = state.isGameOver;
    this.lastResult = state.result;

    this.scores = [...state.scores];

    this.food.x = state.food.x;
    this.food.y = state.food.y;

    if (this.snakes.length !== state.snakes.length) {
      this.snakes = state.snakes.map(s => new Snake(s.color));
    }

    state.snakes.forEach((s, i) => {
      this.snakes[i].direction = s.direction;
      this.snakes[i].nextDirection = s.nextDirection;
      this.snakes[i].segments = s.segments;
    });

    this._draw();
  }

  setPlayerDirection(index, dx, dy) {
    const snake = this.snakes[index];
    if (snake) snake.setDirection(dx, dy);
  }
}
