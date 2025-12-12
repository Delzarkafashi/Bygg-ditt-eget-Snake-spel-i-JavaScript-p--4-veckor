# Lektion 7 – Avancerade kollisioner & flera spelare

I denna lektion bygger vi vidare på Snake-spelet och gör det möjligt att spela flera lokalt.
Fokus ligger på kollisioner och att avgöra vinnare korrekt.

---

## Vad ska vi göra

- Lägga till **kollision mot egen kropp**
- Stöd för **två ormar lokalt** (2 spelare på samma dator)
- Separat styrning:
  - Spelare 1: piltangenter
  - Spelare 2: WASD
- Hantera **kollision mellan ormar**
- Avgöra:
  - vinnare
  - oavgjort (t.ex. huvud mot huvud)

---

## Hur man ska tänka

- Varje orm är en **egen instans av Snake**
- `Game` ansvarar för:
  - att hålla koll på alla ormar
  - kollisioner
  - vem som förlorar först
- Den som **dör först förlorar**, den andra vinner
- Endast om båda dör samtidigt → oavgjort
- UI (HTML + main.js) ska bara **visa resultatet**, inte räkna ut det

---

## Pseudokod – Lektion 7

1. Skapa stöd för flera ormar:
   - `snakes[]`
   - `scores[]`
2. Uppdatera alla ormar varje tick
3. Kollisioner:
   - orm mot vägg
   - orm mot sig själv
   - orm mot annan orm
4. När kollision sker:
   - spara vilken spelare som dog
   - stoppa spelet
5. Räkna ut resultat:
   - om en spelare dog först → andra vinner
   - om båda dog samtidigt → oavgjort
6. Skicka resultat till `main.js` och visa på skärmen