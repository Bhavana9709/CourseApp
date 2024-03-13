const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');

const questionschema = new Schema(
    {
        question: {
            type: String
        },
        course: {
            type: String
        },
        answers: {
            type: Array
        }
    });

const questions = mongoose.model('questions', questionschema);

module.exports = questions;
