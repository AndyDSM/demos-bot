const mongoose = require('../DB.js').m;

let roleSchema = mongoose.Schema({
    id: String, // role id
    ps: String, // role permissions (internal, not discord)
});
let Role = mongoose.model('role', roleSchema);

exports.schema = roleSchema;
exports.model = Role;
