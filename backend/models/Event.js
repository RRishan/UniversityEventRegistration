const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    eventTitle: { type: String, required: true },
    description: {type: String, required: true},
    category: {type: String, required: true},
    eventDate: {type: String, required: true},
    expectedAttendees: {type: Number, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    venue: {type: String, required: true},
    imageLink: {type: String, default: ''},
    isApproved: {type: Boolean, default: false},
    organizationId: {type: String, default: ''}
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event;