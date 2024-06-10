const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');
const { Advertisement } = require("../models/advertisement");

const sort = '';
const roomFilter = 'Single';
const sexFilter = 'Male';
const sexFilter1 = 'Female';
const residenceFilter = 'Povo';

describe('Advertisement APIs', () => {
    let advertisementId;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await Advertisement.deleteMany({});

        const newAdvertisement = new Advertisement({
            user_id: new mongoose.Types.ObjectId(),
            title: 'Test Advertisement',
            description: 'This is a test advertisement',
            price: 100,
            room: 'Single',
            flat_sex: 'Male',
            residence_zone: 'Povo',
            expiry_date: new Date().toISOString(),
            roommate: 3
        });

        const savedAdvertisement = await newAdvertisement.save();
        advertisementId = savedAdvertisement._id;
        userId = savedAdvertisement.user_id;
    });

    afterAll(async () => {
        await Advertisement.deleteMany({});
        await mongoose.connection.close();
    });

    test('GET /advertisements should respond with a non-empty list of advertisements if there is at least one ad in the database', async () => {
        const res = await request(app).get('/advertisements');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const insertedAd = res.body.find(ad => ad._id === advertisementId.toString());
        expect(insertedAd).toBeDefined();

        console.log("Inserted Advertisement TEST1:", insertedAd);
    });

    test('GET /advertisements/getById/:id should respond with a specific advertisement', async () => {
        const res = await request(app).get(`/advertisements/getById/${advertisementId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toEqual(advertisementId.toString());
    });

    test('GET /advertisements/getByUser/:userId should respond with the advertisement inserted by a specific user', async () => {
        const res = await request(app).get(`/advertisements/getByUser/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body.user_id).toEqual(userId.toString());
    });

    test('GET /advertisements should respond with all ads matching the inserted filtering criteria when there is atleast one ad in the database that does so', async () => {
        let url = `/advertisements?sort=${sort}`;
        url += `&roomFilter=${JSON.stringify(roomFilter)}`;
        url += `&sexFilter=${JSON.stringify(sexFilter)}`;
        url += `&residenceFilter=${JSON.stringify(residenceFilter)}`;
        const res = await request(app).get(url);

        expect(res.status).toBe(200);

        const insertedAd = res.body.find(ad => ad._id === advertisementId.toString());
        expect(insertedAd).toBeDefined();

        console.log("Inserted Advertisement TEST2:", insertedAd);
    });

    test('GET /advertisements should respond with an empty array when some filtering fields are selected but there are no ads in the database matching them', async () => {
        let url = `/advertisements?sort=${sort}`;
        url += `&roomFilter=${JSON.stringify(roomFilter)}`;
        url += `&sexFilter=${JSON.stringify(sexFilter1)}`;
        url += `&residenceFilter=${JSON.stringify(residenceFilter)}`;
        const res = await request(app).get(url);

        expect(res.status).toBe(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    test('GET /advertisements should respond with an empty array when there are no advertisements', async () => {
        await Advertisement.deleteMany({});

        const res = await request(app).get('/advertisements');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });
});
