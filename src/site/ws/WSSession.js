const mongoose = require('../db/DB.js').m;

let sessionSchema = mongoose.Schema({
    _id: String,
    session: {
        wsIDs: [String],
        //ip: String
    }
});
let Session = mongoose.model('session', sessionSchema);

module.exports = Session;
