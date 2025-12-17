# Lektion 9 – Introduktion till MultiplayerApi

I denna lektion påbörjar vi multiplayer-delen av projektet.
Fokus ligger på att förstå hur flera spelare kan koppla upp sig mot varandra
och hur kommunikation över nätverk fungerar – utan att ännu blanda in Snake-spelets logik.

---

## Vad ska vi

- Skapa en enkel **WebSocket-server**:
  - ta emot klienter
  - skapa och hantera sessioner
  - skicka meddelanden mellan spelare i samma session

- Skapa ett **MultiplayerApi** på klientsidan:
  - koppla upp sig mot servern
  - kunna:
    - hosta en session
    - joina en session
    - skicka data
    - lyssna på events

- Förstå grundbegrepp:
  - host
  - join
  - session-id
  - client-id

- Bygga ett **enkelt test-UI**:
  - host-knapp
  - join-knapp
  - input för session-id
  - console-loggar för alla events

- Testa multiplayer lokalt:
  - en server
  - flera webbläsarflikar
  - realtidskommunikation

- Strukturera projektet korrekt:
  - backend med `npm`
  - lägga till **.gitignore**
  - undvika att `node_modules` och andra genererade filer hamnar i Git

---

## Hur man ska tänka

- Multiplayer byggs **separat från spelet**
- Först säkerställer vi att:
  - anslutning fungerar
  - host och join fungerar
  - klienter kan skicka data till varandra

- Snake-spelet kopplas in **senare**

Ansvarsfördelning:

- Servern:
  - håller koll på sessioner
  - vet vilka klienter som är anslutna
  - skickar vidare meddelanden

- MultiplayerApi:
  - kapslar in WebSocket-logik
  - exponerar ett enkelt API mot spelet

- Test-UI:
  - används bara för att verifiera funktionalitet
  - innehåller ingen spel-logik

- Git:
  - används för versionshantering
  - `.gitignore` säkerställer ett rent repo

---

## Pseudokod – Lektion 9

1. Starta WebSocket-server
2. Klient ansluter till servern
3. Host:
   - skickar `host`
   - server skapar session
   - server skickar tillbaka session-id
4. Join:
   - skickar `join` + session-id
   - server lägger till klient i session
5. Klienter lyssnar på events via `listen()`
6. Skicka testdata med `game(data)`
7. Servern skickar datan vidare till alla klienter i sessionen
