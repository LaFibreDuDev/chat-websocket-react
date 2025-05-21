import express from "express";
import debug from "debug";
import cors from "cors";
import * as http from "node:http";
import {Server} from "socket.io";

const PORT = 3000;
const app = express();

app.use(cors())

const appDebug = debug("app:main")

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["*"]
    }
})

interface Message {
    message: string,
    sender: string,
    time: string
}

io.on("connection", (socket) => {
    appDebug("Un utilisateur est connecté sur le serveur");

    socket.on("send_message", (message) => {
        appDebug(`Un message est reçu : ${message}`)
        appDebug(`L'utilisateur est ${socket.id}`)
        io.emit("receive_message", {
            message,
            sender: "Inconnu",
            time: new Date().toLocaleTimeString()
        } satisfies Message)
    })
})

server.listen(PORT, () => {
    appDebug(`Server is running on port http://localhost:${PORT}`);
});