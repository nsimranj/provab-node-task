const app = require("./app");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

//handle http server errors
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    //permissions issue
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    //port in use issue
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//on listen handler
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.log("Listening on " + bind);
};

//port on which node server will run
//taken either from environment variable or defaults to 3000
const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

//create http server with express app
const server = http.createServer(app);
//listen events and assign handlers and start server by listening to port
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

