const request = require('supertest');
const app = require('../app'); // Your Express app
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');
const welcomeRegi = require('../public/mail-template/welcome-regi.js'); 

// Mock modules
jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/nodemailer.js');

const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'StrongPass123!',
    regiNumber: 'REG123',
    contactNum: '0712345678',
    faculty: 'Engineering',
    department: 'CS'
};

describe('POST /api/auth/register', () => {
    it('should register a new user if email does not exist', async () => {
        // Step 1: Mock database and helpers
        User.findOne.mockResolvedValue(null); // No existing user
        bcrypt.hash.mockResolvedValue('hashedPass123'); // Fake hashed password
        transporter.sendMail.mockResolvedValue(true); // Pretend email sent

        // Mock save() and set _id for jwt
        User.prototype.save = jest.fn().mockImplementation(function() {
            this._id = '123'; // Ensure _id exists
            return Promise.resolve(this);
        });

        jwt.sign.mockReturnValue('fakeToken123'); // Fake token

        // Step 2: Make request
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        // Step 3: Assertions
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Succsfully Registered');

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('StrongPass123!', 10);
        expect(User.prototype.save).toHaveBeenCalled();
        // Email content verification
        expect(transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: userData.email,
                subject: expect.stringContaining('Registration Successful'),
                html: expect.stringContaining(userData.name)
            })
        );
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: '123' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    });

    it('should return 400 if user already exists', async () => {
        User.findOne.mockResolvedValue({ _id: '123', email: 'john@example.com' });

        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already exists');

        expect(User.prototype.save).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(transporter.sendMail).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
    });

});
