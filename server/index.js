"use strict";
const path = require("path");
const express = require("express");
const { Server } = require("ws");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express();
server.use(express.static(path.join(__dirname, "/../client/build")));

//server static files from the React App
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
//
// server.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/../client/build/index.html"));
// });

//variables
let incrementID = 0;
let players = {};

const wss = new Server({ port: PORT + 1 });

wss.on("connection", (ws) => {
  let id = -1;
  console.log("Client connected");

  ws.on("message", (msg) => {
    //parse data from a buffer to a string to a json object
    let data = JSON.parse(msg.toString());

    if (data.text === "requestingID") {
      ws.send(JSON.stringify({ text: "sendingID", id: incrementID }));
      id = incrementID;
      incrementID++;
    } else if (data.text === "updatingMyPlay") {
      console.log(data);
      players[data.id] = { x: data.x, y: data.y };
      incrementID++;
    }
  });
  ws.on("close", () => {
    delete players[id];
    console.log(`Client ${id} disconnected`);
  });
});
/**
    let data = JSON.parse(msg);

    if (data.text === "requestingID") {
      rollbar.log("someone is requesting an id");
      ws.send(JSON.stringify({ text: "sendingID", id: incrementID }));
      id = incrementID;
      incrementID++;
    }
    if (data.text === "updatingMyPlay") {
      console.log(data);
      players[data.id] = { x: data.x, y: data.y };
      incrementID++;
    }
    */

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);
