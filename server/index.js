"use strict";
const path = require("path");
const express = require("express");
const { Server } = require("ws");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express();
//server static files from the React App
server.use(express.static(path.join(__dirname, "../client/build")));

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../client/build/index.html"));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
