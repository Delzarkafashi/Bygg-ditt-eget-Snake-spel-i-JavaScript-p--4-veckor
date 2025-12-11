# Lektion 4 – Mat, väggar & game over

I dag gör vi spelet ”på riktigt”: ormen kan äta mat, växa och dö om den går in i väggen. Vi använder även vår nya `Food`-klass.

---

## Vad ska vi göra idag?

- Skapa en **Food-klass** som hanterar matens position och ritning.
- Slumpa ut mat som inte får hamna på ormen.
- Låta ormen **växa** när den äter.
- Kolla **vägg-kollision** → game over.
- Göra en enkel **reset** utan att ladda om sidan.

---

## Hur ska vi tänka?

- Mat är bara en **ruta** på spelplanen, precis som ett ormssegment.
- När ormen äter mat ska vi **inte ta bort svansen** → ormen blir längre.
- När huvudet går utanför spelplanen sätts:  
  `this.isGameOver = true`.
- Efter game over ska spelet **sluta uppdatera** tills spelaren trycker *Enter*.
- `Game` styr flödet, `Food` sköter matens logik, `Snake` sköter rörelse.

---

## Pseudokod / steg

1. Skapa `Food`-klass i `Food.js`:
   - lagra `x`, `y`, `cols`, `rows`, `tileSize` och `ctx`
   - metod `randomize(snakeSegments)` som slumpas tills mat inte ligger på ormen
   - metod `draw()` som ritar en röd ruta

2. I `Game.js`, i konstruktorn:
   - skapa `this.food = new Food(...)`
   - anropa `this.food.randomize(this.snake.segments)`

3. I `Game.update()`:
   - anropa `this._checkFoodCollision()`
   - anropa `this._checkWallCollision()`
   - rita mat med `this.food.draw()`

4. Skapa `_checkFoodCollision()`:
   - om ormens huvud ligger på maten:
     - pusha ett extra segment längst bak
     - slumpa ny mat: `this.food.randomize(this.snake.segments)`

5. Skapa `_checkWallCollision()`:
   - om huvudets `x` eller `y` är utanför spelplanen → `isGameOver = true`

6. Skapa `reset()`:
   - skapa ny `Snake()`
   - slumpa ny mat
   - sätt `isGameOver = false`

7. I `keydown`:
   - om game over och Enter trycks → kör `reset()`
