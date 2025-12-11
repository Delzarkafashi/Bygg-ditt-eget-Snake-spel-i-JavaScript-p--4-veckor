// core/Snake.js
export class Snake {
  constructor() {
    this.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];

    // starta åt höger
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
  }

  // ändra riktning (ingen 180°-vändning)
  setDirection(dx, dy) {
    const isOpposite =
      dx === -this.direction.x && dy === -this.direction.y;

    if (isOpposite) return; // ignorera om du försöker vända bakåt

    this.nextDirection = { x: dx, y: dy };
  }

  // körs varje tick
  update() {
    // lås in nästa riktning
    this.direction = this.nextDirection;

    const head = this.segments[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    // lägg till nytt huvud
    this.segments.unshift(newHead);
    // ta bort svans
    this.segments.pop();
  }

  draw(ctx, tileSize) {
    ctx.fillStyle = "black";
    this.segments.forEach(seg => {
      ctx.fillRect(
        seg.x * tileSize,
        seg.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }
}
