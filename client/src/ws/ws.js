export default async function wsConnect(dispatch) {
  let socket;
  async function connect(dispatch) {
    return new Promise((resolve, reject) => {
      const socketProtocol =
        window.location.protocol === "https:" ? "wss:" : "ws:";
      const port = 3000;
      const socketURL = `${socketProtocol}//${window.location.hostname}:${port}`;
      socket = new WebSocket(socketURL);

      /**
      let HOST = window.location.origin.replace(/^http/, "ws");
      let socket = new WebSocket(HOST);
      */

      //when we open the connection send in a bit of test data
      socket.onopen = (e) => {
        console.log("opening");
        socket.send(JSON.stringify({ loaded: true, text: "requestingID" }));
        //resolve the promise
        resolve();
      };

      socket.onmessage = (data) => {
        console.log(data);
        let parsedData = JSON.parse(data.data);

        //when the server starts we requested a id this is if we get one back
        if (parsedData.text === "sendingID" && parsedData.id !== undefined) {
          //if we get an id set our id to this
          console.log("got new id", parsedData.id);
          dispatch({
            type: "setPlayerID",
            data: { id: parsedData.id },
          });
        } else if (parsedData.text === "updatePlayers") {
          console.log(parsedData);
          //if the server is trying to update the players list then we will get that
          dispatch({
            type: "updatePlayers",
            data: parsedData.players,
          });
        }
      };
      socket.onclose = (data) => {};
      socket.onerror = (e) => {
        console.log(e);
        resolve();
        connect(dispatch);
      };
    });
  }
  const isOpen = function (ws) {
    return ws.readyState === ws.OPEN;
  };
  await connect(dispatch);
  console.log(socket);
  return socket;
}
