const Role = require('../models/Role.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

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
