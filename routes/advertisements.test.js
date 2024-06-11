const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");
const bcrypt = require('bcrypt');
const moment = require('moment');

const sort = '';
const roomFilter = 'Double';
const roomFilter1 = 'Triple';
const sexFilter = 'Female';
const sexFilter1 = 'Male';
const residenceFilter = 'Povo';
const residenceFilter1 = 'Oltrecastello';

describe('advertisement APIs', () => {
    let advertisementId;
    let userId;
    let user2Id;
    let userToken;
    let userToken2;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen();

        await Advertisement.deleteMany({_id: advertisementId });
        await Advertisement.deleteMany({title: 'Nuovo annuncio esempio' });
        await User.deleteMany({ $or: [{ username: 'Esempio1' }, { username: 'Esempio2' }] });

        const user1 = new User({
            username: 'Esempio1',
            password: await bcrypt.hash('Povo', 10)
        });
        await user1.save();
        userId = user1._id;
        userToken = jwt.sign({ _id: userId }, process.env.SECRET_TOKEN);

        const user2 = new User({
            username: 'Esempio2',
            password: await bcrypt.hash('Povo', 10)
        });
        await user2.save();
        user2Id = user2._id;
        userToken2 = jwt.sign({ _id: user2Id }, process.env.SECRET_TOKEN);

        const newAdvertisement = new Advertisement({
            user_id: user1._id,
            title: 'Annuncio di testing',
            description: 'Casa di testing',
            price: '100',
            room: 'Double',
            flat_sex: 'Female',
            residence_zone: 'Povo',
            expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"),
            roommate: 5
        });
        const savedAdvertisement = await newAdvertisement.save();
        advertisementId = savedAdvertisement._id;
    });

    afterAll(async () => {
        await Advertisement.deleteMany({_id: advertisementId });
        await Advertisement.deleteMany({title: 'Nuovo annuncio esempio' });
        await User.deleteMany({ $or: [{ username: 'Esempio1' }, { username: 'Esempio2' }] });

        await server.close();
        await mongoose.connection.close();
    });

    describe('POST /', () => {
        test('should respond with 400 if at least one field was left empty', async () => {
            const res = await request(app)
                .post('/advertisements')
                .set('x-auth-token', userToken2)
                .send({ title: 'Nuovo annuncio esempio', description: 'Nuovo annuncio', price: '150', room: 'Single', flat_sex: 'Mixed', residence_zone: 'Meano' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Some fields are blank/incorrect');
        });

        test('should respond with 200, save the advertisement in the database and return it', async () => {
            const res = await request(app)
                .post('/advertisements')
                .set('x-auth-token', userToken2)
                .send({ title: 'Nuovo annuncio esempio', description: 'Nuovo annuncio', price: '150', room: 'Single', flat_sex: 'Mixed', residence_zone: 'Meano', expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"), roommate: 3 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toEqual('Nuovo annuncio esempio');
        });

        test('should respond with 400 if the user already has an advertisement', async () => {
            const res = await request(app)
                .post('/advertisements')
                .set('x-auth-token', userToken2)
                .send({ user_id: user2Id, title: 'Altro annuncio esempio', description: 'Altro annuncio', price: '150', room: 'Single', flat_sex: 'Mixed', residence_zone: 'Meano', expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"), roommate: 3 });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already has an advertisement published');
        });
    });

    describe('GET /:id', () => {
        test('should respond with 200 and with the advertisement whose id corresponds to the inserted one', async () => {
            const res = await request(app).get(`/advertisements/${advertisementId}`);
            expect(res.status).toBe(200);
            expect(res.body._id).toEqual(advertisementId.toString());
        });
    });

    describe('GET /my-ad', () => {
        test('should respond with 200 and the advertisement publicated by the inserted user', async () => {
            const res = await request(app)
                .get(`/advertisements/my-ad`)
                .set('x-auth-token', userToken)

            expect(res.status).toBe(200);
            expect(res.body.user_id).toEqual(userId.toString());
        });
    });

    describe('GET /', () => {
        test('should respond with 200 and a non-empty list of all the advertisements if there is at least one ad in the database and no filters are selected', async () => {
            const res = await request(app).get('/advertisements');
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('should respond with 200 and all ads matching the inserted filtering criteria when there is at least one ad in the database that does so', async () => {
            let url = `/advertisements?sort=${sort}`;
            url += `&roomFilter=${JSON.stringify(roomFilter)}`;
            url += `&sexFilter=${JSON.stringify(sexFilter)}`;
            url += `&residenceFilter=${JSON.stringify(residenceFilter)}`;
            const res = await request(app).get(url);
    
            expect(res.status).toBe(200);
    
            const insertedAd = res.body.find(ad => ad._id === advertisementId.toString());
            expect(insertedAd).toBeDefined();
        });

        test('should respond with 200 and an empty array when some filtering criteria are selected but there are no ads in the database matching them', async () => {
            let url = `/advertisements?sort=${sort}`;
            url += `&roomFilter=${JSON.stringify(roomFilter1)}`;
            url += `&sexFilter=${JSON.stringify(sexFilter1)}`;
            url += `&residenceFilter=${JSON.stringify(residenceFilter1)}`;
            const res = await request(app).get(url);
    
            expect(res.status).toBe(200);
    
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });
});
