const request = require('supertest');
const { 
    mockSave, 
    mockFindOne, 
    mockThrowError,
    mockDeleteOne, 
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

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  // Assertions
  expect(response.statusCode).toBe(status);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch(new RegExp(errorMessage));
};

// ---------- DELETE Helpers ----------
const testSuccessfulDeletion = async ({ app, endpoint, Model, eventId, successMessage }) => {
  mockDeleteOne(Model, { deletedCount: 1 });

  const response = await request(app).delete(endpoint).query({ eventId });

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(200); 
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message', successMessage);
  expect(Model.deleteOne).toHaveBeenCalledWith({ _id: eventId });
};

const testApiError = async ({
  app,
  method,
  endpoint,
  Model,
  methodToMock,
  errorMessage,
  query,
  body,
  status = 500,
}) => {
  // Mock model method to throw error
  mockThrowError(Model, methodToMock, errorMessage);

  // Start the request with the chosen HTTP method
  let httpRequest = request(app)[method](endpoint);

  if (query) {
    httpRequest = httpRequest.query(query);
  }
  
  if (body) {
    httpRequest = httpRequest.send(body);
  }

  const response = await httpRequest;

  // Save globally for afterEach logging if needed
  global.lastResponse = response;

  // Assertions
  expect(response.statusCode).toBe(status);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch(new RegExp(errorMessage));
};

const testDeleteNotFound = async ({ app, endpoint, Model, eventId, expectedMessage }) => {
  mockDeleteOne(Model, { deletedCount: 0 });

  const response = await request(app).delete(endpoint).query({ eventId });

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message', expectedMessage);
};

const testDeleteMissingId = async ({ app, endpoint }) => {
  const response = await request(app).delete(endpoint).query({});
  
  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message', 'Invalid Event');
};

module.exports = { 
    testSuccessfulRegistration,
    testDuplicateErrorResponse,
    testFieldWithValues,
    testErrorResponse,
    testSuccessfulDeletion,
    testApiError,
    testDeleteNotFound,
    testDeleteMissingId,
};