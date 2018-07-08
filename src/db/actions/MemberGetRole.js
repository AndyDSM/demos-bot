const Member = require('../models/Member.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(member) {
    return new Promise(function(res, rej) {
        Member.findOne({ id: member.id, g: member.guild.id }, 'r_ac', function(err, member) {
            if (err) rej(util.error.dbError);
            else if (member === null) rej(util.error.memberNotFound);
            else if (member.r_ac === undefined) rej(util.error.roleAccessoryNotFound);
            else res(member.r_ac);
        });
    });
}
