export class Board {
  constructor(cols, rows, tileSize, ctx) {
    this.cols = cols;
    this.rows = rows;
    this.tileSize = tileSize;
    this.ctx = ctx;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cols * this.tileSize, this.rows * this.tileSize);
  }

  drawGrid() {
    const w = this.cols * this.tileSize;
    const h = this.rows * this.tileSize;

    for (let x = 0; x <= this.cols; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.tileSize, 0);
      this.ctx.lineTo(x * this.tileSize, h);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.rows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.tileSize);
      this.ctx.lineTo(w, y * this.tileSize);
      this.ctx.stroke();
    }
  }
}
