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

interface User {
    id: string
    username: string,
}
interface Message {
    message: string,
    sender: User,
    time: string
}

const users: User[] = []

const findUserById = (id: string) => {
    return users.find(user => user.id === id)
}

io.on("connection", (socket) => {
    appDebug("Un utilisateur est connecté sur le serveur");

    socket.on("set_username", (username) => {
        appDebug(`L'utilisateur ${username} est connecté`)
        const newUser = { id: socket.id, username }
        users.push(newUser)
        users.sort((a, b) => a.username.localeCompare(b.username))
        io.emit("users_connected", users)
    })

    socket.on("send_message", (message) => {
        appDebug(`Un message est reçu : ${message}`)
        appDebug(`L'utilisateur est ${socket.id}`)
        const user = findUserById(socket.id)
        if (user) {
            io.emit("receive_message", {
                message,
                sender: user,
                time: new Date().toLocaleTimeString()
            } satisfies Message)
        }
    })

    socket.on("disconnect", () => {
        appDebug("Un utilisateur est déconnecté")
        const user = findUserById(socket.id)
        if (user) {
            users.splice(users.indexOf(user), 1)
            io.emit("users_connected", users)
        }
    })
})

server.listen(PORT, () => {
    appDebug(`Server is running on port http://localhost:${PORT}`);
});