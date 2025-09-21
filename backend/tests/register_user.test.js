const request = require('supertest');
const app = require('../app.js');

const userInput = {
    "name": "Saranga Samarakoon",
    "password": "User@789",
    "regiNumber": "FC115625",
    "contactNum": "0712345678",
    "faculty": "Computing",
    "department": "SE",
    "email": "sarangasama@gmail.com"
};

const invalidEmails = [
    'plainaddress',
    '@domain.com',
    'john@.com',
    'john@domain',
    'john@domain..com'
];

const invalidContactNums = [
    '1234567890',
    '0812345678',
    '071234567',
    '07123456789',
    '+94123456789',
    '+9471234567',
    '07123abcd8',
    '07 123 45678',
    '+94-712345678'
];

const weakPasswords = [
    'password',
    'Password',
    'Password123',
    'pass123!',
    'PASSWORD123!',
    'Pa1!',
    '12345678!'
];

describe('User Registration', () => {
    describe('Validation Errors', () => {

        // Test Case 1: Missing Name
        describe('given that name is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          name: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Name');
            });
        });

        // Test Case 2: Missing Email
        describe('given that email is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          email: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Email');
            });
        });

        // Test Case 3: Invalid Email
        describe('given that email is invalid', () => {
            test.each(invalidEmails)('should return error 400 with validation message, given that email is "%s"', async(invalidEmail) => {
                const response = await request(app)
                                       .post('/api/auth/register')
                                       .send({
                                          ...userInput,
                                          email: invalidEmail,
                                       });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Invalid Email');
            });
        });

        // Test Case 4: Missing Registration Number
        describe('given that registration number is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          regiNumber: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Registration Number');
            });
        });

        // Test Case 5: Missing faculty Name
        describe('given that faculty name is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          faculty: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing faculty Name');
            });
        });

        // Test Case 6: Missing Contact Number
        describe('given that contact number is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          contactNum: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Contact Number');
            });
        });

        // Test Case 7: Invalid contact number
        describe('given that contact number is invalid', () => {
            test.each(invalidContactNums)('should return error 400 with validation message, given that contact number is "%s"', async(invalidContactNum) => {
                const response = await request(app)
                                       .post('/api/auth/register')
                                       .send({
                                          ...userInput,
                                          contactNum: invalidContactNum,
                                       });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Invalid contact number');
            });
        });

        // Test Case 8: Missing Department Name
        describe('given that department name is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          department: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Department Name');
            });
        });

        // Test Case 9: Missing Password
        describe('given that password is missing', () => {
            it('should return error 400 with a validation message', async() => {
                const response = await request(app)
                                        .post('/api/auth/register')
                                        .send({
                                          ...userInput,
                                          password: "",
                                        });

                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Missing Password');
            });
        });

        // Test Case 10: Please create Strong password
        describe('given that password is weak', () => {
            test.each(weakPasswords)('should return error 400 with validation message, given that password is "%s"', async(weakPassword) => {
                const response = await request(app)
                                       .post('/api/auth/register')
                                       .send({
                                          ...userInput,
                                          password: weakPassword,
                                       });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message', 'Please create Strong password');
            });
        });
    });
});