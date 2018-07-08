const mongoose = require('../DB.js').m;

let guildSchema = mongoose.Schema({
    id: String, // guild's discord id
    pr: String, // prefix used
});
let Guild = mongoose.model('guild', guildSchema);

exports.schema = guildSchema;
exports.model = Guild;
