const mongoose = require('../../mongoose.js');

let pollSchema = mongoose.Schema({
    ch: String, // poll's channel id
    q: String, // question asked
    o: [String], // options
    vc: [Number], // vote count
    id: String, // uuid
    op: Boolean, // whether poll is open - either true/false
    u: String // creator id
});
let Poll = mongoose.model('poll', pollSchema);

exports.schema = pollSchema;
exports.model = Poll;
