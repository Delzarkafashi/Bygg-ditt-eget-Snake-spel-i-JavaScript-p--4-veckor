# Kursplan – Bygg ditt eget Snake-spel i JavaScript (6 veckor)

## Översikt
Denna kurs är en praktisk utbildning där studenten bygger ett komplett Snake-spel i JavaScript, först singleplayer och därefter **lokal multiplayer på samma dator eller mellan flikar/fönster**.

- **Längd:** 6 veckor  
- **Studietakt:** 4 dagar per vecka  
- **Mål:** Behärska HTML, CSS, JavaScript, spelutveckling, objektorientering och lokal multiplayer.

---

## Vecka 1 – Grunder, spel-loop & grundstruktur

### Lektion 1 – Intro & utvecklingsmiljö
- Installera VS Code och Live Server
- Introduktion till HTML, CSS och JavaScript
- Skapa projektstruktur
- Vad är ett spel? (state, tick, game loop)

### Lektion 2 – Spelplan & rendering
- Rita spelplan (grid eller canvas)
- Rendera bakgrund och rutor
- Första render-/update-loop 

### Lektion 3 – Introduktion till objekt
- Vad är ett objekt?
- Representera ormen som ett objekt
- Position, riktning och segment
- Varför struktur behövs tidigt

### Lektion 4 – Game som central klass
- Introduktion till klasser
- `Game` som ansvarig för spel-loop och state
- Flytta logik från global kod till klasser

---

## Vecka 2 – Snake-logik & singleplayer

### Lektion 5 – Snake-klassen
- `Snake`-klassen
- Rörelse per tick
- Förhindra 180°-vändningar
- Kroppen följer huvudet

### Lektion 6 – Board & Food
- `Board`-klassen
- `Food`-klassen
- Slumpa mat på giltiga positioner
- Koppla ihop med `Game`

### Lektion 7 – Kollisioner
- Kollision med vägg
- Kollision med egen kropp
- Game over-logik

### Lektion 8 – Reset & matchflöde
- Starta ny runda utan sidladdning
- Reset av spelstate
- Enkel matchstruktur

---

## Vecka 3 – UI, scoreboard & polish

### Lektion 9 – UI-grunder
- Startskärm
- Game-over-skärm
- Visa poäng under spel

### Lektion 10 – Scoreboard & localStorage
- Spara poäng lokalt
- Läsa in scoreboard vid start
- Sortera resultat

### Lektion 11 – Design & polish
- Färger och kontrast
- Typografi
- Förbättrad spelkänsla

### Lektion 12 – Stabilitet
- Edge cases
- Buggrättning
- Sluttest av singleplayer

---

## Vecka 4 – Förberedelse för lokal multiplayer

### Lektion 13 – Flera ormar
- Stöd för mer än en `Snake`
- Separat state per spelare
- Olika färger per orm

### Lektion 14 – Input för flera spelare
- Olika tangentuppsättningar
- Samtidiga inputs
- Separat styrning per spelare

### Lektion 15 – Kollision orm ↔ orm
- Vad innebär att “köra in”
- Bestäm förlorare vid kollision
- Reset av enskild spelare

### Lektion 16 – Lokal matchlogik
- Matchstart
- Matchslut
- Vinnare och oavgjort
- Tie-breaker-logik

---

## Vecka 5 – Stabil lokal multiplayer

### Lektion 17 – Synk & uppdateringar
- Uppdatera alla ormar per tick
- Säkerställa konsekvent spelstate

### Lektion 18 – UI för flera spelare
- Visa poäng per spelare
- Visa spelstatus

### Lektion 19 – Robusthet
- Spelare som “dör”
- Återställning utan att bryta spelet

### Lektion 20 – Test & felsökning
- Testspelning
- Identifiera och åtgärda buggar

---

## Vecka 6 – Slutpolish & projektavslut

### Lektion 21 – Spelregler & balans
- Justera tempo
- Justera speltid
- Balans mellan spelare

### Lektion 22 – Kodkvalitet
- Läsbar kod
- Kommentarer
- Tydlig struktur

### Lektion 23 – Slutpolish
- UI-förbättringar
- Smidiga övergångar
- Sluttest av hela spelet

### Lektion 24 – Projektavslut
- Demonstration av spelet
- Reflektion kring lösningar
- Sammanfattning av kursen

---

## Slutmål
Efter kursen har studenten:
- Byggt ett komplett Snake-spel i JavaScript
- Arbetat objektorienterat från tidigt skede
- Implementerat lokal multiplayer
- Skapat UI och scoreboard med localStorage
- Fått en stabil grund i spelutveckling
