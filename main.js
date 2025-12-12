import { Game } from "./core/Game.js";
import { renderScoreboard, loadScores, saveScore } from "./scoreboard/Scoreboard.js";

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const playerSelect = document.getElementById("player-select");

const gameOverScreen = document.getElementById("gameover-screen"); // game-over overlay
const gameOverResult = document.getElementById("gameover-result"); // text för resultat i overlay
const restartBtn = document.getElementById("restart-btn");         // knapp för ny runda

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

game.onGameOver = (score) => {
  // visar game-over overlay + resultat (vinnare/oavgjort)
  if (gameOverScreen && gameOverResult && game.lastResult) {
    const w = game.lastResult.winner;
    if (w === 0) gameOverResult.textContent = "Oavgjort!";
    if (w === 1) gameOverResult.textContent = `Vinnare: Spelare 1 (Poäng: ${score})`;
    if (w === 2) gameOverResult.textContent = `Vinnare: Spelare 2 (Poäng: ${score})`;

    gameOverScreen.style.display = "grid";
  }

  const name = prompt("Skriv ditt namn:") || "Spelare";
  const updatedScores = saveScore({ name, score });
  renderScoreboard(updatedScores);
};

restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none"; // göm overlay när man startar om
  game.reset();                          // starta ny runda utan sidladdning
});

const initialScores = loadScores();
renderScoreboard(initialScores);

startBtn.addEventListener("click", () => {
  const players = Number(playerSelect.value);
  game.setPlayers(players);

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  game.start();
});
