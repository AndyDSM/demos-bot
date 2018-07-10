const mongoose = require('../DB.js').m;

let voteSchema = mongoose.Schema({
    id: String, // poll id
    u: String, // creator id
    o: Number, // option chosen
});
let Vote = mongoose.model('vote', voteSchema);

exports.schema = voteSchema;
exports.model = Vote;
