# Lektion 5 – OOP & refaktorering

I dag städar vi upp koden och ser till att varje klass har ett tydligt ansvar. Spelet fungerar redan – nu gör vi strukturen renare.

---

## Vad ska vi göra idag?

- Säkerställa att koden är uppdelad i rätt klasser:
  - `Board` ritar spelplanen
  - `Food` hanterar matens position och ritning
  - `Snake` hanterar ormens rörelse och tillväxt
  - `Game` styr hela spelet (logik, krockar, start/reset)
- Flytta väx-logiken till `Snake.grow()`.
- Se till att `Game` inte skriver direkt i `snake.segments`.
- Ta bort gamla kommentarer och `console.log`.
- Kontrollera att alla filer ligger på rätt plats och är lätta att läsa.

---

## Hur ska vi tänka?

- Klassen ska bara göra **en sak**:
  - Snake: ormens data + funktioner
  - Board: bara ritning
  - Food: bara mat
  - Game: bara regler och flöde
- `main.js` ska vara minimal.
- Allt som rör själva spelet (rörelse, ätande, game over) ska ske inne i `Game`.
- Refaktorering betyder:
  - mindre duplicerad kod
  - tydligare ansvar
  - enklare att bygga vidare senare (t.ex. multiplayer)

---

## Pseudokod / steg

1. Öppna `Snake.js`:
   - lägg till metoden `grow()`
   - se till att endast `Snake` ändrar sina egna segments

2. Uppdatera `Game.js`:
   - byt ut push-logiken i `_checkFoodCollision()` → `this.snake.grow()`
   - ta bort onödiga kommentarer och prints

3. Kolla `Food.js`:
   - position, `randomize()` och `draw()` ska räcka

4. Kolla `Board.js`:
   - bara `clear()` och `drawGrid()`

5. Läs igenom filerna:
   - är allt lätt att förstå?
   - är varje del i rätt klass?
   - är `main.js` kort och enkel?

