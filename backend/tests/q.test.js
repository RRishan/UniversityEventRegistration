const request = require('supertest'); 
const app = require('../app.js');

// Reusable mocks
const { 
  mockSave,
  mockFindOne,
  mockFind,
  mockBcryptHash,
  mockJWT,
  mockSendMail,
} = require('./utils/commonMocks.js');

// Modules for assertions
const { User, bcrypt, jwt, transporter } = require('./utils/modules.js');

// Reusable test data
const { newUser } = require('./data/testUsers.js');

// Mock external modules
jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/nodemailer.js');

describe('POST /api/auth/register', () => {

  // Prepare mocks before each test
  beforeEach(() => {
    mockFindOne(User,null);     // user does not exist
    mockBcryptHash();           // hash password
    mockSave(User);                 // save user
    mockJWT();                  // generate token
    mockSendMail();             // send email
  });

  it('should register a new user if email does not exist', async () => {
    const response = await request(app)
                            .post('/api/auth/register')
                            .send(newUser);

    // Response assertions
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Succsfully Registered');

    expect(User.findOne).toHaveBeenCalledWith({ email: newUser.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
    expect(User.prototype.save).toHaveBeenCalled();

    // Email assertions
    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: newUser.email,
        subject: expect.stringContaining('Registration Successful'),
        html: expect.stringContaining(newUser.name)
      })
    );

    // JWT assertions
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: '123' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

});
