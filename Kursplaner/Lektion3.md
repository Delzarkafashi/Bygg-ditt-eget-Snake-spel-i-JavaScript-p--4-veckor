# Lektion 3 – Rörelse & input

I dag får vi ormen att röra på sig och reagera på tangentbordet.

---

## Vad ska vi göra idag?

- Lägga till **event listener** för tangentbordet (`keydown`).
- Uppdatera **snake.direction** när spelaren trycker på piltangenterna.
- Hindra **180°-vändningar** (t.ex. höger → vänster direkt).
- Flytta ormen varje tick:
  - räkna ut nytt huvud
  - lägga till nya huvudet
  - ta bort sista segmentet

---

## Hur ska vi tänka?

- Ormen rör sig genom att **lägga till ett nytt huvud** och **ta bort svansen**.
- Riktningen är bara ett objekt `{ x, y }`, t.ex. `{ x: 1, y: 0 }`.
- Tangentbordet ändrar *bara riktningen*, inte positionen.
- Själva förflyttningen sker i **Game.update()** när vi anropar `snake.update()`.
- Koden ska byggas på det vi gjorde i lektion 2, inte ersätta något.

---

## Pseudokod / steg

1. I `Snake`:
   - lägg till `direction = { x: 1, y: 0 }`
   - lägg till `nextDirection`
   - skapa `setDirection(dx, dy)` som stoppar motsatt riktning
   - skapa `update()`:
     - `direction = nextDirection`
     - skapa nytt huvud med `x + direction.x`
     - `unshift()` nytt huvud
     - `pop()` svansen

2. I `Game.update()`:
   - lägg till anropet `this.snake.update()` i början.
   - rita sedan som vanligt.

3. I `Game`:
   - lägg till `window.addEventListener("keydown", ...)`
   - mappa piltangenter → `snake.setDirection(...)`.

4. Testa:
   - ormen rör sig automatiskt
   - piltangenter ändrar riktning
   - inga 180°-vändningar tillåts.

