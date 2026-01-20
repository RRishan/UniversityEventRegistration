const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js')
const eventRouter = require('./routes/eventRoutes.js')
const studentRouter = require('./routes/studentRoutes.js')
const orginzerRouter = require('./routes/orginzerRoutes.js')
const lectureRouter = require('./routes/lectureRoutes.js')
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)
app.use('/api/student', studentRouter)
app.use('/api/organizer', orginzerRouter)
app.use('/api/lecture', lectureRouter)


module.exports = app;