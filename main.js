console.log("Spelet startar!");


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Test: rita en grön ruta
ctx.fillStyle = "green";
ctx.fillRect(100, 100, 200, 200);

// Test: spel-loop
setInterval(() => {
  console.log("tick");
}, 500);