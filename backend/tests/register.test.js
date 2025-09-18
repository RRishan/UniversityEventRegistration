const request = require('supertest');
const app = require('../app.js');

describe('User Registration', () => {
    describe('Validation Errors', () => {
        // Test Case 1: Missing Name
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Name');
        })

        // Test Case 2: Missing Email
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Email');
        })

        // Test Case 3: Invalid Email
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasamagmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid Email');
        })

        // Test Case 4: Missing Registration Number
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Registration Number');
        })

        // Test Case 5: Missing faculty Name
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing faculty Name');
        })

        // Test Case 6: Missing Contact Number
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Contact Number');
        })

        // Test Case 7: Invalid contact number
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "93712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid contact number');
        })

        // Test Case 8: Missing Department Name
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "StrongPassword123#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        email: "sarangasama@gmail.com",
                                    })
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Department Name');
        })

        // Test Case 9: Missing Password
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing Password');
        })

        // Test Case 10: Please create Strong password
        it('should', async() => {
            const response = await request(app)
                                    .post('/api/auth/register')
                                    .send({
                                        name: "Saranga Samarakoon",
                                        password: "u1s#",
                                        regiNumber: "fc115625",
                                        contactNum: "0712345678",
                                        faculty: "computing fac",
                                        department: "SE",
                                        email: "sarangasama@gmail.com",
                                    })

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Please create Strong password');
        })
    })
})