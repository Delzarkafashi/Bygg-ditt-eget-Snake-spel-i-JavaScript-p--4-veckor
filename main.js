import { Game } from "./core/Game.js";
import { renderScoreboard, loadScores, saveScore } from "./scoreboard/Scoreboard.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

game.setPlayers(2); // ändra till 1 om du vill köra singleplayer

game.onGameOver = (score) => {
  const resultEl = document.getElementById("result-text");

  if (resultEl && game.lastResult) {
    if (game.lastResult.winner === 0) resultEl.textContent = "Oavgjort!";
    if (game.lastResult.winner === 1) resultEl.textContent = "Vinnare: Spelare 1";
    if (game.lastResult.winner === 2) resultEl.textContent = "Vinnare: Spelare 2";
  }

  setTimeout(() => { // låt UI uppdateras innan prompt
    const name = prompt("Skriv ditt namn:") || "Spelare";
    const updatedScores = saveScore({ name, score });
    renderScoreboard(updatedScores);
  }, 0);
};



game.start();


// ladda scoreboard vid start
const initialScores = loadScores();
renderScoreboard(initialScores);




