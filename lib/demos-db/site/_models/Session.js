const mongoose = require('../../mongoose.js');

let sessionSchema = mongoose.Schema({
    _id: String, // session id
    session: Object, // session data
    expires: Date, // date expired
});
let Session = mongoose.model('session', sessionSchema);

exports.schema = sessionSchema;
exports.model = Session;
