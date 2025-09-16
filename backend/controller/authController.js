const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const validator = require('validator')
const transporter = require('../config/nodemailer.js')
const welcomeRegi = require('../public/mail-template/welcome-regi.js')


require("dotenv").config();

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
        return res.status(400).send({success: false, message: `Error : ${error}`})
    }

}

exports.register = register;