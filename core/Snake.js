export class Snake {
  constructor() {
    this.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
  }

  draw(ctx, tileSize) {
    this.segments.forEach(seg => {
      ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);
    });
  }
}
