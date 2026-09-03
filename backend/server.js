const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User room join karega
  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);

    console.log(`${socket.id} joined room: ${roomCode}`);

    socket.to(roomCode).emit("user-joined", {
      message: "A new user joined the room",
    });
  });

  // Message receive karke same room ke users ko bhejna
  socket.on("send-message", (data) => {
    io.to(data.roomCode).emit("receive-message", data);
  });

  // User disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("HMT Chat Server Running 🚀");
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});