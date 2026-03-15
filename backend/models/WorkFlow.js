const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workFlowSchema = new Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    workFlow: {type: Array, default: []}
})

const WorkFlow = mongoose.model("WorkFlow", workFlowSchema)

module.exports = WorkFlow;