# Lektion 1 – Intro & utvecklingsmiljö

I dag sätter vi upp verktygen och gör första lilla testet till Snake-spelet.

---

## Vad ska vi göra idag?

- Installera **VS Code**, **Node.js** och **Live Server**.
- Skapa en enkel **projektmapp** för Snake-spelet.
- Göra en minsta möjliga **index.html** + `main.js`.
- Visa en **spel-loop** (`setInterval`) och rita en ruta på **canvas**.

---

## Hur ska vi tänka?

- Fokus är på att **allt funkar tekniskt**: editor, webbläsare, konsol.
- Vi bygger inte spelet än – vi gör bara ett **test-skelett**.
- Tänk:  
  **HTML = sida**,  
  **canvas = spelplan**,  
  **JS = hjärnan som kör en loop**.
- Det är okej om koden är enkel och ful, poängen är att **se något hända**.

---

## Pseudokod / steg

1. Skapa mapp: `snake-projekt/`.
2. Skapa filerna:
   - `index.html`
   - `main.js`
3. I `index.html`:
   - lägg in `<h1>Snake test</h1>`
   - lägg in `<canvas id="game" width="400" height="400"></canvas>`
   - länka `<script src="main.js"></script>` längst ned i `<body>`.
4. I `main.js`:
   - `console.log("Spelet startar!");`
   - hämta canvas: `document.getElementById("game")`
   - hämta context: `canvas.getContext("2d")`
   - rita en grön ruta med `fillRect(...)`
   - skapa en enkel spel-loop med `setInterval(() => console.log("tick"), 500)`
5. Starta sidan med **Live Server** och kolla:
   - att rutan syns
   - att `tick` syns i konsolen.
