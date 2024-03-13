const { default: mongoose } = require("mongoose");
const { stringify } = require("uuid");
const { Schema } = mongoose;
const validator = require('validator');
var validate = require('../usersvalidation');

const langschema = new Schema(
    {
        name: {
            type: String,
            required: true,
            enum: {
                values: ['English', 'Korean', 'French'],
                message: '{VALUE} is not supported'
            }
        },
    }
)
const userdetailsschema = new Schema(
    {

        firstname: {
            type: String,
            required: true,

            unique: true
        },
        lastname: {
            type: String,
            required: true,

            // unique: true
        },
        username: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },

        course: {
            type: Array
        },
        mobile: {
            required: true,
            type: String,
            minlength: [10, "invalid mobile number!!"]
        },
        questions: {
            type: Array
        },
        created_at: {
            type: Date, default: Date.now()
        }
    });

// userdetailsschema.path('password').validate(function (input) {
//     return validate.isGoodPassword(input) && validate.isLongEnough(input);
// });
userdetailsschema.pre('remove', { document: true, query: false }, function () {
    console.log('Removing doc!');
});
// userdetailsschema.pre('save', function (next) {
//     const data = await userdetails.find({ username: user.username });
//     if (data.length > 0) {
//         const err = "Username already exists";
//     }
//     // next(err);
// });

// userdetailsschema.pre('save', function (next) {
//     console.log(this);

// });

userdetailsschema.post('save', function (next) {
    setTimeout(function () {
        console.log('post1');
        // Kick off the second post hook
        // next();
    }, 10);
});

// Will not execute until the first middleware calls `next()`
userdetailsschema.post('save', function (next) {
    console.log('post2');
    // next();
});
const userdetails = mongoose.model('userdetails', userdetailsschema);


module.exports = userdetails; 