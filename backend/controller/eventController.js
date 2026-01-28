const Event = require('../models/Event')
const validator = require('validator')

// Event Registration 
const addEvent = async (req, res) => {
    try {
        // Get the attributes from request
        const {eventTitle, description, category, eventDate, expectedAttendees, startTime, endTime, imageLink, venue, userId} = req.body;
        console.log(req.body);
        // Check attributes are valid or not
        if(!eventTitle) {
            return res.send({success: false, message: "Missing tittle"})
        }

        if(!description) {
            return res.send({success: false, message: "Missing Description"})
        }

        if(!category) {
            return res.send({success: false, message: "Missing Category"})
        }

        if(!expectedAttendees) {
            return res.send({success: false, message: "Missing Expected Attendees"})
        }

        if(!eventDate) {
            return res.send({success: false, message: "Missing Event Date"})
        }

        if(!startTime) {
            return res.send({success: false, message: "Missing Start Time"})
        }else if (!validator.isTime(startTime)) {
            return res.send({success: false, message: "Invlid Start Time"})
        }

        if(!endTime) {
            return res.send({success: false, message: "Missing End Time"})
        }else if (!validator.isTime(endTime)) {
            return res.send({success: false, message: "Invlid End Time"})
        }

        if(!imageLink) {
            return res.send({success: false, message: "Missing Image Link"})
        }

        // Build the event model
        const event = new Event({eventTitle, description, category, eventDate, expectedAttendees, startTime, endTime, imageLink, venue, organizationId: userId})

        // Save event model
        await event.save();

        return res.send({success: true, message: `Succsfully fill form`})

    } catch (error) {
        //Send error message when it is cause error
        return res.send({success: false, message: error.message})
    }
}

// Get an event 
const getEvent = async (req, res) => {
    try {
        //Get attributes
        const {eventId} = req.query

        //Check event id valid or not
        if(!eventId) {
            return res.send({success: false, message: "Invalid Event"})
        }

        // Get event from database
        const event = await Event.findById(eventId)

        // Check the event valid or not
        if (!event) {
            return res.send({success: false, message: "Invalid Event"})
        }

        // Send event
        return res.status(200).send({success: true, message: event })

    } catch (error) {
        //Send error message when it is cause error
        return res.send({success: false, message: error.message})
    }
}

// Get all the events 
const getAllEvent = async (req, res) => {
    try {
        // Get event array from database 
        const events = await Event.find({ isApproved: true });

        // Check events invalid or not
        if(!events) {
            return res.send({success: false, message: "Invalid Events"})
        }

        // Send Events 
        return res.status(200).send({success: true, message: events})

    } catch (error) {
        //Send error message when it is cause error
        return res.send({success: false, message: error.message})
    }
}

// Update the events
const updateEvent = async (req, res) => {
    try {
        // Get the attributes from request
        const {title,description, category, venue, startDate, startTime, endDate, endTime, participantsCount,_id} = req.body;

        // Check attributes are valid or not
        if(!title) {
            return res.send({success: false, message: "Missing tittle"})
        }

        if(!description) {
            return res.send({success: false, message: "Missing Description"})
        }

        if(!category) {
            return res.send({success: false, message: "Missing Category"})
        }

        if(!venue) {
            return res.send({success: false, message: "Missing Venue"})
        }

        if(!startDate) {
            return res.send({success: false, message: "Missing Start Date"})
        }else if (!validator.isDate(startDate)) {
            return res.send({success: false, message: "Invlid Start Date"})
        }

        if(!startTime) {
            return res.send({success: false, message: "Missing Start Time"})
        }else if (!validator.isTime(startTime)) {
            return res.send({success: false, message: "Invlid Start Time"})
        }

        if(!endDate) {
            return res.send({success: false, message: "Missing End Date"})
        }else if (!validator.isDate(endDate)) {
            return res.send({success: false, message: "Invlid End Date"})
        }

        if(!endTime) {
            return res.send({success: false, message: "Missing End Time"})
        }else if (!validator.isTime(endTime)) {
            return res.send({success: false, message: "Invlid End Time"})
        }

        if(!participantsCount) {
            return res.send({success: false, message: "Missing Participants Count"})
        }

        // Update the event from database
        const event = await Event.updateOne({_id}, {$set: {title, description, category, venue, startDate, startTime, endDate, endTime, participantsCount}})

        //Check event valid or not
        if(!event) {
            return res.send({success: false, message: "Invalid Event"})
        }

        //Send message
        return res.status(200).send({success: true, message: "Succsfully updated !!"})

    } catch (error) {
        //Send error message when it is cause error
        return res.send({success: false, message: error.message})
    }
}

// delete the events
const deleteEvent = async (req, res) => {
    try {
        //Get attributes
        const {eventId} = req.query;

        //Check event id valid or not
        if(!eventId) {
            return res.send({success: false, message: "Invalid Event"})
        }

        // get response form the database
        const response = await Event.deleteOne({_id: eventId})

        // check the reponse
        if(!response) {
            return res.send({success: false, message: "Invalid event Id"})
        }

        // send the response
        return res.status(201).send({success: true, message: "Succsfully deleted the event !!"})

    } catch (error) {
        //Send error message when it is cause error
        return res.send({success: false, message: error.message})
    }
}

// get event by organization id
const getEventsByOrganization = async (req, res) => {
    try {
        const {userId} = req.body;
        
        const events = await Event.find({organizationId: userId});

        if(!events) {
            return res.send({success: false, message: "No events found"})
        }

        return res.send({success: true, message: events})

    } catch (error) {
        return res.send({success: false, message: error.message})
    }
}

exports.addEvent = addEvent;
exports.getEvent = getEvent;
exports.getAllEvent = getAllEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.getEventsByOrganization = getEventsByOrganization;