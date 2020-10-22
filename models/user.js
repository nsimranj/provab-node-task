const mongoose = require("mongoose");

const address = mongoose.Schema({
    'hno': Number,
    'contactno': Number,
    'locality': String,
    'city': String,
    'pincode': Number,
    'state': String
});

//declare schema for Salary_Details collection
const user = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePic: Buffer,
    addresses: [address]
});

//export model for routes section
module.exports = mongoose.model("User", user);