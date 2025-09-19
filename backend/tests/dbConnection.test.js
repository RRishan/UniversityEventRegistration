require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/DBconnection");

describe("MongoDB Connection", () => {
  it("should connect to MongoDB successfully", async () => {
    await expect(connectDB()).resolves.toBeUndefined();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
