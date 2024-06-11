const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const { Message } = require("../models/message");
const bcrypt = require('bcrypt');

describe('chat APIs', () => {
    let server;
    let senderId;
    let senderToken;
    let receiverId;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen();

        await User.deleteMany({ username: { $in: ['Stefano', 'Gabriel'] } });
        await Chat.deleteMany({
            $or: [
                { senderId: 'Stefano', receiverId: 'Gabriel' },
                { senderId: 'Gabriel', receiverId: 'Stefano' }
            ]
        });
        await Message.deleteMany({
            $or: [
                { senderId: 'Stefano', receiverId: 'Gabriel' },
                { senderId: 'Gabriel', receiverId: 'Stefano' }
            ]
        });

        const sender = new User({
            username: 'Stefano',
            password: await bcrypt.hash('Camposilvan', 10)
        });
        await sender.save();

        const receiver = new User({
            username: 'Gabriel',
            password: await bcrypt.hash('Fumagalli', 10)
        });
        await receiver.save();

        senderToken = jwt.sign({ _id: sender._id }, process.env.SECRET_TOKEN);
    });

    afterAll(async () => {
        await User.deleteMany({ username: { $in: ['Stefano', 'Gabriel'] } });
        await Chat.deleteMany({
            $or: [
                { senderId: 'Stefano', receiverId: 'Gabriel' },
                { senderId: 'Gabriel', receiverId: 'Stefano' }
            ]
        });
        await Message.deleteMany({
            $or: [
                { senderId: 'Stefano', receiverId: 'Gabriel' },
                { senderId: 'Gabriel', receiverId: 'Stefano' }
            ]
        });

        await server.close();
        await mongoose.connection.close();
    });

    describe('GET /:senderId/:receiverId', () => {
        test('should return 204 if there are no messages exchanged between the two inserted users yet', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';

            const res = await request(server)
                .get(`/chats/${senderId}/${receiverId}`)

            expect(res.status).toBe(204);
        });

        test('should return 200 and the messages exchanged between the two users', async () => {
            const chat = new Chat({
                senderId: 'Stefano',
                receiverId: 'Gabriel',
                messageList: [{ senderId: 'Stefano', content: 'Ciao Gabriel!' }]
            });
            await chat.save();

            const res = await request(server)
                .get(`/chats/${senderId}/${receiverId}`)

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ senderId: 'Stefano', content: 'Ciao Gabriel!' }]);

            await Chat.deleteMany({
                $or: [
                    { senderId: 'Stefano', receiverId: 'Gabriel' },
                    { senderId: 'Gabriel', receiverId: 'Stefano' }
                ]
            });
        });
    });

    describe('POST /:senderId/addChat/:receiverId', () => {
        test('should return 200 and create an empty chat between the two users if the inserted parameters are valid and the chat does not exist yet', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';

            const res = await request(server)
                .post(`/chats/${senderId}/addChat/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId });

            expect(res.status).toBe(200);
        });
    });

    describe('POST /:senderId/addMessage/:receiverId', () => {
        test('should return 200 and add the message containing the inserted content to the chat between the inserted users', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';
            const content = 'Messaggio di testing';

            const res = await request(server)
                .post(`/chats/${senderId}/addMessage/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId, content });

            expect(res.status).toBe(200);

            await Message.deleteMany({
                $or: [
                    { senderId: 'Stefano', receiverId: 'Gabriel' },
                    { senderId: 'Gabriel', receiverId: 'Stefano' }
                ]
            });
            await Chat.deleteMany({
                $or: [
                    { senderId: 'Stefano', receiverId: 'Gabriel' },
                    { senderId: 'Gabriel', receiverId: 'Stefano' }
                ]
            });
        });

        test('should return 400 if the message content has more than 500 characters', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';
            const content = 'Il mio tesoro? Se lo volete, ve lo lascerò prendere. Cercatelo! Ho messo tutto quel che ho in quel posto..." Con queste parole, Gol D. Roger, il Re dei Pirati, esalò l ultimo respiro sul patibolo, scatenando l Era della Pirateria. La sua vita terminò, ma il suo spirito infiammò i cuori di innumerevoli aspiranti pirati. Roger, con il suo sorriso sfidante, svelò al mondo l esistenza del One Piece, il leggendario tesoro nascosto a Raftel, ispirando una generazione di avventurieri a solcare i mari.';

            const res = await request(server)
                .post(`/chats/${senderId}/addMessage/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId, content });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /:senderId', () => {
        test('should return 200 and give all chats involving the inserted user', async () => {
            const chat = new Chat({
                senderId: 'Stefano',
                receiverId: 'Gabriel',
                messageList: [{ senderId: 'Stefano', content: 'Ciao Gabriel!' }]
            });
            await chat.save();
            senderId = 'Stefano';

            const res = await request(server)
                .get(`/chats/${senderId}`)

            expect(res.status).toBe(200);

            await Chat.deleteMany({
                $or: [
                    { senderId: 'Stefano'}, 
                    { receiverId: 'Stefano' }
                ]
            });
        });

        test('should return 204 if the user does not have any chat started yet', async () => {
            senderId = 'Goffredo';

            const res = await request(server)
                .get(`/chats/${senderId}`)

            expect(res.status).toBe(204);
        });
    });
});
