import { Game } from "./core/Game.js";
import { renderScoreboard, loadScores, saveScore } from "./scoreboard/Scoreboard.js";

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const playerSelect = document.getElementById("player-select");

const gameOverScreen = document.getElementById("gameover-screen"); // game-over overlay
const gameOverResult = document.getElementById("gameover-result"); // text för resultat i overlay
const restartBtn = document.getElementById("restart-btn");         // knapp för ny runda
const controlsText = document.getElementById("controls-text"); // visar kontroller
const liveScoreEl = document.getElementById("live-score");     // visar poäng live
const menuBtn = document.getElementById("menu-btn"); // går tillbaka till startmenyn
//egen snygg name-modal (ersätter prompt)
const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("name-input");
const nameSaveBtn = document.getElementById("name-save-btn");
const nameCancelBtn = document.getElementById("name-cancel-btn");
let pendingScore = 0; //sparar score tills man trycker "Spara"



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

function updateHud() {
  // visar kontroller beroende på antal spelare (Lektion 8)
  if (controlsText) {
    controlsText.textContent =
      game.playerCount === 2
        ? "Spelare 1: Pilar • Spelare 2: WASD"
        : "Spelare 1: Pilar";
  }

  // visar poäng live (Lektion 8)
  if (liveScoreEl) {
    if (game.playerCount === 2) {
      liveScoreEl.textContent = `Poäng : Spelare 1: ${game.scores[0]} | Spelare 2: ${game.scores[1]}`;
    } else {
      liveScoreEl.textContent = `Poäng : ${game.scores[0]}`;
    }
  }
}

setInterval(updateHud, 100); // uppdaterar HUD regelbundet (Lektion 8)

game.onGameOver = (score) => {
  // visar game-over overlay + resultat (vinnare/oavgjort)
  if (gameOverScreen && gameOverResult && game.lastResult) {
    const w = game.lastResult.winner;
    if (w === 0) gameOverResult.textContent = "Oavgjort!";
    if (w === 1) gameOverResult.textContent = `Vinnare: Spelare 1 (Poäng: ${score})`;
    if (w === 2) gameOverResult.textContent = `Vinnare: Spelare 2 (Poäng: ${score})`;

    gameOverScreen.style.display = "grid";
  }

  //öppna name-modal istället för prompt
  pendingScore = score;
  if (nameModal) {
    nameModal.style.display = "grid";
    if (nameInput) {
      nameInput.value = "";
      nameInput.focus();
    }
  }
};

restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none"; // göm overlay när man startar om
  game.reset();                          // starta ny runda utan sidladdning

  updateHud(); // uppdaterar poäng/controls direkt efter reset (Lektion 8)
});
menuBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none"; // göm game-over
  game.reset();                          // nollställ spelet

  gameScreen.style.display = "none";     // göm spelvyn
  startScreen.style.display = "block";   // visa startvyn
});

// spara namn + score när man klickar "Spara"
nameSaveBtn.addEventListener("click", () => {
  const name = (nameInput?.value || "").trim() || "Spelare";
  const updatedScores = saveScore({ name, score: pendingScore });
  renderScoreboard(updatedScores);

  nameModal.style.display = "none"; // stäng name-modal
});

//stäng name-modal utan att spara
nameCancelBtn.addEventListener("click", () => {
  nameModal.style.display = "none";
});


const initialScores = loadScores();
renderScoreboard(initialScores);

startBtn.addEventListener("click", () => {
  const players = Number(playerSelect.value);
  game.setPlayers(players);

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  game.start();

  updateHud(); // visar rätt kontroller + startar poängvisning direkt (Lektion 8)
});
