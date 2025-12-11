import { Game } from "./core/Game.js";
import {
  renderScoreboard,
  loadScores,
  saveScore,} from "./scoreboard/Scoreboard.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

// callback när spelet är game over
game.onGameOver = (score) => {
  const name = prompt("Skriv ditt namn:") || "Spelare";
  const updatedScores = saveScore({ name, score });
  renderScoreboard(updatedScores);
};

game.start();

// ladda och visa scoreboard vid start
const initialScores = loadScores();
renderScoreboard(initialScores);
