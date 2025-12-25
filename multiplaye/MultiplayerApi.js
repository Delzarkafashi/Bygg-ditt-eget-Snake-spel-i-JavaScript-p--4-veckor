export class MultiplayerApi {
  constructor(url = "ws://localhost:8080") {
    this.url = url;
    this.ws = null;

    this.session = null;
    this.clientId = null;
    this._handler = null;

    this._nextMessageId = 1;
  }

  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    this.ws.addEventListener("message", (e) => {
      let msg;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }

      // L10: stöd för olika server-format (event/type/action)
      const ev = msg.event || msg.type || msg.action;

      if (msg.session) this.session = msg.session;
      if (msg.clientId) this.clientId = msg.clientId;

      if (this._handler) {
        this._handler(ev, msg.messageId, msg.clientId, msg.data, msg.session);
      }
    });
  }

  listen(handler) {
    this._handler = handler;
    return () => {
      this._handler = null;
    };
  }

  async host() {
    await this.connect();

    // L10: skicka både action och type för kompatibilitet
    this.ws.send(JSON.stringify({ action: "host", type: "host" }));

    // L10: vänta på att session+clientId kommer (inte bara ett event-namn)
    await this._waitFor((m) => m.session && m.clientId);

    return { session: this.session, clientId: this.clientId };
  }

  async join(session) {
    await this.connect();

    // L10: trim + uppercase så join inte failar pga mellanslag
    const clean = String(session).trim().toUpperCase();
    this.ws.send(JSON.stringify({ action: "join", type: "join", session: clean }));

    await this._waitFor((m) => (m.event || m.type || m.action) === "joined" || (m.session && m.clientId));
    return { session: this.session, clientId: this.clientId };
  }

  game(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(
      JSON.stringify({
        action: "game",
        type: "game",
        session: this.session,
        messageId: this._nextMessageId++,
        data,
      })
    );
  }

  _waitFor(predicate, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Timeout waiting for server response"));
      }, timeoutMs);

      const onMessage = (e) => {
        let msg;
        try {
          msg = JSON.parse(e.data);
        } catch {
          return;
        }
        if (predicate(msg)) {
          cleanup();
          resolve(msg);
        }
      };

      const cleanup = () => {
        clearTimeout(timer);
        this.ws.removeEventListener("message", onMessage);
      };

      this.ws.addEventListener("message", onMessage);
    });
  }
}
