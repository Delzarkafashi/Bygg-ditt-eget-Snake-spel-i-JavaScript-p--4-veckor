import { MultiplayerApi } from "../multiplaye/MultiplayerApi.js";


const api = new MultiplayerApi("ws://localhost:8080");

const hostBtn = document.getElementById("host-btn");
const joinBtn = document.getElementById("join-btn");
const sessionInput = document.getElementById("session-id");

const unsub = api.listen((event, messageId, clientId, data) => {
  console.log("EVENT:", event, messageId, clientId, data);
});

hostBtn.onclick = async () => {
  try {
    const res = await api.host();
    console.log("HOST:", res.session);
    sessionInput.value = res.session;
  } catch (err) {
    console.error("HOST ERROR:", err.message);
  }
};

joinBtn.onclick = async () => {
  try {
    const res = await api.join(sessionInput.value);
    console.log("JOIN:", res.session);
  } catch (err) {
    console.error("JOIN ERROR:", err.message);
  }
};

const sendBtn = document.getElementById("send-btn");

sendBtn.onclick = () => {
  api.game({ test: Date.now() }); // skickar ett test-meddelande till rummet
};
