const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const authRoutes = require('./index');

process.env.JWT_SECRET = 'test_secret_key';

const app = express();
app.use(express.json());

const mockBitcoinClient = {
    getNewAddress: jest.fn().mockResolvedValue('test_btc_address'),
};
app.use('/api', authRoutes(mockBitcoinClient));

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/testAuthDatabase';
    await mongoose.connect(url);
});

afterEach(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /signup', () => {
    it('should create a new user and return a JWT', async () => {
        const newUser = {
            name: 'John Doe',
            email: 'john@test.com',
            password: 'bc123',
        };

        const response = await request(app).post('/api/signup').send(newUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('bitcoinAddress', 'test_btc_address');
        expect(mockBitcoinClient.getNewAddress).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
        const existingUser = new User({
            name: 'Jane Doe',
            email: 'jane@test.com',
            password: 'password',
            bitcoinAddress: 'abc',
        });
        await existingUser.save();

        const response = await request(app).post('/api/signup').send({
            name: 'Jane Doe',
            email: 'jane@test.com',
            password: 'password',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({error: 'User already exists!'});
    });
});

describe('POST /login', () => {
    it('should authenticate user and return a JWT', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@test.com',
            password: await bcrypt.hash('123456', 10),
            bitcoinAddress: 'bc123',
        });
        await user.save();

        const response = await request(app).post('/api/login').send({
            email: 'john@test.com',
            password: '123456',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('name', 'John Doe');
    });

    it('should return 400 if user does not exist', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'nonexistent@test.com',
            password: '123456',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({error: 'User does not exist!'});
    });

    it('should return 400 for incorrect password', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@test.com',
            password: await bcrypt.hash('correctpassword', 10),
            bitcoinAddress: 'bc123',
        });
        await user.save();

        const response = await request(app).post('/api/login').send({
            email: 'john@test.com',
            password: 'wrongpassword',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({error: 'Incorrect password!'});
    });
});
