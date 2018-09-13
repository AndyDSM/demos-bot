const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(uid, gid, perms) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        let condition = {};
        if (perms.length === 1) condition = { ps: perms[0] };
        else if (perms.length > 1) condition = { ps: { $in: perms } };
        Member.findOneAndUpdate({ id: uid, g: gid }, { $pull: condition }, { multi: true }, function(err, member_) {
            if (err) rej(util.error.dbError);
            else if (member_ === null) rej(util.error.memberNotFound);
            else res();
        });
    });
}
