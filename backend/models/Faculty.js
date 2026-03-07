const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facultySchema = new Schema({
    facultyName: { type: String, required: true },
    departments: { type: [{ name: String }], required: true }
});

const Faculty = mongoose.model("Faculty", facultySchema)

module.exports = Faculty;