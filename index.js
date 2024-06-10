const app = require('./routes/app');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
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
    console.log(`Server listening on port ${3000}...`);
});