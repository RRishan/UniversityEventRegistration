const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');
const app = require('../app');

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  name: "Saranga Samarakoon",
  regiNumber: "fc115625",
  contactNum: "0712345678",
  faculty: "computing fac",
  department: "SE",
  email: "sarangasama@gmail.com"
};

const userInput = {
  name: "Saranga Samarakoon",
  password: "User@789",
  regiNumber: "fc115625",
  contactNum: "0712345678",
  faculty: "computing fac",
  department: "SE",
  email: "sarangasama@gmail.com"
};

// Later