const Member = require('../models/Member.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(member, role) {
    return new Promise(function(res, rej) {

        let memberProps = Object.assign({ id: member.id, g: member.guild.id });
        if (role !== undefined) memberProps.r_ac = role.id;

        let memberItem = new Member(memberProps);
        memberItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(memberProps);
        });
    });
}
