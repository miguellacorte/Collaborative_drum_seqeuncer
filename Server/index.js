const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// cors middleware
app.use(cors());

// express syntax for creating a server:
const server = http.createServer(app);

// setup frontend origin and specify methods that we are accepting
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// tell our server to start listening for some events
io.on("connection", (socket) => {
  // we log this just to check that the connection is working
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    // check we are reciving data:
    console.log(data);

    // emit all messages received back to the clients:
    socket.broadcast.emit("receive_message", data);
  });
});

// specify which port it is listening to
server.listen(5174, () => {
  console.log("SERVER IS RUNNING");
});
