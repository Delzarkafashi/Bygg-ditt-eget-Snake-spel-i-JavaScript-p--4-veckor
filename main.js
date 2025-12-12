import { Game } from "./core/Game.js";
import { renderScoreboard, loadScores, saveScore } from "./scoreboard/Scoreboard.js";

const startScreen = document.getElementById("start-screen"); // startvy
const gameScreen = document.getElementById("game-screen");   // spelvy
const startBtn = document.getElementById("start-btn");       // startknapp
const playerSelect = document.getElementById("player-select"); // val 1/2 spelare


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

game.onGameOver = (score) => {
  const resultEl = document.getElementById("result-text");

  if (resultEl && game.lastResult) {
    if (game.lastResult.winner === 0) resultEl.textContent = "Oavgjort!";
    if (game.lastResult.winner === 1) resultEl.textContent = "Vinnare: Spelare 1";
    if (game.lastResult.winner === 2) resultEl.textContent = "Vinnare: Spelare 2";
  }

  setTimeout(() => {
    const name = prompt("Skriv ditt namn:") || "Spelare";
    const updatedScores = saveScore({ name, score });
    renderScoreboard(updatedScores);
  }, 0);
};

const initialScores = loadScores();
renderScoreboard(initialScores);

startBtn.addEventListener("click", () => { // startar spelet på knapptryck
  const players = Number(playerSelect.value);
  game.setPlayers(players);

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  game.start();
});
