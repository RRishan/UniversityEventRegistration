const request = require('supertest');
const app = require('../app.js');
const User = require('../models/User.js');

jest.mock('../models/User.js');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const bcrypt = require('bcrypt'); // To mock password hashing
const jwt = require('jsonwebtoken');

describe('User Registration', () => {
    describe('given all fields are valid', () => {
        it("should register a new user if email doesn't exist in the database", async() => {
            User.findOne.mockResolvedValue(null); // Pretend no user exists
            User.create.mockResolvedValue({
                _id: '123',
                name: 'Rudraharan Nivaethan',
                email: 'nivaethanrudra6@gmail.com',
                regiNumber: 'FC115565',
                contactNum: '0707145102',
                faculty: 'Computing',
                department: 'SE'
            }); // Fake created user
        })
    })
})