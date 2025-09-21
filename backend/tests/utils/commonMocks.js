const {bcrypt,jwt,transporter} = require('./modules.js');

const mockSave = (model, id = '123') => {
  jest.spyOn(model.prototype, 'save').mockImplementation(function () {
    this._id = id;
    return Promise.resolve(this);
  });
};

const mockFindOne = (model, returnValue = null) => {
  jest.spyOn(model, 'findOne').mockResolvedValue(returnValue);
};

const mockFind = (model, returnValue = []) => {
  jest.spyOn(model, 'find').mockResolvedValue(returnValue);
};

const mockBcryptHash = (hash = 'hashedPass123') => {
  jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash);
};

const mockJWT = (token = 'fakeToken123') => {
  jest.spyOn(jwt, 'sign').mockReturnValue(token);
};

const mockSendMail = (resolveValue = true) => {
  jest.spyOn(transporter, 'sendMail').mockResolvedValue(resolveValue);
};

module.exports = {
  mockSave,
  mockFindOne,
  mockFind,
  mockBcryptHash,
  mockJWT,
  mockSendMail,
};
