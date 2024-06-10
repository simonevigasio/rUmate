const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app     = require('./app');
const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const { Message } = require("../models/message");
const bcrypt = require('bcrypt');

describe('chat APIs', () => {
    let senderId;
    let senderToken;
    let receiverId;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen();

        await Message.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
        await Chat.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
        await User.deleteMany({ $or: [{ username: 'Stefano' }, { username: 'Gabriel' }] });

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
        await Message.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
        await Chat.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
        await User.deleteMany({ $or: [{ username: 'Stefano' }, { username: 'Gabriel' }] });

        await server.close();
        await mongoose.connection.close();
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

        test('should return 400 if a chat between the two inserted users already exists', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';

            const res = await request(server)
                .post(`/chats/${senderId}/addChat/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /:senderId/addMessage/:receiverId', () => {
        test('should return 200 and add the message containing the inserted content to the chat between the inserted users if it already exists', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';
            content = 'Messaggio di testing';

            const res = await request(server)
                .post(`/chats/${senderId}/addMessage/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId, content });

            expect(res.status).toBe(200);

            await Message.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
            await Chat.deleteMany({ $or: [{ senderId: 'Stefano', receiverId: 'Gabriel' }, { senderId: 'Gabriel', receiverId: 'Stefano' }] });
        });

        test('should return 200 and add the message containing the inserted content to the newly created chat between the inserted users', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';
            content = 'Messaggio di testing';

            const res = await request(server)
                .post(`/chats/${senderId}/addMessage/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId, content });

            expect(res.status).toBe(200);
        });

        test('should return 400 if the message content has more than 500 characters', async () => {
            senderId = 'Stefano';
            receiverId = 'Gabriel';
            content = 'Il mio tesoro? Se lo volete, ve lo lascerò prendere. Cercatelo! Ho messo tutto quel che ho in quel posto." Con queste parole, Gol D. Roger, il Re dei Pirati, esalò l ultimo respiro sul patibolo, scatenando l Era della Pirateria. La sua vita terminò, ma il suo spirito infiammò i cuori di innumerevoli aspiranti pirati. Roger, con il suo sorriso sfidante, svelò al mondo l esistenza del One Piece, il leggendario tesoro nascosto a Raftel, ispirando una generazione di avventurieri a solcare i mari.';

            const res = await request(server)
                .post(`/chats/${senderId}/addMessage/${receiverId}`)
                .set('x-auth-token', senderToken)
                .send({ senderId, receiverId, content });

            expect(res.status).toBe(400);
        });
    });
});