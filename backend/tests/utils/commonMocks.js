const { bcrypt, jwt, transporter } = require('./modules.js');

// Mock save() on any Mongoose model instance
const mockSave = (model, id = '123') => {
  jest.spyOn(model.prototype, 'save').mockImplementation(function () {
    this._id = id;
    return Promise.resolve(this);
  });
};

// Mock findOne() on any Mongoose model
const mockFindOne = (model, returnValue = null) => {
  jest.spyOn(model, 'findOne').mockResolvedValue(returnValue);
};

// Mock deleteOne() on any Mongoose model
const mockDeleteOne = (model, returnValue = { deletedCount: 1 }) => {
  jest.spyOn(model, 'deleteOne').mockResolvedValue(returnValue);
};

// Mock find()
const mockFind = (model, returnValue = []) => {
  jest.spyOn(model, 'find').mockResolvedValue(returnValue);
};

// Mock bcrypt.hash()
const mockBcryptHash = (hash = 'hashedPass123') => {
  jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash);
};

// Mock jwt.sign()
const mockJWT = (token = 'fakeToken123') => {
  jest.spyOn(jwt, 'sign').mockReturnValue(token);
};

// Mock sending email via transporter.sendMail()
const mockSendMail = (resolveValue = true) => {
  jest.spyOn(transporter, 'sendMail').mockResolvedValue(resolveValue);
};

// Mock a method to throw an error
const mockThrowError = (model, method = 'findOne', message = 'Test Error') => {
  jest.spyOn(model, method).mockImplementation(() => { throw new Error(message); });
};

module.exports = {
  mockSave,
  mockFindOne,
  mockDeleteOne,
  mockFind,
  mockBcryptHash,
  mockJWT,
  mockSendMail,
  mockThrowError,
};
