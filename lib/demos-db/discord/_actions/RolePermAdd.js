const Role = require('../_models/Role.js').model;
const C = require('demos-console');
const util = require('demos-util');

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
