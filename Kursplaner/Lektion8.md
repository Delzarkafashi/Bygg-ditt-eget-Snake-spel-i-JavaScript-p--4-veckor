# Lektion 8 – UI & polish

I denna lektion fokuserar vi på att göra Snake-spelet mer användarvänligt och “färdigt”.
Vi bygger vidare på spelets logik och lägger all energi på UI, feedback och helhetskänsla.

---

## Vad ska vi

- Skapa en **startskärm**:
  - Titel
  - Val av antal spelare (1 eller 2)
  - Start-knapp
- Spelet startar **endast via start-knappen**, inte automatiskt

- Skapa en **game-over-skärm (overlay)**:
  - Visas ovanpå spelet när spelet är slut
  - Visar:
    - “Game Over”
    - Vinnare eller oavgjort
    - Poäng
  - Knappar för:
    - Spela igen (ny runda)
    - Gå tillbaka till startskärmen

- Koppla game-over till spelets logik:
  - `Game` räknar ut resultatet
  - `main.js` ansvarar för att visa det i UI

- Förbättra UI-feedback under spelet:
  - Visar kontroller beroende på antal spelare
  - Visar poäng live under spelets gång

- Förbättra design & utseende:
  - Enhetliga färger
  - Rundade kort och overlays
  - Tydlig kontrast mellan spel och UI
  - Mer “spel-känsla” än demo

- Finslipa spelupplevelsen:
  - Tydliga övergångar mellan:
    - Start → Spel → Game Over → Ny runda
  - Ingen sidladdning behövs
  - Användaren vet alltid vad nästa steg är

---

## Hur man ska tänka

- `Game` ska:
  - bara sköta spelregler och resultat
- `main.js` ska:
  - koppla spelet till UI
  - visa rätt skärm vid rätt tillfälle
- HTML/CSS ska:
  - bara hantera layout och utseende
- UI ska guida spelaren:
  - innan spelet
  - under spelet
  - efter spelet

---

## Pseudokod – Lektion 8

1. Bygg startskärm i HTML:
   - `#start-screen` med select (1/2 spelare) och start-knapp
   - `#game-screen` gömd från början
2. I `main.js`:
   - vid klick på start:
     - läs antal spelare
     - `game.setPlayers(players)`
     - göm startskärm
     - visa game-screen
     - `game.start()`
3. Skapa game-over overlay i HTML:
   - `#gameover-screen` (gömd)
   - text-element för resultat
   - knappar: spela igen + tillbaka till start
4. I `Game`:
   - vid game over:
     - sätt `isGameOver = true`
     - räkna ut resultat (`winner`, `bestScore`)
     - spara `lastResult`
     - anropa `onGameOver(bestScore)`
5. I `main.js` (onGameOver):
   - visa overlay
   - skriv ut vinnare/oavgjort + poäng i UI
   - spara score till localStorage + rendera scoreboard
6. Restart-knapp:
   - göm overlay
   - `game.reset()`
7. Till start-knapp:
   - göm overlay
   - `game.reset()`
   - göm game-screen
   - visa start-screen
8. HUD (polish):
   - uppdatera kontroller-text beroende på 1/2 spelare
   - uppdatera poäng-text live under spelet