const MemberModel = require('../_models/Member.js').model;
const util = require('demos-util');

class Member {

    static fromName(membername, guild) {
        let r = [];
        let membername_ = membername.toUpperCase();
        for (let [id, member] of guild.members) {
            if (member.nickname.toUpperCase() === membername_) r.push(member);
        }
        return r;
    }

    static fromText(membername, guild) {
        //C.logDev(rolename);
        let memberID = (membername).match(/\d+/);
        if ((/^<@!\d+>$/).test(membername) || (memberID !== null && memberID[0] === membername)) {
            let r = guild.members.get(memberID[0]);
            if (r !== undefined) return [r];
        } 
        let r = Member.fromName(membername, guild);
        return (r.length === 0 ? null : r);
    }

    static async add(m_, o) {
        try {
            let props = Object.assign({
                id: m_.id,
                g: m_.guild.id
            }, o);
            let item = new MemberModel(props);
            await item.save();
            return props;
        } catch (e) { throw util.error.dbError; }
    }

    // get accessory role from member
    static async addRolePersonal(m_, role) {
        let m;
        try {
            m = await MemberModel.findOneAndUpdate({ id: m_.id, g: m_.guild.id }, { $set: { r_ac: role.id } }).exec();
        } catch (e) { throw util.error.dbError; }
        if (m === null) await Member.add(m_, {r_ac:role.id});
    }   

    static async getRolePersonal(m_) {
        let m;
        try {
            m = await MemberModel.findOne({ id: m_.id, g: m_.guild.id }, 'r_ac').exec();
        } catch (e) { throw util.error.dbError; }
        if (m === null) throw util.error.roleAccessoryNotFound;
        else if (m.r_ac === undefined) throw util.error.roleAccessoryNotFound;
        else return m.r_ac;
    }

    // add/get/remove perms based on member
    static async addPerms(m_, perms) {
        try {
            let m = await Member.findOneAndUpdate({ id: m_.id, g: m_.guild.id }, { $addToSet: { ps: (perms === undefined ? [] : perms) } }).exec();
            if (m === null) {
                await Member.add(m_, { ps: perms });
            }
        } catch (e) { throw util.error.dbError; }
    }

    static async getPerms(m_) {
        let m;
        try {
            m = await MemberModel.findOne({ id: m_.id, g: m_.guild.id }, 'ps').exec();
        } catch (e) { throw util.error.dbError; }
        if (m === null) return [];
        else if (m.ps === undefined) return [];
        else return m.ps;
    }

    static async removePerms(m_, perms) {
        let m;
        let condition = {};
        if (perms.length === 1) condition = { ps: perms[0] };
        else if (perms.length > 1) condition = { ps: { $in: perms } };
        try {
            m = await Member.findOneAndUpdate({ id: m_.id, g: m_.guild.id }, { $pull: condition }, { multi: true }).exec();
        } catch (e) { throw util.error.dbError; }
        //if (m === null) throw util.error.memberNotFound;
    }

}

module.exports = Member;