const util = require('../util/util.js');

class AccessoryRole {
    static getByMember(member) {
        return new Promise((res, rej) => {
            require('../db/actions/MemberGetRole.js')(member).then(roleID => {
                try {
                    let role = member.guild.roles.get(roleID);
                    if (role === undefined) throw '';
                    res(role);
                } catch (e) {
                    this.createRole(member).then(res).catch(rej);
                }
            }).catch(err => {
                if (err === util.error.memberNotFound) {
                    this.createMember(member).then(res).catch(rej);
                } else if (err === util.error.roleAccessoryNotFound) {
                    this.createRole(member).then(res).catch(rej);
                } else rej(err);
            });
        });
    }

    static createMember(member) {
        return new Promise((res, rej) => {
            member.guild.createRole().then(role => role.setPosition(member.guild.roles.size - 2)).then(role => {
                require('../db/actions/MemberAdd.js')(member, role).then(res).catch(rej);
            }).catch(rej);
        });
    }

    static createRole(member) {
        return new Promise((res, rej) => {
            member.guild.createRole().then(role => role.setPosition(member.guild.roles.size - 2)).then(role => {
                require('../db/actions/MemberAddRole.js')(member, role).then(res).catch(rej);
            }).catch(rej);
        });
    }
}

module.exports = AccessoryRole;
