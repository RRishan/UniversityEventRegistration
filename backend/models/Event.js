const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, required: true},
    category: {type: String, enum: ['Educational', 'Music', 'Entertainment', 'Meeting'], required: true},
    venue: {type: String, enum: ['Bandaranayake Hall', 'Sumangala Hall', 'Gal pitiniya'], required: true},
    startDate: {type: String, required: true},
    startTime: {type: String, required: true},
    endDate: {type: String, required: true},
    endTime: {type: String, required: true},
    participantsCount: {type: Number, default: 50},
    isApproved: {type: Boolean, default: false},
    organizationId: {type: String, default: ''}
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event;