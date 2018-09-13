const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(uid, gid, perms) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Member.findOneAndUpdate({ id: uid, g: gid }, { $addToSet: { ps: (perms === undefined ? [] : perms) } }, function(err, member_) {
            if (err) rej(util.error.dbError);
            else if (member_ === null) rej(util.error.memberNotFound);
            else res(perms);
        });
    });
}
