const RoleModel = require('../_models/Role.js').model;
const util = require('demos-util');
const C = require('demos-console');

class RoleObj {
    static fromName(rolename, guild) {
        let r = [];
        let rolename_ = rolename.toUpperCase();
        for (let [id, role] of guild.roles[Symbol.iterator]()) {
            if (role.name.toUpperCase() === rolename_) r.push(role);
        }
        return r;
    }

    static fromText(rolename, guild) {
        //C.logDev(rolename);
        let roleID = (rolename).match(/\d+/);
        if ((/^<@&\d+>$/).test(rolename) || (roleID !== null && roleID[0] === rolename)) {
            let r = guild.roles.get(roleID[0]);
            if (r !== undefined) return [r];
        } 
        let r = RoleObj.fromName(rolename, guild);
        return (r.length === 0 ? null : r);
    }

    static async add(role, o) {
        try {
            let props = Object.assign({id: role.id},o);
            let item = new RoleModel(props);
            await item.save();
            return props;
        } catch (e) { throw util.error.dbError; }
    }

    // add/get/remove perms based on role
    static async addPerms(r_, perms) {
        let r;
        try {
            r = await RoleModel.findOneAndUpdate({id: r_.id}, { $addToSet: { ps: (perms === undefined ? [] : perms) } }).exec();
        } catch (e) { throw util.error.dbError; }
        if (r === null) throw util.error.roleNotFound;
    }

    static async getPerms(rs_) {
        let rs, q;
        try {
            if (rs_ instanceof Array) q = { $in: rs_.map(x => x.id) };
            else if (typeof rs_.id === 'string') q = rs_.id;
            else throw '';
            rs = await RoleModel.find({ id: q }, 'id ps').exec();
        } catch (e) { throw util.error.dbError; }
        if (rs === null) return [];
        else return rs;
    }

    static async removePerms(r_, perms) {
        let r;
        let q = {};
        if (perms.length === 1) q = { ps: perms[0] };
        else if (perms.length > 1) q = { ps: { $in: perms } };
        try {
            r = await RoleModel.findOneAndUpdate({ id: r_.id }, { $pull: q }, { multi: true }).exec();
        } catch (e) { throw util.error.dbError; }
        if (r === null) throw util.error.roleNotFound;
        else return;
    }

}

module.exports = RoleObj;
