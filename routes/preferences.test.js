const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");
const { Preference } = require("../models/preference");
const bcrypt = require('bcrypt');
const moment = require('moment');

describe('preference APIs', () => {
    let advertisement1Id;
    let advertisement2Id;
    let advertisement3Id;
    let advertisement4Id;
    let interestedUserId;
    let userToken;
    let user1Token;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen();

        await Preference.deleteMany({});
        await Advertisement.deleteMany({ $or: [{ title: 'Annuncio di testing #2' }, { title: 'Annuncio di testing #3' }, { title: 'Annuncio di testing #4' }, { title: 'Annuncio di testing #5' }] });
        await User.deleteMany({ $or: [{ username: 'Simone0' }, { username: 'Simone1' }, { username: 'Simone2' }, { username: 'Simone3' }, { username: 'Simone4' }] });

        const user1 = new User({
            username: 'Simone0',
            password: await bcrypt.hash('Vigasio', 10)
        });
        await user1.save();
        user1Token = jwt.sign({ _id: user1._id }, process.env.SECRET_TOKEN);

        const user2 = new User({
            username: 'Simone1',
            password: await bcrypt.hash('Vigasio', 10)
        });
        await user2.save();

        const user3 = new User({
            username: 'Simone2',
            password: await bcrypt.hash('Vigasio', 10)
        });
        await user3.save();

        const user4 = new User({
            username: 'Simone3',
            password: await bcrypt.hash('Vigasio', 10)
        });
        await user4.save();
        interestedUserId = user4._id;

        const user5 = new User({
            username: 'Simone4',
            password: await bcrypt.hash('Vigasio', 10)
        });
        await user5.save();

        const ad1 = new Advertisement({
            user_id: user1._id,
            title: 'Annuncio di testing #2',
            description: 'Casa di testing #2',
            price: 100,
            room: 'Single',
            flat_sex: 'Mixed',
            residence_zone: 'Meano',
            expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"),
            roommate: 4
        });
        await ad1.save();
        advertisement1Id = ad1._id;

        const ad2 = new Advertisement({
            user_id: user2._id,
            title: 'Annuncio di testing #3',
            description: 'Casa di testing #3',
            price: 100,
            room: 'Single',
            flat_sex: 'Mixed',
            residence_zone: 'Meano',
            expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"),
            roommate: 4
        });
        await ad2.save();
        advertisement2Id = ad2._id;

        const ad3 = new Advertisement({
            user_id: user3._id,
            title: 'Annuncio di testing #4',
            description: 'Casa di testing #4',
            price: 100,
            room: 'Single',
            flat_sex: 'Mixed',
            residence_zone: 'Meano',
            expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"),
            roommate: 4
        });
        await ad3.save();
        advertisement3Id = ad3._id;

        const ad4 = new Advertisement({
            user_id: user5._id,
            title: 'Annuncio di testing #5',
            description: 'Casa di testing #5',
            price: 100,
            room: 'Single',
            flat_sex: 'Mixed',
            residence_zone: 'Meano',
            expiry_date: moment(new Date(2024, 7, 23)).format("YYYY MM DD"),
            roommate: 4
        });
        await ad4.save();
        advertisement4Id = ad4._id;

        const newPreference1 = new Preference({
            advertisement_id: advertisement1Id,
            interested_user_id: interestedUserId
        });
        await newPreference1.save();

        const newPreference2 = new Preference({
            advertisement_id: advertisement2Id,
            interested_user_id: interestedUserId
        });
        await newPreference2.save();

        userToken = jwt.sign({ _id: interestedUserId }, process.env.SECRET_TOKEN);
    });

    afterAll(async () => {
        await Preference.deleteMany({});
        await Advertisement.deleteMany({ $or: [{ title: 'Annuncio di testing #2' }, { title: 'Annuncio di testing #3' }, { title: 'Annuncio di testing #4' }, { title: 'Annuncio di testing #5' }] });
        await User.deleteMany({ $or: [{ username: 'Simone0' }, { username: 'Simone1' }, { username: 'Simone2' }, { username: 'Simone3' }, { username: 'Simone4' }] });

        await server.close();
        await mongoose.connection.close();
    });
    
    describe('POST /', () => {
        test('should return 400 if a preference between the inserted user and the inserted advertisement already exists', async () => {
            const res = await request(server)
                .post(`/preferences`)
                .set('x-auth-token', userToken)
                .send({ advertisement_id: advertisement2Id, interested_user_id: interestedUserId });

            expect(res.body).toHaveProperty('message', 'The user has already signed the preference for this advertisement');
            expect(res.status).toBe(400);
        });

        test('should return 200 and create a preference between the inserted user and the inserted advertisement', async () => {
            const res = await request(server)
                .post(`/preferences`)
                .set('x-auth-token', userToken)
                .send({ advertisement_id: advertisement3Id, interested_user_id: interestedUserId });
            
            expect(res.status).toBe(200);
        });

        test('should return 400 if the inserted user already has three preferences', async () => {
            const res = await request(server)
                .post(`/preferences`)
                .set('x-auth-token', userToken)
                .send({ advertisement_id: advertisement4Id, interested_user_id: interestedUserId });

            expect(res.body).toHaveProperty('message', 'The user has already 3 preferences');
            expect(res.status).toBe(400);
        });
    });

    describe('GET /my-prefs', () => {
        test('should return 200 and get all preferences of the user', async () => {
            const res = await request(app)
                .get('/preferences/my-prefs')
                .set('x-auth-token', userToken);

            expect(res.status).toBe(200);
        });
    });
    
    describe('GET /my-adv', () => {
        test('should return 200 and get all the people interested in the advertisement published by the user', async () => {
            const res = await request(app)
                .get('/preferences/my-adv')
                .set('x-auth-token', user1Token);

            expect(res.status).toBe(200);
        });
    });
});
