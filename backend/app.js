const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js')
const eventRouter = require('./routes/eventRoutes.js')
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)


module.exports = app;