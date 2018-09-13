const mongoose = require('../DB.js').m;

let userSchema = mongoose.Schema({
    i: { type: String, index: true },
    n_u: String, // username
    n_d: String, // display name
    pw: String, // password
    c: Date, // creation time
    ip: String, // ip address registered from
});
let User = mongoose.model('user', userSchema);

exports.schema = userSchema;
exports.model = User;
