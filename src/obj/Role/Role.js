const C = require('../../util/console.js');

class RoleObj {
    static rolesWithName(rolename, guild) {
        let r = [];
        let rolename_ = rolename.toUpperCase();
        for (let [id, role] of guild.roles[Symbol.iterator]()) {
            if (role.name.toUpperCase() === rolename_) r.push(role);
        }
        return r;
    }

    static parse(rolename, guild) {
        //C.logDev(rolename);
        let roleID = (rolename).match(/[0-9]+/);
        if ((/<@&[0-9]+>/).test(rolename) || (roleID !== null && roleID[0] === rolename)) {
            //C.logDev(roleID[0]);
            let r = guild.roles.get(roleID[0]);
            return (r === undefined ? null : [r]);
        } else {
            let r = RoleObj.rolesWithName(rolename, guild);
            return (r.length === 0 ? null : r);
        }
        return null;
    }
}

module.exports = RoleObj;
