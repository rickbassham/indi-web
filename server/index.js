const http = require('http');
const WebSocket = require('ws');
const static = require('node-static');
const enableGracefulShutdown = require('server-graceful-shutdown');

const { INDIClient, mapping, getProperties, enableBLOB } = require("indi-client");

const debug = process.env.DEBUG === "1";
const indiHost = process.env.INDI_HOST || "localhost";
const indiPort = process.env.INDI_PORT ? parseInt(process.env.INDI_PORT) : 7624;

const indiClient = new INDIClient(indiHost, indiPort);

const server = http.createServer();

const interfaceServer = new WebSocket.Server({ noServer: true });

var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};

// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
  console.log("shutdown!");

  interfaceServer.close();
  indiClient.close();

  server.shutdown(() => {
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  });
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});

const sendJSON = (msg) => {
  if (debug) {
    console.log('sending message to interface', msg);
  }

  interfaceServer.clients.forEach(c => {
    c.send(JSON.stringify(msg));
  });
};

interfaceServer.on("connection", (ws) => {
  if (indiClient.isConnected()) {
    sendJSON({
      type: "indi_client_connected",
    });
  }

  ws.on("message", (msg) => {
    // Every message we get from the client should be forwarded to INDI.
    const parsed = JSON.parse(msg);

    let cls = mapping[parsed.type];
    if (!cls) {
      switch (parsed.type) {
        case "getProperties":
          cls = getProperties;
          break;
        case "enableBLOB":
          cls = enableBLOB;
          break;
      }
    }

    if (debug) {
      console.log(parsed);
    }

    const obj = cls.fromJSON(parsed.payload);

    indiClient.send(obj);
  });
});

Object.keys(mapping).forEach(k => {
  indiClient.on(k, (msg) => {
    sendJSON({
      type: k,
      payload: msg,
    });
  });
});

indiClient.on("connect", () => {
  console.log("connected to indi server");
  sendJSON({
    type: "indi_client_connected",
  });
});

indiClient.on("close", () => {
  console.log("indiclient closed");
  sendJSON({
    type: "indi_client_closed",
  });
});

indiClient.on("error", (err) => {
  sendJSON({
    type: "indi_client_error",
    payload: err,
  });
});

indiClient.on("reconnect", () => {
  console.log("indiclient reconnecting");
  sendJSON({
    type: "indi_client_reconnecting",
  });
});

var file = new static.Server("./static");

server.addListener("request", (req, res) => {
  file.serve(req, res);
});

server.on("upgrade", (req, socket, head) => {
  console.log('upgrade started', req.url);

  interfaceServer.handleUpgrade(req, socket, head, (ws) => {
    interfaceServer.emit("connection", ws, req);
  });
});

indiClient.connect();

enableGracefulShutdown(server, 1000);

server.listen(8081);
