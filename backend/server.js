import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render sätter PORT automatiskt. Lokalt kör vi 8080.
const PORT = process.env.PORT || 8080;

// ====== Enkel static server (frontend) ======
const rootDir = path.resolve(__dirname, ".."); // projektroten (där index.html ligger)

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = (req.url || "/").split("?")[0];

    // Default till index.html
    const requested = urlPath === "/" ? "/index.html" : urlPath;

    // Skydda mot ".."
    const filePath = path.join(rootDir, requested);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      return res.end("Not found");
    }

    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end("Server error");
  }
});

// ====== WebSocket på samma port ======
const wss = new WebSocketServer({ server });
console.log(`HTTP+WS server on http://0.0.0.0:${PORT}`);

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

    if (msg.action === "host") {
      const sessionId = makeSessionId();
      sessions.set(sessionId, { clients: new Map() });
      sessions.get(sessionId).clients.set(ws.clientId, ws);
      ws.session = sessionId;

      send(ws, { type: "hosted", session: sessionId, clientId: ws.clientId });
      send(ws, { type: "joined", session: sessionId, clientId: ws.clientId });
      return;
    }

    if (msg.action === "join") {
      const sessionId = String(msg.session || "").trim().toUpperCase();

      if (!sessions.has(sessionId)) {
        send(ws, { type: "error", message: "Session not found" });
        return;
      }

      sessions.get(sessionId).clients.set(ws.clientId, ws);
      ws.session = sessionId;

      // Skicka joined till den som joinar
      send(ws, { type: "joined", session: sessionId, clientId: ws.clientId });

      // (viktigt) informera även hosten att någon joinade
      for (const [id, clientWs] of sessions.get(sessionId).clients.entries()) {
        if (clientWs.readyState !== 1) continue;
        if (id === ws.clientId) continue;
        send(clientWs, { type: "joined", session: sessionId, clientId: ws.clientId });
      }
      return;
    }

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

server.listen(PORT, "0.0.0.0");
