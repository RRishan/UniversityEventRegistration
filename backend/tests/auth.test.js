const request = require('supertest');
const app = require('../app.js');

describe('POST /api/auth/register', () => {
    // First test case: Missing Name
    it('should return an error if name is missing', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password123!'
            })

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Missing Name');
    });

    // Second test case: Missing Email
    it('should return an error if email is missing', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                password: 'Password123!'
            })
       
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Missing Email');
    });

    // Third Test Case: Invalid Email
    it('should return an error if email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'not-an-email',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid Email');
    });

    // Fourth Test Case: Missing Password
    it('should return an error if password is missing', async() => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Missing Password');
    })

    // Fifth Test Case: Weak Password
    it('should return an error if password is weak', async() => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: '123'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Please create Strong password');
    });
});

