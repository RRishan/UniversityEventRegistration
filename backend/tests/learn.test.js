const request = require('supertest'); // Supertest allows making HTTP requests to our Express app without actually starting the server.
const app = require('../app');

// Model and helpers to mock
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');

// Imported to check if its content is used
const welcomeRegi = require('../public/mail-template/welcome-regi.js');

// Mocking the Extrenal World (To avoid interfering with production environment)
jest.mock('../models/User.js'); // To avoid connecting to a real database.
jest.mock('bcryptjs'); // To avoid hashing passwords with real CPU-heavy bcrypt.
jest.mock('jsonwebtoken'); // To avoid creating real JWT
jest.mock('../config/nodemailer.js'); // To avoid sending actual mails

// Test Data: This is sample data we send to our endpoint during tests.
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
        User.findOne.mockResolvedValue(null); // Pretend user doesn't exist
        bcrypt.hash.mockResolvedValue('hashedPass123'); // Fake hashed password
        transporter.sendMail.mockResolvedValue(true); // Pretend the email really got sent.

        // Replacing the real save() method on User model with mock implementation
        User.prototype.save = jest.fn().mockImplementation(function(){
            this._id = '123';       // Pretend MongoDB gave an ID after saving in database
            return Promise.resolve(this); 
        });

        jwt.sign.mockReturnValue('fakeToken123'); //Pretend JWT signs a token.

        // Make HTTP Request
        const response = await request(app)
                               .post('/api/auth/register')
                               .send(userData);

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Succsfully Registered');
        expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
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
});