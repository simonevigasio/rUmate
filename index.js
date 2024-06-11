require("dotenv").config();

const cors = require("cors");
const path = require('path');
const express = require('express');
const auth = require("./routes/authenticate");
const advertisements = require("./routes/advertisements");
const users = require("./routes/users");
const chats = require("./routes/chats");
const preferences = require("./routes/preferences");
const notifications = require("./routes/notifications");
const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database connected');
});

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/authenticate", auth);
app.use("/users", users);
app.use("/advertisements", advertisements);
app.use("/preferences", preferences);
app.use("/chats", chats);
app.use("/notifications", notifications);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend", "index.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ user1, user2 }) => {
        const room = [user1, user2].sort().join("_");
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("sendMessage", (message) => {
        const room = [message.senderId, message.receiverId].sort().join("_");
        io.to(room).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
