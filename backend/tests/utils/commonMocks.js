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
