const mongoose = require('../../mongoose.js');

// members are specifically a user's instance on a single guild
let memberSchema = mongoose.Schema({
    id: String, // member's discord id
    g: String, // member's guild id
    r_ac: String, // id of accessory role
    ps: [String], // member's individual perms
});
let Member = mongoose.model('member', memberSchema);

exports.schema = memberSchema;
exports.model = Member;
