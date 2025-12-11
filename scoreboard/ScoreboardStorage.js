const STORAGE_KEY = "snakeScores";

// läs poäng från localStorage
export function loadScores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
// spara en ny poäng och returnera sorterad lista
export function saveScore(entry) {
  const scores = loadScores();
  scores.push(entry);

  // sortera fallande på score
  scores.sort((a, b) => b.score - a.score);

  // behåll bara topp 5
  const topFive = scores.slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(topFive));
  return topFive;
}