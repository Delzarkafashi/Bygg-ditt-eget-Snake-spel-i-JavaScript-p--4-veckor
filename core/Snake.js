export class Snake {
  constructor(color = "black") { // lägga till color
    this.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];

    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    this.color = color; // spara färg för ormen
  }

  setDirection(dx, dy) {
    const isOpposite =
      dx === -this.direction.x && dy === -this.direction.y;

    if (isOpposite) return;

    this.nextDirection = { x: dx, y: dy };
  }

  update() {
    this.direction = this.nextDirection;

    const head = this.segments[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    this.segments.unshift(newHead);
    this.segments.pop();
  }

  draw(ctx, tileSize) {
    ctx.fillStyle = this.color; // använd ormens färg
    this.segments.forEach(seg => {
      ctx.fillRect(
        seg.x * tileSize,
        seg.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }

  grow() {
    const tail = this.segments[this.segments.length - 1];
    this.segments.push({ x: tail.x, y: tail.y });
  }

  hasSelfCollision() {
    const [head, ...body] = this.segments;
    return body.some(seg => seg.x === head.x && seg.y === head.y);
  }
}
