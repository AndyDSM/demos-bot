const MemberCreate = require('../_actions/MemberAdd.js');
const MemberGet = require('../_actions/MemberPermGet.js');
const MemberAdd = require('../_actions/MemberPermAdd.js');
const MemberRemove = require('../_actions/MemberPermRemove.js');
const RoleCreate = require('../_actions/RoleAdd.js');
const RoleGet = require('../_actions/RolePermGet.js');
const RoleAdd = require('../_actions/RolePermAdd.js');
const RoleRemove = require('../_actions/RolePermRemove.js');

const Discord = require('discord.js');
const client = require('demos-discClient');
const config = require('demos-config');
const util = require('demos-util');

class Perms {

    constructor() {
        this.memberPerms = [];
        this.rolePerms = [];
        this.allPerms = [];
        this.perms_ = new Map();
        this.isAdmin = false;
        this.isOwner = false;
    }

    hasPerm(perm) {
        return this.perms_.get(perm) !== undefined;
    }

    static getResolvedPerms(perms) {
        let r = new Map();
        for (let i = perms.length - 1; i >= 0; i--) {
            for (let j = 0; j < perms[i].length; j++) {
                if (perms[i][j].charAt(0) === '-') r.delete(perms[i][j].substring(1));
                else r.set(perms[i][j], true);
            }
        }
        return r;
    }

    static getRoleIDsFromMember(member) {
        let r = [];
        for (let entry of member.roles) {
            r.push(entry);
        }
        r.sort((a, b) => (a[1].calculatedPosition < b[1].calculatedPosition ? 1 : -1)); // highest role first
        //r = r.map(x => x[0]);
        return r;
    }

    /*static getRolePerms(member) {
        return new Promise((res, rej) => {
            let ids = Perms.getRoleIDsFromMember(member);
            RoleGet(ids.map(x => x[0])).then((roles) => {
                let r = [];
                for (let i = 0; i < ids.length; i++) {
                    let r_ = [ids[i][1], []];
                    for (let j = 0; j < roles.length; j++) {
                        if (r_[0].id === roles[j].id) {
                            r_[1] = roles[j].ps;
                            break;
                        }
                    }
                    r[i] = r_;
                }
                res(r);
            }).catch(rej);
        });
    }*/
    
    static async getRolePerms(member) {
        let ids = Perms.getRoleIDsFromMember(member);
        let roles = await RoleGet(ids.map(x => x[0]));
        let r = [];
        for (let i = 0; i < ids.length; i++) {
            let r_ = [ids[i][1], []];
            for (let j = 0; j < roles.length; j++) {
                if (r_[0].id === roles[j].id) {
                    r_[1] = roles[j].ps;
                    break;
                }
            }
            r[i] = r_;
        }
        return r;
    }

    /*static get(member) {
        return new Promise((res, rej) => {
            Promise.all([
                MemberGet(member.id, member.guild.id),
                Perms.getRolePerms(member),
            ]).then((vs) => {
                let r = new Perms();
                r.member = member;
                r.memberPerms = vs[0];
                r.rolePerms = vs[1];
                r.allPerms = [vs[0], ...vs[1].map(x => x[1])];
                r.perms_ = Perms.getResolvedPerms(r.allPerms);
                r.isAdmin = member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR);
                r.isOwner = member.guild.ownerID === member.id;
                r.isBotOwner = member.id === config.ownerID;
                res(r);
            }).catch(rej);
        });
    }*/

    static async get(member) {
        let [memberPerms, rolePerms] = await Promise.all([
                MemberGet(member.id, member.guild.id),
                Perms.getRolePerms(member),
            ]);
        let r = new Perms();
        r.member = member;
        r.memberPerms = memberPerms;
        r.rolePerms = rolePerms;
        r.allPerms = [memberPerms, ...rolePerms.map(x => x[1])];
        r.perms_ = Perms.getResolvedPerms(r.allPerms);
        r.isAdmin = member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR);
        r.isOwner = member.guild.ownerID === member.id;
        r.isBotOwner = member.id === config.ownerID;
        return r;
    }

    static getByMemberIDs(uid, gid) {
        let member;
        try {
            member = client.guilds.get(gid).members.get(uid);
            return Perms.get(member);
        } catch (e) {
            C.logDev(e);
            return null;
        }
    }

    /*static addMemberPerms(member, perms) {
        return new Promise((res, rej) => {
            MemberAdd(member.id, member.guild.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.memberNotFound) {
                    MemberCreate(member.id, member.guild.id, {
                        ps: perms
                    }).then(() => { res() }).catch(rej);
                }
            });
        });
    }*/

    static async addMemberPerms(member, perms) {
        try {
            await MemberAdd(member.id, member.guild.id, perms);
            return;
        } catch (err) {
            if (err === util.error.memberNotFound) {
                await MemberCreate(member.id, member.guild.id, { ps: perms });
                return;
            } else throw err;
        }
    }

    /*static removeMemberPerms(member, perms) {
        //return MemberRemove(member.id, member.guild.id, perms);
        return new Promise((res, rej) => {
            MemberRemove(member.id, member.guild.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.memberNotFound) {
                    MemberCreate(member.id, member.guild.id).then(() => { res() }).catch(rej);
                }
            });
        });
    }*/
    static async removeMemberPerms(member, perms) {
        try {
            await MemberRemove(member.id, member.guild.id, perms)
            return;
        } catch(err) {
            if (err === util.error.memberNotFound) {
                await MemberCreate(member.id, member.guild.id)
                return;
            } else throw err;
        }
    }

    /*static addRolePerms(role, perms) {
        return new Promise((res, rej) => {
            RoleAdd(role.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.roleNotFound) {
                    RoleCreate(role.id, {
                        ps: perms
                    }).then(() => { res() }).catch(rej);
                }
            });
        });
    }*/
    static async addRolePerms(role, perms) {
        try {
            await RoleAdd(role.id, perms);
            return;
        } catch(err)  {
            if (err === util.error.roleNotFound) {
                await RoleCreate(role.id, { ps: perms });
                return;
            } else throw err;
        };
    }

    /*static removeRolePerms(role, perms) {
        //return MemberRemove(member.id, member.guild.id, perms);
        return new Promise((res, rej) => {
            RoleRemove(role.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.roleNotFound) {
                    RoleCreate(role.id).then(() => { res() }).catch(rej);
                }
            });
        });
    }*/
    static async removeRolePerms(role, perms) {
        try { 
            await RoleRemove(role.id, perms);
            return;
        } catch (err) {
            if (err === util.error.roleNotFound) {
                await RoleCreate(role.id);
                return;
            } else throw err;
        }
    }
}

module.exports = Perms;
