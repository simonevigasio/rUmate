const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { User } = require('../models/user');
const { Notification } = require('../models/notification');
const bcrypt = require('bcrypt');

describe('notification APIs', () => {
    let senderId;
    let senderToken;
    let receiverId;
    let receiverToken;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen();

        await Notification.deleteMany({});
        await User.deleteMany({ $or: [{ username: 'Giulia' }, { username: 'Quentin' }] });

        const sender = new User({
            username: 'Giulia',
            password: await bcrypt.hash('Modenese', 10)
        });
        await sender.save();
        senderId = sender._id;

        const receiver = new User({
            username: 'Quentin',
            password: await bcrypt.hash('Meneghini', 10)
        });
        await receiver.save();
        receiverId = receiver._id;

        senderToken = jwt.sign({ _id: senderId }, process.env.SECRET_TOKEN);
        receiverToken = jwt.sign({ _id: receiverId }, process.env.SECRET_TOKEN);
    });

    afterAll(async () => {
        await Notification.deleteMany({});
        await User.deleteMany({ $or: [{ username: 'Giulia' }, { username: 'Quentin' }] });

        await server.close();
        await mongoose.connection.close();
    });

    describe('POST /', () => {
        test('should return 200, save the notification in the database and post it in the receiver noticeboard', async () => {
            const res = await request(app)
                .post('/notifications')
                .set('x-auth-token', senderToken)
                .send({
                    reciver_id: receiverId,
                    type: "Message",
                    content: "l'utente Giulia ti ha mandato una messaggio"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.sender_id).toBe(String(senderId));
            expect(res.body.reciver_id).toBe(String(receiverId));
            expect(res.body.content).toBe("l'utente Giulia ti ha mandato una messaggio");
        });

        test('should return 200, save the notification in the database and post it in the receiver noticeboard', async () => {
            const res = await request(app)
                .post('/notifications')
                .set('x-auth-token', senderToken)
                .send({
                    reciver_id: receiverId,
                    type: "Preference",
                    content: "l'utente Giulia ha aggiunto una preferenza a un tuo annuncio!"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.sender_id).toBe(String(senderId));
            expect(res.body.reciver_id).toBe(String(receiverId));
            expect(res.body.content).toBe("l'utente Giulia ha aggiunto una preferenza a un tuo annuncio!");
        });
    });

    describe('GET /', () => {
        test('should return 200 and get all notifications of the user', async () => {
            const res = await request(app)
                .get('/notifications')
                .set('x-auth-token', receiverToken);

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0].sender_id).toBe(String(senderId));
            expect(res.body[0].reciver_id).toBe(String(receiverId));
        });
    });
});
