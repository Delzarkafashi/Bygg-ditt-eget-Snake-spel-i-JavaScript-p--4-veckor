// backend/server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
console.log("WS server running on ws://localhost:8080");

// sessionId -> { clients: Map(clientId -> ws) }
const sessions = new Map();

function makeSessionId() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}
function makeClientId() {
  return Math.random().toString(36).slice(2, 10);
}
function send(ws, obj) {
  ws.send(JSON.stringify(obj));
}

wss.on("connection", (ws) => {
  ws.clientId = makeClientId();
  ws.session = null;

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    // ---- HOST ----
    if (msg.action === "host") {
      const sessionId = makeSessionId();

      sessions.set(sessionId, { clients: new Map() });
      sessions.get(sessionId).clients.set(ws.clientId, ws);

      ws.session = sessionId;

      send(ws, { type: "hosted", session: sessionId, clientId: ws.clientId });
      send(ws, { type: "joined", session: sessionId, clientId: ws.clientId });
      return;
    }

    // ---- JOIN ----
    if (msg.action === "join") {
      const sessionId = String(msg.session || "").trim().toUpperCase();

      if (!sessions.has(sessionId)) {
        send(ws, { type: "error", message: "Session not found" });
        return;
      }

      sessions.get(sessionId).clients.set(ws.clientId, ws);
      ws.session = sessionId;

      send(ws, { type: "joined", session: sessionId, clientId: ws.clientId });
      return;
    }

    // ---- GAME (broadcast till andra i samma session) ----
    if (msg.action === "game") {
      const sessionId = ws.session;
      if (!sessionId || !sessions.has(sessionId)) return;

      const room = sessions.get(sessionId).clients;
      for (const [id, clientWs] of room.entries()) {
        if (clientWs.readyState !== 1) continue;
        if (id === ws.clientId) continue;

        send(clientWs, {
          type: "game",
          session: sessionId,
          clientId: ws.clientId,
          messageId: msg.messageId ?? null,
          data: msg.data ?? null,
        });
      }
      return;
    }
  });

  ws.on("close", () => {
    const sessionId = ws.session;
    if (!sessionId || !sessions.has(sessionId)) return;

    const room = sessions.get(sessionId).clients;
    room.delete(ws.clientId);

    if (room.size === 0) sessions.delete(sessionId);
  });
});
