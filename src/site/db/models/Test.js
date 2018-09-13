const mongoose = require('../DB.js').m;

let testSchema = mongoose.Schema({
    i: { type: String, index: true },
    name: String
});
let Test = mongoose.model('test', testSchema);

exports.schema = testSchema;
exports.model = Test;
