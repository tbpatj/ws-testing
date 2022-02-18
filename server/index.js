"use strict";
const http = require("http");
const path = require("path");
const express = require("express");
const WSServer = require("ws").Server;
const { Server } = require("ws");
const { connected } = require("process");

let wss;
let server;
let incrementID = 0;
let players = {};
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(path.join(__dirname, "./../client/build")));

server = new http.createServer(app);
wss = new WSServer({ server });

this.wss = wss;
wss.on("connection", function (socket) {
  let id = -1;
  console.log(
    new Date().toTimeString(),
    `client connected to server (${wss.clients.size} total)`
  );
  socket.on("message", (data) => {
    let parsedData = JSON.parse(data.toString());
    if (parsedData.text === "requestingID") {
      socket.send(JSON.stringify({ text: "sendingID", id: incrementID }));
      id = incrementID;
      incrementID++;
    } else if (parsedData.text === "updatingMyPlay") {
      console.log(parsedData);
      players[parsedData.id] = { x: parsedData.x, y: parsedData.y };
      incrementID++;
    }
  });
  socket.on("close", (code, desc) => {
    console.log("client disconnected");
  });
});

wss.on("listening", () => console.log("websocket listening on port", PORT));

server.on("error", (err) => console.log("Server Err:", err));
server.listen(PORT, () => console.log("server started on", PORT));

// this.wss = wss;

// const PORT = process.env.PORT || 3000;
// const SOCKET_PORT = parseInt(process.env.PORT) + 1 || 3001;
// const INDEX = "/index.html";

// const server = express();
// server.use(express.static(path.join(__dirname, "/../client/build")));

// //server static files from the React App
// server.listen(PORT, () => console.log(`Listening on ${PORT}`));
// //
// // server.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname + "/../client/build/index.html"));
// // });

// //variables
// let incrementID = 0;
// let players = {};

// const wss = new Server({ port: SOCKET_PORT });
// console.log("socket port on", SOCKET_PORT);

// wss.on("connection", (ws) => {
//   let id = -1;
//   console.log("Client connected");

//   ws.on("message", (msg) => {
//     //parse data from a buffer to a string to a json object
//     let data = JSON.parse(msg.toString());

//     if (data.text === "requestingID") {
//       ws.send(JSON.stringify({ text: "sendingID", id: incrementID }));
//       id = incrementID;
//       incrementID++;
//     } else if (data.text === "updatingMyPlay") {
//       console.log(data);
//       players[data.id] = { x: data.x, y: data.y };
//       incrementID++;
//     }
//   });
//   ws.on("close", () => {
//     delete players[id];
//     console.log(`Client ${id} disconnected`);
//   });
// });
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
