const Member = require('../_models/Member.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(member, o_) {
    return new Promise(function(res, rej) {

        let memberProps = Object.assign({ id: member.id, g: member.guild.id });
        let o = Object.assign({}, o_);
        if (o.role !== undefined) memberProps.r_ac = o.role.id;
        if (o.ps !== undefined) memberProps.ps = o.ps;

        let memberItem = new Member(memberProps);
        memberItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(memberProps);
        });
    });
}
