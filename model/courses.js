const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');

const courseschema = new Schema(
    {
        course_id: {
            type: Number
        },
        name: {
            type: String
        },
        students: {
            type: Number
        },
        questions: {
            type: Array
        }
    });

const courses = mongoose.model('courses', courseschema);

module.exports = courses;
