import { MultiplayerApi } from "./MultiplayerApi.js";

export class MultiplayerManager {
  constructor(url = "ws://localhost:8080") {
    this.api = new MultiplayerApi(url);

    this.session = null;
    this.clientId = null;

    this.latestState = null; // L10: senaste state vi fått från host
    this.onState = null;     // L10: callback när nytt state kommer

    this._unsub = this.api.listen((event, messageId, clientId, data) => {
      if (!event) return;

      if (event === "game") {
        // L10: vi förväntar oss att host skickar HELA state (data = state)
        this.latestState = data;
        if (typeof this.onState === "function") this.onState(this.latestState);
      }
    });
  }

  async host() {
    const res = await this.api.host();
    this.session = res.session;
    this.clientId = res.clientId;
    return res;
  }

  async join(sessionId) {
    const res = await this.api.join(sessionId);
    this.session = res.session;
    this.clientId = res.clientId;
    return res;
  }

  sendState(state) {
    // L10: host använder denna för att skicka state varje tick
    this.api.game(state);
  }

  destroy() {
    if (this._unsub) this._unsub();
    this.latestState = null;
    this.onState = null;
  }
}
