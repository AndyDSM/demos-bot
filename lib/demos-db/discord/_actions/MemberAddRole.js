const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(member, role) {
    return new Promise(function(res, rej) {
        //C.logTest('Changing prefix to' + prefix);
        Member.updateOne({ id: member.id, g: member.guild.id }, { $set: { r_ac: role.id } }, function(err) {
            if (err) rej(util.error.dbError);
            //else if (guild === null) rej(util.error.guildNotFound);
            else res(role.id);
        });
    });
}
