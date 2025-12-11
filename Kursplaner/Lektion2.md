# Lektion 2 – Spelplan & rendering

I dag bygger vi upp själva spelplanen och ritar vår första orm på den.

---

## Vad ska vi göra idag?

- Skapa en **spelplan** med hjälp av `<canvas>`.
- Bestämma en **grid** (antal rutor + ruta-storlek).
- Rita ut ett **rutnät** på canvasen.
- Skapa en enkel **Snake** (array med segment).
- Rita ormens segment på rätt rutor.
- Flytta över logik till klasser: `Board` och `Snake`.
- Göra en enkel **update-loop** som ritar om spelplanen.

---

## Hur ska vi tänka?

- Canvas är bara **ytan**, klasserna (`Board`, `Snake`) är **hjärnan**.
- Spelplanen består av **rutor**, inte pixlar – vi räknar i grid-koordinater (`x`, `y`).
- Varje ruta ritas om till pixlar med:  
  `pixelX = x * tileSize`, `pixelY = y * tileSize`.
- Ormen är en **lista med segment** (`{ x, y }`), inget magiskt.
- `main.js` ska vara **så liten som möjligt** – den bara startar spelet.
- Vi fokuserar på att **rita rätt**, inte på rörelse än (det kommer i lektion 3).

---

## Pseudokod / steg

1. Säkerställ att `index.html` har:
   - `<canvas id="game" width="400" height="400"></canvas>`
   - `<script type="module" src="main.js"></script>` längst ned i `<body>`.
2. I `core/Board.js`:
   - skapa klass `Board(cols, rows, tileSize, ctx)`
   - metod `clear()` som tömmer canvas
   - metod `drawGrid()` som ritar linjer för alla kolumner och rader.
3. I `core/Snake.js`:
   - skapa klass `Snake` med `this.segments = [{ x: 10, y: 10 }, { x: 9, y: 10 }, ...]`
   - metod `draw(ctx, tileSize)` som loopar över `segments` och ritar fyllda rutor.
4. I `core/Game.js`:
   - importera `Board` och `Snake`
   - skapa `this.board` och `this.snake` i konstruktorn
   - skapa `update()`:
     - `board.clear()`
     - `board.drawGrid()`
     - `snake.draw(...)`
   - skapa `start()` som kör `setInterval(() => this.update(), 150)`.
5. I `main.js`:
   - hämta canvas + context
   - skapa `const game = new Game(ctx);`
   - anropa `game.start();`
6. Testa i webbläsaren:
   - rutnätet syns
   - ormen (en svart “bit”) syns på planen.
