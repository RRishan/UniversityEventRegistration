const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workFlowSchema = new Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    workFlowContent: [
        {
            role: {type: String, required: true},
            status: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
            message: {type: String},
            updatedAt: {type: Date, default: Date.now}
        }
    ]
})

const WorkFlow = mongoose.model("WorkFlow", workFlowSchema)

module.exports = WorkFlow;