const util = require('demos-util');
const Member = require('../member');

class AccessoryRole {

    static async getByMember(member) {
        try {
            let roleID = await Member.getRolePersonal(member);//require('../_actions/MemberGetRole.js')(member);
            let role = member.guild.roles.get(roleID);
            if (role === undefined) return await AccessoryRole.createRole(member);
            else return role;
        } catch (err) {
            if (err === util.error.roleAccessoryNotFound) return await AccessoryRole.createRole(member)
            else throw error;
        }
    }

    static async createMember(member) {
        let role = await member.guild.createRole();
        role = await role.setPosition(member.guild.roles.size - 2);
        await Member.add(member, {r_ac:role.id});
        return role;
    }

    static async createRole(member) {
        let role = await member.guild.createRole();
        role = await role.setPosition(member.guild.roles.size - 2);
        await Member.addRolePersonal(member, role);
        return role;
    }
}

module.exports = AccessoryRole;
