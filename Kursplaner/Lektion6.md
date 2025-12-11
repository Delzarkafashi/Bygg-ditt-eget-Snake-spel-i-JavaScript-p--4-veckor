# Lektion 6 – Scoreboard & localStorage

I dag gör vi ett enkelt highscore-system som sparas i webbläsaren och visas under spelet.

---

## Vad ska vi göra idag?

- Lägga till en **scoreboard-lista i HTML**.
- Skapa `ScoreboardStorage.js` för:
  - läsa poäng från `localStorage`
  - spara nya poäng
  - sortera poäng och behålla topp 5
- Uppdatera `Scoreboard.js` för att rita listan i UI.
- Koppla ihop `Game` och `main.js`:
  - skicka in poäng vid game over
  - spara poäng
  - uppdatera scoreboarden.

---

## Hur ska vi tänka?

- Scoreboard är en **array av objekt**: `{ name, score }`.
- `localStorage` används som ett litet “mini-databas” i webbläsaren.
- Varje gång spelet är slut:
  1. fråga efter namn
  2. spara `{ name, score }`
  3. sortera och klipp ner till **topp 5**
  4. rita om listan.

---

## Pseudokod / steg

1. HTML:
   - lägg till `<ul id="scoreboard-list"></ul>` under canvasen.

2. `ScoreboardStorage.js`:
   - `loadScores()`:
     - läs från `localStorage`
     - om inget finns → returnera `[]`
   - `saveScore(entry)`:
     - hämta nuvarande scores
     - lägg till `entry`
     - sortera fallande på `score`
     - behåll `slice(0, 5)`
     - spara tillbaka med `JSON.stringify`.

3. `Scoreboard.js`:
   - importera `loadScores`, `saveScore`
   - `renderScoreboard(scores)`:
     - töm listan
     - skapa `<li>` för varje `{ name, score }`.
   - exportera vidare `loadScores`, `saveScore`.

4. `main.js`:
   - importera `renderScoreboard`, `loadScores`, `saveScore`
   - vid start:
     - `renderScoreboard(loadScores())`
   - sätt `game.onGameOver = (score) => { ... }`:
     - fråga efter namn (`prompt`)
     - spara poäng med `saveScore({ name, score })`
     - rendera scoreboard igen.

5. `Game.js`:
   - lägg till `this.score = 0` i konstruktorn
   - öka `this.score` när ormen äter mat
   - skapa `_setGameOver()` som:
     - sätter `isGameOver`
     - anropar `this.onGameOver(this.score)` om funktionen finns.
