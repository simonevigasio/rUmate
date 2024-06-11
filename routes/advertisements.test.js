const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');
const { Advertisement } = require("../models/advertisement");

const sort = '';
const roomFilter = 'Double';
const roomFilter1 = 'Single';
const sexFilter = 'Female';
const sexFilter1 = 'Mixed';
const residenceFilter = 'Povo';
const residenceFilter1 = 'Meano';

describe('advertisement APIs', () => {
    let advertisementId;
    let userId;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const newAdvertisement = new Advertisement({
            user_id: new mongoose.Types.ObjectId(),
            title: 'Annuncio di testing',
            description: 'Casa di testing',
            price: 100,
            room: 'Double',
            flat_sex: 'Female',
            residence_zone: 'Povo',
            expiry_date: new Date(2024, 5, 23, 12, 0, 0).toISOString(),
            roommate: 5
        });

        const savedAdvertisement = await newAdvertisement.save();
        advertisementId = savedAdvertisement._id;
        userId = savedAdvertisement.user_id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /getById/:id', () => {
        test('should respond with 200 and the advertisement whose id corresponds to the inserted one', async () => {
            const res = await request(app).get(`/advertisements/getById/${advertisementId}`);
            expect(res.status).toBe(200);
            expect(res.body._id).toEqual(advertisementId.toString());

            console.log("Advertisement GET /getById/:id :", res.body.title);
        });
    });

    describe('GET /getByUser/:userId', () => {
        test('should respond with 200 and the advertisement publicated by the inserted user', async () => {
            const res = await request(app).get(`/advertisements/getByUser/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.user_id).toEqual(userId.toString());

            console.log("Advertisement GET /getByUser/:userId :", res.body.title);
        });
    });

    describe('GET /', () => {
        test('should respond with 200 and a non-empty list of all the advertisements if there is at least one ad in the database and no filters are selected', async () => {
            const res = await request(app).get('/advertisements');
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
    
            const insertedAd = res.body.find(ad => ad._id === advertisementId.toString());
            expect(insertedAd).toBeDefined();
    
            console.log("Inserted Advertisement GET / :", insertedAd);
        });

        test('should respond with 200 and all ads matching the inserted filtering criteria when there is atleast one ad in the database that does so', async () => {
            let url = `/advertisements?sort=${sort}`;
            url += `&roomFilter=${JSON.stringify(roomFilter)}`;
            url += `&sexFilter=${JSON.stringify(sexFilter)}`;
            url += `&residenceFilter=${JSON.stringify(residenceFilter)}`;
            const res = await request(app).get(url);
    
            expect(res.status).toBe(200);
    
            const insertedAd = res.body.find(ad => ad._id === advertisementId.toString());
            expect(insertedAd).toBeDefined();
    
            console.log("Inserted Advertisement GET /SomeRightfilters:", insertedAd);
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

            console.log("Inserted Advertisement GET /SomeWrongfilters:");
        });
    
        test('should respond with 200 and an empty array when there are no advertisements', async () => {
            await Advertisement.deleteMany({});
    
            const res = await request(app).get('/advertisements');
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });
});
