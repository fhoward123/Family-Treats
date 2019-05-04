const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = Schema(
    {
        username: {
            type: String,
            required: [true, 'Required']
        },
        password: {
            type: String,
            required: [true, 'Required']

        }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
