const Member = require('../models/Member.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

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
