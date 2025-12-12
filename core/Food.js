export class Food {
  constructor(cols, rows, tileSize, ctx) {
    this.cols = cols;
    this.rows = rows;
    this.tileSize = tileSize;
    this.ctx = ctx;

    this.x = 0;
    this.y = 0;
  }

  // slumpa ny position (inte på ormen)
  randomize(snakeSegments) {
    while (true) {
      const x = Math.floor(Math.random() * this.cols);
      const y = Math.floor(Math.random() * this.rows);

      const onSnake = snakeSegments.some(seg => seg.x === x && seg.y === y);
      if (!onSnake) {
        this.x = x;
        this.y = y;
        return;
      }
    }
  }

    draw() {
    this.ctx.fillStyle = "white"; // NYTT

    const pad = 6; // NYTT
    const size = this.tileSize - pad;

    this.ctx.fillRect(
        this.x * this.tileSize + pad / 2,
        this.y * this.tileSize + pad / 2,
        size,
        size
    );
    }
}
