import { createServer } from "node:http";
import { app } from "./app.mjs";

const PORT = process.env.PORT || 3000
const server = createServer(app);
server.listen(PORT)

server.on("listening", () => {
  console.log("Listing to http://localhost:"+PORT)
})

process.on("uncaughtException", (err) => {
  throw err
})