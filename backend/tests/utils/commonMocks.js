
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
const { bcrypt, jwt, transporter } = require('./modules.js');

// Mock save() on any Mongoose model instance
const mockSave = (model, id = '123') => {
  if (model.prototype.save) {
    jest.spyOn(model.prototype, 'save').mockImplementation(function () {
      this._id = id;
      return Promise.resolve(this);
    });
  } else {
    model.prototype.save = jest.fn(function () {
      this._id = id;
      return Promise.resolve(this);
    });
  }
};

// Mock findOne() safely
const mockFindOne = (model, returnValue = null) => {
  if (model.findOne) {
    jest.spyOn(model, 'findOne').mockResolvedValue(returnValue);
  } else {
    model.findOne = jest.fn().mockResolvedValue(returnValue);
  }
};

// Mock find() safely
const mockFind = (model, returnValue = []) => {
  if (model.find) {
    jest.spyOn(model, 'find').mockResolvedValue(returnValue);
  } else {
    model.find = jest.fn().mockResolvedValue(returnValue);
  }
};

// Mock bcrypt.hash()
const mockBcryptHash = (hash = 'hashedPass123') => {
  if (bcrypt.hash) {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash);
  } else {
    bcrypt.hash = jest.fn().mockResolvedValue(hash);
  }
};

// Mock jwt.sign()
const mockJWT = (token = 'fakeToken123') => {
  if (jwt.sign) {
    jest.spyOn(jwt, 'sign').mockReturnValue(token);
  } else {
    jwt.sign = jest.fn().mockReturnValue(token);
  }
};

// Mock sending email safely
const mockSendMail = (resolveValue = true) => {
  if (transporter.sendMail) {
    jest.spyOn(transporter, 'sendMail').mockResolvedValue(resolveValue);
  } else {
    transporter.sendMail = jest.fn().mockResolvedValue(resolveValue);
  }
};

module.exports = {
  mockSave,
  mockFindOne,
  mockFind,
  mockBcryptHash,
  mockJWT,
  mockSendMail,
};
