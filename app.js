import { createServer } from "http";

createServer((req, res) => {
  res.write(`test`);
  // console.log("bonsoir");
  res.end();
}).listen("8888");
