const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

describe('user APIs', () => {
    let server;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        server = app.listen();

        await User.findOneAndDelete({username: 'Marco'});
    });

    afterAll(async () => {
        await User.findOneAndDelete({username: 'Marco'});

        await server.close();
        await mongoose.connection.close();
    });

    describe('POST /', () => {
        let username;
        let password;

        const exec = () => {
            return request(server)
                .post('/users')
                .send({ username, password });
        };

        beforeEach(async () => {
            const user = new User({
                username: 'Marco',
                password: await bcrypt.hash('Robol', 10)
            });
            await user.save();
        });

        afterEach(async () => {
            await User.findOneAndDelete({username: 'Marco'});
        });

        it('should return 400 if the username exists but the inserted password is not correct', async () => {
            username = 'Marco';
            password = 'Burattinol';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should return 400 if the username does not exist', async () => {
            username = 'Gianmarco';
            password = 'Robol';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should return 200 and let the user login if the inserted parameters are valid', async () => {
            username = 'Marco';
            password = 'Robol';

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

    describe('POST /logout', () => {
        it('should return 302 and redirect to /', async () => {
            const res = await request(server).post('/users/logout');

            expect(res.status).toBe(302);
            expect(res.header['location']).toBe('/');
        });
    });
});
