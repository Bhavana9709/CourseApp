const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');

const countryschema = new Schema(
    {
        country_id: {
            type: Number
        },
        name: {
            type: String
        }
    });

const countries = mongoose.model('countries', countryschema);

module.exports = countries;
