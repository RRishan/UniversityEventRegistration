const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const validator = require('validator')
const transporter = require('../config/nodemailer.js')
const welcomeRegi = require('../public/mail-template/welcome-regi.js')
const verifyOtpMail = require('../public/mail-template/verify-otp.js')


require("dotenv").config();

// User Registration
const register = async (req, res) => {
    
    try {
        //Get the attributes from request
        const {name, email, regiNumber, contactNum, faculty, department ,password} = req.body;

        //Check the email , name, regiNumber, contactNum, faculty, department , password are exist and valid or not
        if (!name) {
            return res.status(400).send({ success: false, message: "Missing Name" });
        }

        if (!email) {
            return res.status(400).send({ success: false, message: "Missing Email" });
        } else if (!validator.isEmail(email)) {
            return res.status(400).send({ success: false, message: "Invalid Email" });
        }

        if (!regiNumber) {
            return res.status(400).send({success: false, message: "Missing Registration Number"})
        }

        if (!faculty) {
            return res.status(400).send({success: false, message: "Missing faculty Name"})
        }

        if (!contactNum) {
            return res.status(400).send({success: false, message: "Missing Contact Number"})
        }else {
            function isSriLankanPhone(number) {
                // Matches either 07XXXXXXXX or +94XXXXXXXXX
                return /^(?:\+94|0)(7\d{8})$/.test(number);
            }
            if(!isSriLankanPhone(contactNum)) {
                return res.status(400).send({success: false, message: "Invalid contact number"})
            }
            
        }

        if (!department) {
            return res.status(400).send({success: false, message: "Missing Department Name"})
        }

        if (!password) {
            return res.status(400).send({ success: false, message: "Missing Password" });
        }else if (!validator.isStrongPassword(password)) {
            return res.status(400).send({ success: false, message: "Please create Strong password" });
        }

        //Check the user already registed or not
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).send({success: false, message: "User already exists"})
        }

        //hashed password using bcrypt
        const hashPassword = await bcrypt.hash(password, 10);

        //make the new User using User model
        const user = new User({name,email, regiNumber, contactNum, faculty, department,password: hashPassword})

        //Save the user
        await user.save();

        //Create token using jwt
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        
        //Save token to the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000   // Milisecond
        });

        //Creating Welcome body
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Registration Successful – ${name} | University of Sri Jayewardenepura 🎉`,
            text: welcomeRegi.getTextBody(name),
            html: welcomeRegi.getHtml(name)
        }

        //Send the email for registration
        await transporter.sendMail(mailOptions);

        return res.status(201).send({message: "Succsfully Registered", success: true})
        

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: `Error : ${error}`})
    }

}

//User Login
const login = async (req, res) => {
    try {
        //Get the attributes from request
        const {email, password} = req.body;

        //Check the email , password are exist and valid or not
        if (!email) {
            return res.status(400).send({ success: false, message: "Missing Email" });
        } else if (!validator.isEmail(email)) {
            return res.status(400).send({ success: false, message: "Invalid Email" });
        }

        if (!password) {
            return res.status(400).send({ success: false, message: "Missing Password" });
        }

        //Find the user from database
        const user = await User.findOne({email});

        //Check the user is valid or not
        if (!user) {
            return res.status(400).send({success: false, message: "User not found"})
        }

        //Check with password is match or not
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({success: false, message: "Invalid Password"})
        }

        //Create token using jwt
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})


        //Save token to the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000   // Milisecond
        });

        return res.status(200).send({success: true, message: `Login successful! Welcome back, ${user.name}.`})


    } catch (error) {

        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

//User logout
const logout = async (req, res) => {
    try {
        //Clear token to the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' 
        })

        return res.status(200).send({success: true, message: `Logged Out`})

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

//User verify Otp
const verifyOtp = async (req, res) => {
    try {
        //Get the attributes from request
        const {userId} = req.body;

        //Check user login or not
        if(!userId) {
            return res.status(400).send({success: false, message: "Please re-login"})
        }
        
        //Get the user details 
        const  user = await User.findById(userId)

        //Check if its verify or not
        if (user.isAccountVerified) {
            return res.status(400).send({success: false, message: "Account already verified"})
        }

        //Create the otp
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        
        //Setting the otp and the databases
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();

        //Build the mail body
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: verifyOtpMail.getSubject,
            html: verifyOtpMail.getHtml(user.name, otp)
        }

        //Send mail to user
        await transporter.sendMail(mailOptions)

        return res.status(200).send({success: true, message: "Check your emails"})

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
    
}

// User OTP Verification function
const verifyEmail = async (req, res) => {
    try {
        //Get the attributes from request
        const {userId, otp} = req.body;

        

        //Check if the user login or not
        if(!userId) {
            return res.status(400).send({success: false, message: "Please re-login"})
        }
        
        //Check if the OTP missing or not
        if (!otp) {
            return res.status(400).send({success: false, message: "Missing OTP code"})
        }

        //Get the user details using user id 
        const user = await User.findById(userId);

        //Check if the user if valid or not 
        if(!user) {
            return res.status(400).send({success: false, message: "User not found"})
        }

        //Check if otp is missing and valid or not
        if (user.verifyOtp == '' || user.verifyOtp !== otp) {
            return res.status(400).send({success: false, message: "Invalid OTP"})
        }

        //Check otp expire or not
        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).send({success: false, message: "OTP Expired"})
        }

        //make user verify
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = ''

        //Save the user
        await user.save()

        return res.status(400).send({success: true, message: "Email verify succesfully "})

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

//User isAuthenticated function 
const isAuthenticated = async (req, res) => {
    try {
        //Get the attributes from request
        const {userId} = req.body;

        //Check if the user login or not
        if(!userId) {
            return res.status(400).send({success: false, message: "Please re-login"})
        }

        //Get the user details using user id 
        const user = await User.findById(userId);

        //Check if the user if valid or not 
        if(!user) {
            return res.status(400).send({success: false, message: "User not found"})
        }

        //Check is account is verify or not
        if (!user.isAccountVerified) {
            return res.status(400).send({success: false, message: "Account is not authenticated"})
        }

        return res.status(200).send({success: true, message: "Account is verfiy"})

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

// User send OTP for password reset 
const sendResetOtp = async (req, res) => {
    try {
        //Get the attributes from request
        const {email} = req.body;

        //Check the email is valid or not
        if (!email) {
            return res.status(400).send({success: false, message: "Email is required"})
        }

        //Get user from databases
        const user = await User.findOne({email})

        //Check if the user found or not
        if(!user) {
            return res.status(400).send({sccess: false,  message: "User not found"})
        }

        //Build the OTP and the send to database
        const otp = String(Math.floor(100000+ Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();

        //Build email structure
        const mailOptions = {
            from: proces.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset OTP",
            text: `Your OTP for resetting your password is ${otp}`
        }


        //send emails
        await transporter.sendMail(mailOptions)

        return res.status(400).send({success: true, message: "OTP sent to your email"})

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.verifyOtp = verifyOtp;
exports.verifyEmail = verifyEmail;
exports.isAuthenticated = isAuthenticated;
exports.sendResetOtp = sendResetOtp;