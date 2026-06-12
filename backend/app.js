const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js')
const eventRouter = require('./routes/eventRoutes.js')
const studentRouter = require('./routes/studentRoutes.js')
const orginzerRouter = require('./routes/orginzerRoutes.js')
const lectureRouter = require('./routes/lectureRoutes.js')
const facultyRouter = require('./routes/facultyRoutes.js')
const adminRouter = require('./routes/adminRoutes.js')
const projectRouter = require('./routes/projectRoutes.js')
const workFlowRouter = require('./routes/workFlowRoutes.js')
const userRouter = require('./routes/userRoutes.js');
const { testSMTPConnection, sendApprovalRequestEmail } = require('./utils/emailService.js');
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080','https://university-event-registration-iurn.vercel.app/'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/test/email', async (req, res) => {
    try {
        const data = await testSMTPConnection();

        await sendApprovalRequestEmail('sarangasama@gmail.com', 'Welfare Officer', 'Test Event', {
            eventDate: '2024-07-01',
            startTime: '10:00',
            endTime: '12:00',
            venueName: 'Main Auditorium',
            expectedAttendees: 100,
            currentStatus: 'Pending',
        },       `${process.env.FRONTEND_BASE_URL}/admin/events/12345`);
        res.send(data);
    } catch (error) {
        res.status(500).send({ success: false, message: `Error: ${error.message}` });
    }
});

app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)
app.use('/api/student', studentRouter)
app.use('/api/organizer', orginzerRouter)
app.use('/api/lecture', lectureRouter)
app.use('/api/faculty', facultyRouter)
app.use('/api/admin', adminRouter)
app.use('/api/project', projectRouter)
app.use('/api/workflow', workFlowRouter)
app.use('/api/user', userRouter)


module.exports = app;
