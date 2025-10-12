const Event = require('../models/Event')
const validator = require('validator')

const addEvent = async (req, res) => {
    try {
        const {title,description, category, venue, startDate, startTime, endDate, endTime, participantsCount,userId} = req.body;

        if(!title) {
            return res.status(400).send({success: false, message: "Missing tittle"})
        }

        if(!description) {
            return res.status(400).send({success: false, message: "Missing Description"})
        }

        if(!category) {
            return res.status(400).send({success: false, message: "Missing Category"})
        }

        if(!venue) {
            return res.status(400).send({success: false, message: "Missing Venue"})
        }

        if(!startDate) {
            return res.status(400).send({success: false, message: "Missing Start Date"})
        }else if (!validator.isDate(startDate)) {
            return res.status(400).send({success: false, message: "Invlid Start Date"})
        }

        if(!startTime) {
            return res.status(400).send({success: false, message: "Missing Start Time"})
        }else if (!validator.isTime(startTime)) {
            return res.status(400).send({success: false, message: "Invlid Start Time"})
        }

        if(!endDate) {
            return res.status(400).send({success: false, message: "Missing End Date"})
        }else if (!validator.isDate(endDate)) {
            return res.status(400).send({success: false, message: "Invlid End Date"})
        }

        if(!endTime) {
            return res.status(400).send({success: false, message: "Missing End Time"})
        }else if (!validator.isTime(endTime)) {
            return res.status(400).send({success: false, message: "Invlid End Time"})
        }

        if(!participantsCount) {
            return res.status(400).send({success: false, message: "Missing Participants Count"})
        }

        const exsistingEvent = await Event.findOne({title})

        if(exsistingEvent) {
            return res.status(400).send({success: false, message: "Event title exists"})
        }

        const event = new Event({title, description, category, venue, startDate, startTime, endDate, endTime, participantsCount})

        await event.save();

        return res.status(200).send({success: true, message: `Succsfully Registered ${title}`})

    } catch (error) {
        return res.status(400).send({success: false, message: error.message})
    }
}

exports.addEvent = addEvent;