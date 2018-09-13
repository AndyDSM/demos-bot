const mongoose = require('../DB.js').m;

let chatSchema = mongoose.Schema({
    i: { type: String, index: true },
    c: Date, // creation time
});
let Chat = mongoose.model('chat', chatSchema);

exports.schema = chatSchema;
exports.model = Chat;
