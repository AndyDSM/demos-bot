const Role = require('../_models/Role.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id) {
    return new Promise(function(res, rej) {
        let q;
        if (Array.prototype.isPrototypeOf(id)) q = { $in: id }
        else if (typeof id === 'string') q = id;
        else { rej(); return; }
        Role.find({ id: q }, function(err, roles) {
            if (err) rej(util.error.dbError);
            else res(roles);
        });
    });
}
