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

    this.playerCount = 1;   // antal spelare (1 eller 2)
    this.snakes = [];       // lista av ormar (en per spelare)
    this.scores = [];       // poäng per spelare

    this.loser = null;      // vem som dog (0 eller 1)

    this.food = new Food(this.cols, this.rows, this.tileSize, this.ctx);

    this._handleKeyDown = this._handleKeyDown.bind(this);

    this.setPlayers(1);     // startar som 1 spelare (kan ändras till 2)
  }

  setPlayers(count) {
    this.playerCount = count;

    if (count === 2) {
      this.snakes = [
        new Snake("black"),
        new Snake("blue"),
      ];

        // spelare 1: längst ner till vänster
        this.snakes[0].segments = [
        { x: 2, y: this.rows - 3 },
        { x: 1, y: this.rows - 3 },
        { x: 0, y: this.rows - 3 },
        ];
        this.snakes[0].direction = { x: 1, y: 0 };
        this.snakes[0].nextDirection = { x: 1, y: 0 };

        // spelare 2: högst upp till höger
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
      this.snakes[0].segments = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      this.snakes[0].direction = { x: 1, y: 0 };
      this.snakes[0].nextDirection = { x: 1, y: 0 };

      this.scores = [0];
    }

    this.isGameOver = false;
    this.loser = null;      // nollställ vem som dog

    this.food.randomize(this._allSegments());
  }

  start() {
    window.addEventListener("keydown", this._handleKeyDown);
    this.loopId = setInterval(() => this.update(), 150);
  }

    update() {
    if (this.isGameOver) return;

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

    this.board.clear();
    this.board.drawGrid();
    this.food.draw();

    for (let i = 0; i < this.snakes.length; i++) {
        this.snakes[i].draw(this.ctx, this.tileSize);
    }
    }


  _handleKeyDown(event) {
    // TA BORT detta block om du inte vill att Enter ska starta om
    // if (this.isGameOver && event.key === "Enter") {
    //   this.reset();
    //   return;
    //}

    // spelare 1: piltangenter
    switch (event.key) {
      case "ArrowUp":
        this.snakes[0].setDirection(0, -1);
        break;
      case "ArrowDown":
        this.snakes[0].setDirection(0, 1);
        break;
      case "ArrowLeft":
        this.snakes[0].setDirection(-1, 0);
        break;
      case "ArrowRight":
        this.snakes[0].setDirection(1, 0);
        break;
    }

    // spelare 2: WASD
    if (this.playerCount === 2) {
      if (event.key === "w" || event.key === "W") this.snakes[1].setDirection(0, -1);
      if (event.key === "s" || event.key === "S") this.snakes[1].setDirection(0, 1);
      if (event.key === "a" || event.key === "A") this.snakes[1].setDirection(-1, 0);
      if (event.key === "d" || event.key === "D") this.snakes[1].setDirection(1, 0);
    }
  }

  _checkWallCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      const head = this.snakes[i].segments[0];
      if (
        head.x < 0 ||
        head.x >= this.cols ||
        head.y < 0 ||
        head.y >= this.rows
      ) {
        this._setGameOver(i); // den som går in i väggen förlorar
        
        return;
      }
    }
  }

  _checkFoodCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      const head = this.snakes[i].segments[0];
      if (head.x === this.food.x && head.y === this.food.y) {
        this.snakes[i].grow();
        this.scores[i] += 1;

        this.food.randomize(this._allSegments());
        return;
      }
    }
  }

  _checkSelfCollision() {
    for (let i = 0; i < this.snakes.length; i++) {
      if (this.snakes[i].hasSelfCollision()) {
        this._setGameOver(i); // den som kör in i sig själv förlorar
        return;
      }
    }
  }

  _checkSnakeCollision() {
    if (this.playerCount !== 2) return;

    const head0 = this.snakes[0].segments[0];
    const head1 = this.snakes[1].segments[0];

    if (head0.x === head1.x && head0.y === head1.y) {
      this._setGameOver(null); // huvud mot huvud samtidigt -> oavgjort
      return;
    }

    for (let i = 0; i < this.snakes[1].segments.length; i++) {
      const seg = this.snakes[1].segments[i];
      if (seg.x === head0.x && seg.y === head0.y) {
        this._setGameOver(0); // spelare 1 körde in i spelare 2
        return;
      }
    }

    for (let i = 0; i < this.snakes[0].segments.length; i++) {
      const seg = this.snakes[0].segments[i];
      if (seg.x === head1.x && seg.y === head1.y) {
        this._setGameOver(1); // spelare 2 körde in i spelare 1
        return;
      }
    }
  }

  _setGameOver(loserIndex = null) {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.loser = loserIndex;

    const result = this._getResult();

        // loggar vem som dog + vinnare
    console.log("GAME OVER", "loserIndex:", loserIndex, "winner:", result.winner); 

    this.lastResult = result; // behövs innan main.js läser winner

    if (typeof this.onGameOver === "function") {
        this.onGameOver(result.bestScore, result.winner); // skickar winner till main.js
    }
  }


  _getResult() {
    if (this.playerCount === 1) {
      return { winner: 1, bestScore: this.scores[0] };
    }

    if (this.loser !== null) {
      const winner = this.loser === 0 ? 2 : 1;
      return { winner, bestScore: Math.max(this.scores[0], this.scores[1]) };
    }

    const s0 = this.scores[0];
    const s1 = this.scores[1];
    const l0 = this.snakes[0].segments.length;
    const l1 = this.snakes[1].segments.length;

    if (s0 > s1) return { winner: 1, bestScore: s0 };
    if (s1 > s0) return { winner: 2, bestScore: s1 };

    if (l0 > l1) return { winner: 1, bestScore: s0 };
    if (l1 > l0) return { winner: 2, bestScore: s1 };

    return { winner: 0, bestScore: s0 };
  }

  _allSegments() {
    const all = [];
    for (let i = 0; i < this.snakes.length; i++) {
      for (let j = 0; j < this.snakes[i].segments.length; j++) {
        all.push(this.snakes[i].segments[j]);
      }
    }
    return all;
  }

  reset() {
    this.setPlayers(this.playerCount); // resetar samma läge (1 eller 2 spelare)
  }
}
