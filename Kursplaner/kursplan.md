# Kursplan – Bygg ditt eget Snake-spel i JavaScript (4 veckor)

## Översikt
Denna kurs är en praktisk utbildning där studenten bygger ett komplett Snake-spel i JavaScript, först singleplayer och sedan multiplayer. Kursen avslutas med att studenten bygger en **egen WebSocket-server i Node.js**.

- **Längd:** 4 veckor  
- **Studietakt:** 4 dagar per vecka  
- **Mål:** Behärska HTML, CSS, JS, spelutveckling, multiplayer och serverutveckling i Node.

---

## Vecka 1 – Grunder & Snake-spelets bas

### Lektion 1 – Intro & utvecklingsmiljö
- Installera VS Code, Node, Live Server
- Introduktion till HTML, CSS, JavaScript
- Skapa projektstruktur (mappar, filer)
- Förklara spel-loop och rendering (canvas eller DOM)

### Lektion 2 – Spelplan & rendering
- Rita spelplan (grid/canvas)
- Rendera ormens segment
- Skapa update/tick-loop (`setInterval` eller `requestAnimationFrame`)
- Introduktion till klasser: `Game`, `Snake`

### Lektion 3 – Rörelse & input
- Tangentbordsstyrning (event listeners)
- Ändra riktning korrekt (ingen 180°-vändning rakt in i sig själv)
- Förflyttning per tick (huvud flyttas, kroppen följer)

### Lektion 4 – Mat, väggar & game over
- Slumpa mat på spelplanen
- Förläng ormen när den äter mat
- Kollision mot vägg → game over
- Reset & starta ny runda utan sidladdning

---

## Vecka 2 – Struktur, scoreboard & UI

### Lektion 5 – OOP & refaktorering
- Dela upp spelet i klasser: `Game`, `Snake`, `Board`, `Food`
- Tydliga ansvarsområden (logik vs rendering)
- Städning av kod, dela upp i filer

### Lektion 6 – Scoreboard & localStorage
- Spara poäng lokalt med `localStorage`
- Läsa in scoreboard vid start
- Visa scoreboard i UI (lista med namn + poäng)
- Sortera resultat (fallande poäng)

### Lektion 7 – Avancerade kollisioner
- Kollision mot egen kropp
- Stöd för flera ormar lokalt (t.ex. två spelare på samma dator)
- Vinnare, oavgjort, tie-breaker-logik

### Lektion 8 – UI & polish
- Startskärm (start-knapp, ev. namninput)
- Game-over-skärm med resultat
- Design, färger, typografi
- Finslipning av spelupplevelse

---

## Vecka 3 – Multiplayer med lärarens API

### Lektion 9 – Introduktion till MultiplayerApi
- Importera API-modulen: `MultiplayerApi`
- Förklara host/join och sessioner
- Testa `host()`, `join()` och `listen()` i ett enkelt test-UI
- Förstå events: `joined`, `game`

### Lektion 10 – Synkronisering av speldata
- Bestäm vilken speldata som ska skickas (positioner, riktningar, namn m.m.)
- Skicka speldata med `api.game(data)`
- Ta emot andra spelares data i `listen`-callback
- Rendera flera ormar på planen utifrån nätverksdata

### Lektion 11 – Multiplayer-logik
- Hantera events: `joined`, `game` (och ev. `leaved` om det implementeras)
- Ordning på meddelanden med `messageId`
- Synkad matchstart (t.ex. host startar match och skickar “start”-event)
- Synkad matchslut och vinnare för alla klienter

### Lektion 12 – Stabilitet & felsökning
- Hantera frånkopplingar (visa status, pausa spel, etc.)
- Enkel felhantering om servern inte svarar
- Host som ledande instans (bestämmer spelstate)
- Testa med flera klienter öppna samtidigt

---

## Vecka 4 – Bygg en egen WebSocket-server

### Lektion 13 – Node.js & WebSockets
- Installera Node.js
- Skapa projekt för servern: `npm init -y`
- Installera WebSocket-bibliotek, t.ex. `ws`
- Skapa första WebSocket-servern (`WebSocketServer`)
- Logga anslutningar och mottagna meddelanden

### Lektion 14 – Sessions & klienthantering
- Hålla reda på anslutna klienter
- Skapa och hantera `sessionId` för olika matcher
- Koppla klienter till sessioner
- Broadcast av speldata till alla klienter i samma session

### Lektion 15 – Implementera egen Mini-API
- Designa en enkel protokollstruktur (t.ex. `{ cmd, session, data }`)
- Implementera motsvarigheter till:
  - `host()` – skapa ny session
  - `join(sessionId)` – anslut klient till befintlig session
  - `game(data)` – skicka speldata till sessionen
- Koppla din klientkod till den egna servern
- Testa multiplayer lokalt (två fönster/flikar)

### Lektion 16 – Projektavslut & publicering
- Finslipning & debug av både klient och server
- Publicera frontend (t.ex. Netlify, Vercel eller GitHub Pages)
- Publicera server (t.ex. Render, Railway, Fly.io – eller köra lokalt i undervisning)
- Sammanfattning av kursen och demonstration av allas spel

---

## Slutmål
Efter kursen har studenten:

- Byggt ett komplett Snake-spel i JavaScript  
- Implementerat multiplayer med lärarens API  
- Skapat en **egen multiplayer-server i Node.js med WebSockets**  
- Fått förståelse för hela kedjan: frontend → spel-logik → backend/server.
