import { loadScores, saveScore } from "./ScoreboardStorage.js";

// rita scoreboard-listan i UI
export function renderScoreboard(scores) {
  const list = document.getElementById("scoreboard-list");
  if (!list) return;

  list.innerHTML = "";

  scores.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} – ${entry.score}`;
    list.appendChild(li);
  });
}

// exportera vidare så main.js kan använda samma import som innan
export { loadScores, saveScore };
