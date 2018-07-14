const Role = require('../models/Role.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id, perms) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Role.findOneAndUpdate({ id: id }, { $addToSet: { ps: (perms === undefined ? [] : perms) } }, function(err, role_) {
            if (err) rej(util.error.dbError);
            else if (role_ === null) rej(util.error.roleNotFound);
            else res(role_);
        });
    });
}
