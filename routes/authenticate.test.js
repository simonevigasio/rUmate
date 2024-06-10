const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');
const { User } = require('../models/user');

describe('authenticate APIs', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await User.findOneAndDelete({username: 'Sandro'});
    });

    afterAll(async () => {
        await User.findOneAndDelete({username: 'Sandro'});

        await mongoose.connection.close();
    });

    describe('POST /', () => {
        let username;
        let password;

        const exec = async () => {
            return await request(app)
                .post('/authenticate')
                .send({ username, password });
        };

        beforeEach(() => {
            username = 'Sandro';
            password = 'Fiore';
        });

        afterEach(async () => {
            await User.findOneAndDelete({username: 'Sandro'});
        });

        it('should return 400 if username is missing/not valid', async () => {
            username = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if password is missing/not valid', async () => {
            password = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if the username inserted is already being used', async () => {
            await new User({ username, password }).save();
            const res = await exec();
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already registered');
        });

        it('should return 200 and register the user if valid', async () => {
            const res = await exec();

            const user = await User.findOne({ username });
            expect(user).not.toBeNull();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', user.username);
        });
    });
});
