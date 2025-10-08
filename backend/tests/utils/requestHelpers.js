const request = require('supertest');
const { 
    mockSave, 
    mockFindOne, 
    mockThrowError 
} = require('./commonMocks.js'); // reuse existing mocks

// Change status code to 201 later
const testSuccessfulRegistration = async ({ app, endpoint, baseData, Model, successMessage }) => {
  // Setup mocks using commonMocks.js
  mockFindOne(Model, null);  // No existing record
  mockSave(Model);           // Save the record

  // Make POST request
  const response = await request(app).post(endpoint).send(baseData);

  // Assertions
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message', successMessage);

  // Ensure save was called
  expect(Model.prototype.save).toHaveBeenCalled();
};

const testDuplicateErrorResponse = async ({
  app,
  endpoint,
  payload,
  Model,
  existingRecord,
  expectedMessage,
  status = 400
}) => {
  // Setup mock to simulate duplicate or existing record
  mockFindOne(Model, existingRecord);

  // Make POST request
  const response = await request(app).post(endpoint).send(payload);

  // Assertions
  expect(response.statusCode).toBe(status);
  expect(response.body).toHaveProperty('message', expectedMessage);

  // Ensure save() was NOT called
  expect(Model.prototype.save).not.toHaveBeenCalled();
};

// Utility to test multiple invalid values for a specific field
const testFieldWithValues = (app, endpoint, baseData, field, values, expectedMessage) => {
  values.forEach(value => {
    it(`should return 400 when ${field} is "${value}"`, async () => {
      const payload = { ...baseData, [field]: value };
      const response = await request(app).post(endpoint).send(payload);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', expectedMessage);
    });
  });
};

// Utility function to test error responses from the model
const testErrorResponse = async ({
  app,
  endpoint,
  payload,
  Model,
  errorMessage,
  status = 400
}) => {
  // Make the model throw an error on findOne
  mockThrowError(Model, 'findOne', errorMessage);

  // Send POST request
  const response = await request(app).post(endpoint).send(payload);

  // Assertions
  expect(response.statusCode).toBe(status);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch(new RegExp(errorMessage));
};

module.exports = { 
    testSuccessfulRegistration,
    testDuplicateErrorResponse,
    testFieldWithValues,
    testErrorResponse,
};