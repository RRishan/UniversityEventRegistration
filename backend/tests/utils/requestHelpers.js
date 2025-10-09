const request = require('supertest');
const { 
    mockSave, 
    mockFind,
    mockFindOne, 
    mockThrowError,
    mockDeleteOne, 
    mockFindById,
    mockReturn,
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
  expect(response.body.message).toBe(errorMessage);
};

// ---------- DELETE Helpers ----------
const testSuccessfulDeletion = async ({ app, endpoint, Model, eventId, successMessage }) => {
  mockDeleteOne(Model, { deletedCount: 1 });

  const response = await request(app).delete(endpoint).query({ eventId });

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(204); 
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message', successMessage);
  expect(Model.deleteOne).toHaveBeenCalledWith({ _id: eventId });
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

// ---------- Common Helpers ----------
// Utility function to test API errors for DELETE and GET requests
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
  expect(response.body.message).toBe(errorMessage);
};

// Utility function to test missing ID in any request (DELETE, GET, etc.)
const testMissingId = async ({ app, method, endpoint, idField = 'eventId', sendInBody = false }) => {
  let httpRequest = request(app)[method](endpoint);

  if (sendInBody) {
    httpRequest = httpRequest.send({}); // empty body, missing ID
  } else {
    httpRequest = httpRequest.query({}); // empty query, missing ID
  }

  const response = await httpRequest;

  // Assertions
  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch(/Invalid/i); // matches "Invalid Event" or similar

  // Store globally for logging in afterEach if needed
  global.lastResponse = response;
};

// Utility to test missing field
const missingFieldTest = ({ app, method, endpoint, baseData, field, expectedMessage }) => {
  return async () => {
    const payload = { ...baseData };
    delete payload[field];
    const response = await request(app)[method](endpoint).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', expectedMessage);
  };
};

// Utility to test a single invalid field value
const invalidFieldTest = ({ app, method, endpoint, baseData, field, value, expectedMessage }) => {
  return async () => {
    const payload = { ...baseData, [field]: value };
    const response = await request(app)[method](endpoint).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', expectedMessage);
  };
};

// Utility to test multiple invalid values for a specific field
const testFieldWithValues = (app, endpoint, baseData, field, values, expectedMessage) => {
  for (const value of values) {
    it(`should return 400 when ${field} is "${value}"`, async () => {
      const payload = { ...baseData, [field]: value };
      const response = await request(app).post(endpoint).send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', expectedMessage);
    });
  }
};

// ---------- GET Helpers ----------
const testGetEventNotFound = async ({ app, endpoint, Model, eventId, expectedMessage }) => {
  mockFindById(Model, null);

  const response = await request(app).get(endpoint).query({ eventId });

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message', expectedMessage);
};

const testSuccessfulFetch = async ({ app, endpoint, Model, eventId, mockReturn, expectedMessage }) => {
  // Mock findById to return the document
  mockFindById(Model, mockReturn);

  const response = await request(app).get(endpoint).query({ eventId });

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message', expectedMessage);
};

const testSuccessfulFetchAll = async ({ app, endpoint, Model, mockReturn, expectedMessage, query }) => { 
  // Use commonMocks to mock Model.find
  mockFind(Model, mockReturn);

  const response = await request(app).get(endpoint);

  // Store globally for afterEach hook to log if needed
  global.lastResponse = response;

  // Validate that find was called with the correct query
  expect(Model.find).toHaveBeenCalledWith(query || {});

  // Validate response
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message', expectedMessage);
};

module.exports = { 
    testSuccessfulRegistration,
    testDuplicateErrorResponse,
    testErrorResponse,
    testSuccessfulDeletion,
    testApiError,
    testFieldWithValues,
    testDeleteNotFound,
    testMissingId,
    missingFieldTest,
    invalidFieldTest,
    testGetEventNotFound,
    testSuccessfulFetch,
    testSuccessfulFetchAll,
};