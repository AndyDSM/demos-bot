const Member = require('../models/Member.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(member, role) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Member.updateOne({ id: member.id, g: member.guild.id }, { $set: { r_ac: role.id } }, function(err, member) {
            if (err) rej(util.error.dbError);
            //else if (guild === null) rej(util.error.guildNotFound);
            else res(role.id);
        });
    });
}
