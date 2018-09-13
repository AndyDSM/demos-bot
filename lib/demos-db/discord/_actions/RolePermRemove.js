const Role = require('../_models/Role.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(id, perms) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        let condition = {};
        if (perms.length === 1) condition = { ps: perms[0] };
        else if (perms.length > 1) condition = { ps: { $in: perms } };
        Role.findOneAndUpdate({ id: id }, { $pull: condition }, { multi: true }, function(err, role_) {
            if (err) rej(util.error.dbError);
            else if (role_ === null) rej(util.error.roleNotFound);
            else res();
        });
    });
}
