const mongo = require('mongodb');
const mongoose = require('mongoose');
const mongoUri = require('./personal/env');

mongoose.connect(mongoUri, {
    useNewUrlParser: true
}).then(() => console.log(console.log(mongoose.connection.readyState))).catch(err => console.log(err));
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: String,
    username: String,
    count: Number,
    log:[]
}, {timestamp: true});//telling when a mongoose been created

const User = mongoose.model('User', userSchema);

module.exports = User;