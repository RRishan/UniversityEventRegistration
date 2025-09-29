const {bcrypt,jwt,transporter} = require('./modules.js');

// Replacing save() with mock implementation
// so that calling `save()` doesn’t hit the real database.
const mockSave = (model, id = '123') => {
  jest.spyOn(model.prototype, 'save').mockImplementation(function () {
    this._id = id;
    return Promise.resolve(this);
  });
};

// Mock the `findOne()` method of a Mongoose model
const mockFindOne = (model, returnValue = null) => {
  jest.spyOn(model, 'findOne').mockResolvedValue(returnValue);
};

// Mock the `find()` method of a Mongoose model
const mockFind = (model, returnValue = []) => {
  jest.spyOn(model, 'find').mockResolvedValue(returnValue);
};

// Mock bcrypt.hash() to always return a fixed hash string
const mockBcryptHash = (hash = 'hashedPass123') => {
  jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash);
};

// Mock jwt.sign() to always return a fake token
const mockJWT = (token = 'fakeToken123') => {
  jest.spyOn(jwt, 'sign').mockReturnValue(token);
};

// Mock sending email via transporter.sendMail()
const mockSendMail = (resolveValue = true) => {
  jest.spyOn(transporter, 'sendMail').mockResolvedValue(resolveValue);
};

// Export all mocks so they can be reused in multiple test files
module.exports = {
  mockSave,
  mockFindOne,
  mockFind,
  mockBcryptHash,
  mockJWT,
  mockSendMail,
};
