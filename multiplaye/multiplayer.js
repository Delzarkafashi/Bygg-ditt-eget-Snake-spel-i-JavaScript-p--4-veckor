import { MultiplayerApi } from "./MultiplayerApi.js";
import { Game } from "../core/Game.js";

// ⚠️ Lokalt test
const api = new MultiplayerApi("ws://localhost:8080/net");

// ===== DOM =====
const lobbyScreen = document.getElementById("lobby-screen");
const hostBtn = document.getElementById("host-btn");
const joinBtn = document.getElementById("join-btn");
const sessionInput = document.getElementById("session-input");
const statusText = document.getElementById("status-text");

const hostCodeBox = document.getElementById("host-code");
const codeText = document.getElementById("code-text");

const startMatchBtn = document.getElementById("start-match-btn");

const gameScreen = document.getElementById("mp-game-screen");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("mp-hint");
const leaveBtn = document.getElementById("leave-btn");

// ===== State =====
let role = "none"; // "host" | "client"
let myClientId = null;
let sessionId = null;
let hasPeer = false;
let game = null;

let helloTimer = null;

// ===== NEW: Modal state =====
let modalEl = null;
let lastWinner = null;
let lastScores = [0, 0];

// Multiplayer: hittar avsändaren även om servern stoppar id på olika ställen
function getSenderId(eventClientId, data) {
  return eventClientId || data?.clientId || data?.from || data?.senderId || null;
}

function setStatus(msg) {
  if (statusText) statusText.textContent = msg;
}

function setHint(msg) {
  if (hint) hint.textContent = msg;
}

function showLobby() {
  lobbyScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function showGame() {
  lobbyScreen.style.display = "none";
  gameScreen.style.display = "block";
}

// Multiplayer: host kan bara starta när någon annan faktiskt är ansluten
function updateStartButton() {
  if (!startMatchBtn) return;
  startMatchBtn.disabled = !(role === "host" && hasPeer);
}

function markPeerConnected() {
  if (hasPeer) return;
  hasPeer = true;
  updateStartButton();
}

function cleanupHelloPing() {
  if (helloTimer) clearInterval(helloTimer);
  helloTimer = null;
}

// Multiplayer: client skickar sin input (WASD) till host
function sendInput(dx, dy) {
  api.game({ kind: "input", dx, dy });
}

// ===== NEW: modal helpers =====
function closeModal() {
  if (modalEl) modalEl.remove();
  modalEl = null;
}

function openGameOverModal(winner, scores) {
  lastWinner = winner;
  lastScores = Array.isArray(scores) ? scores : lastScores;

  closeModal();

  modalEl = document.createElement("div");
  modalEl.className = "mp-modal";
  modalEl.innerHTML = `
    <div class="mp-modal-box">
      <h2>GAME OVER</h2>
      <div><strong>${winner === 0 ? "Oavgjort" : `Spelare ${winner} vann`}</strong></div>
      <div style="margin-top:12px;">
        <div>Poäng</div>
        <div>Spelare 1: ${lastScores[0] ?? 0}</div>
        <div>Spelare 2: ${lastScores[1] ?? 0}</div>
      </div>
      <div class="mp-modal-actions">
        <button id="mp-again-btn">Spela igen</button>
        <button id="mp-exit-btn">Avsluta</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Spela igen: host broadcastar restart, client väntar på restart-event
  document.getElementById("mp-again-btn").onclick = () => {
    closeModal();
    if (role === "host") {
      api.game({ kind: "control", action: "restart" });
      restartMatchLocal();
    } else {
      setStatus("Väntar på host (restart)...");
    }
  };

  // Avsluta: tillbaka till lobby (utan reload)
  document.getElementById("mp-exit-btn").onclick = () => {
    closeModal();
    stopMatchAndReset();
  };
}

function restartMatchLocal() {
  // stoppa gammalt spel + starta nytt
  if (game) {
    game.stop?.();
    game = null;
  }
  window.onkeydown = null;
  startMatch();
}

// ===== Match =====
function startMatch() {
  showGame();

  // om något redan kör: stoppa först
  if (game) {
    game.stop?.();
    game = null;
  }

  game = new Game(ctx);
  game.setPlayers(2);

  // GAME OVER – GEMENSAM (nu öppnar vi modal)
  game.onGameOver = (score, winner) => {
    // Host skickar gameOver till alla (med scores)
    if (role === "host") {
      api.game({ kind: "control", action: "gameOver", winner, scores: [...game.scores] });
    }

    // Visa popup lokalt
    openGameOverModal(winner, [...game.scores]);
  };

  if (role === "host") {
    game.setNetMode("host");
    setHint("Du är HOST. Spelare 1 = pilar, Spelare 2 = clientens WASD.");

    // host skickar state varje tick
    game.onState = (state) => {
      api.game({ kind: "state", state });
    };
  } else {
    game.setNetMode("client");
    setHint("Du är CLIENT. WASD skickas till host.");

    // client input
    window.onkeydown = (e) => {
      if (role !== "client") return;

      if (e.key === "w" || e.key === "W") sendInput(0, -1);
      if (e.key === "s" || e.key === "S") sendInput(0, 1);
      if (e.key === "a" || e.key === "A") sendInput(-1, 0);
      if (e.key === "d" || e.key === "D") sendInput(1, 0);
    };
  }

  game.start();
}

function stopMatchAndReset() {
  cleanupHelloPing();
  closeModal();

  window.onkeydown = null;

  if (game) {
    game.stop?.();
    game = null;
  }

  role = "none";
  myClientId = null;
  sessionId = null;
  hasPeer = false;

  if (hostCodeBox) hostCodeBox.style.display = "none";
  if (codeText) codeText.textContent = "";

  setHint("");
  setStatus('Välj “Hosta” eller “Joina”.');

  updateStartButton();
  showLobby();
}

// ===== Listen =====
api.listen((event, _messageId, eventClientId, data) => {
  if (!event) return;

  const senderId = getSenderId(eventClientId, data);

  if (event === "joined") {
    if (role === "host" && senderId && senderId !== myClientId) {
      markPeerConnected();
      setStatus("Någon har joinat! Du kan starta matchen.");
    }

    if (role === "client") {
      setStatus("Ansluten! Kontaktar host...");
    }

    return;
  }

  if (event === "game" && data) {
    // HELLO handshake
    if (data.kind === "control" && data.action === "hello") {
      if (role === "host") {
        if (senderId && senderId !== myClientId) markPeerConnected();
        setStatus("Client ansluten! Du kan starta matchen.");
        api.game({ kind: "control", action: "helloAck" });
      }
      return;
    }

    if (data.kind === "control" && data.action === "helloAck") {
      if (role === "client") {
        cleanupHelloPing();
        setStatus("Ansluten! Väntar på att host startar matchen...");
      }
      return;
    }

    // INPUT → host
    if (data.kind === "input" && role === "host" && game) {
      game.setPlayerDirection(1, data.dx, data.dy);
      return;
    }

    // START (båda startar)
    if (data.kind === "control" && data.action === "start") {
      if (!game) startMatch();
      return;
    }

    // STATE → client
    if (data.kind === "state" && data.state) {
      if (role === "client" && game) {
        game.applyState(data.state);
      }
      return;
    }

    // NEW: GAME OVER → ALLA (client får modal från host)
    if (data.kind === "control" && data.action === "gameOver") {
      if (game) game.stop?.();
      openGameOverModal(data.winner, data.scores);
      return;
    }

    // NEW: RESTART → ALLA (host skickar, client startar ny)
    if (data.kind === "control" && data.action === "restart") {
      closeModal();
      restartMatchLocal();
      return;
    }
  }

  if (event === "error") {
    const msg = data?.message || "okänt fel";
    setStatus("Fel: " + msg);
    console.log("[MP error]", data);
  }
});

// ===== UI actions =====
hostBtn.onclick = async () => {
  try {
    cleanupHelloPing();
    closeModal();

    role = "host";
    hasPeer = false;
    updateStartButton();

    setStatus("Hostar...");

    const res = await api.host();
    sessionId = res.session;
    myClientId = res.clientId;

    if (hostCodeBox) hostCodeBox.style.display = "block";
    if (codeText) codeText.textContent = sessionId;

    setStatus("Hostad! Dela koden och vänta på join...");
  } catch (err) {
    setStatus("Fel vid host.");
    console.error("HOST ERROR:", err);
  }
};

joinBtn.onclick = async () => {
  try {
    cleanupHelloPing();
    closeModal();

    role = "client";
    hasPeer = false;
    updateStartButton();

    const code = (sessionInput?.value || "").trim().toUpperCase();
    if (!code) {
      setStatus("Skriv en kod först.");
      return;
    }

    setStatus("Joinar...");

    const res = await api.join(code);
    sessionId = res.session;
    myClientId = res.clientId;

    setStatus("Ansluten! Kontaktar host...");

    helloTimer = setInterval(() => {
      api.game({ kind: "control", action: "hello" });
    }, 400);
  } catch (err) {
    setStatus("Fel vid join.");
    console.error("JOIN ERROR:", err);
  }
};

startMatchBtn.onclick = () => {
  if (role !== "host") return;

  if (!hasPeer) {
    setStatus("Väntar på att någon joinar...");
    return;
  }

  closeModal();
  api.game({ kind: "control", action: "start" });

  if (!game) startMatch();
};

leaveBtn.onclick = () => {
  stopMatchAndReset();
};

updateStartButton();
showLobby();
