import { createServer } from "node:http";
import { APP } from "./app.mjs";

const PORT = process.env.PORT || 3000
const server = createServer(APP);
server.listen(PORT)

server.on("listening", () => {
  console.log("Listing to http://localhost:"+PORT)
})

process.on("uncaughtException", (err) => {
  throw err
})