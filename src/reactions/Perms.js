const MemberCreate = require('../db/actions/MemberAdd.js');
const MemberGet = require('../db/actions/MemberPermGet.js');
const MemberAdd = require('../db/actions/MemberPermAdd.js');
const MemberRemove = require('../db/actions/MemberPermRemove.js');
const RoleCreate = require('../db/actions/RoleAdd.js');
const RoleGet = require('../db/actions/RolePermGet.js');
const RoleAdd = require('../db/actions/RolePermAdd.js');
const RoleRemove = require('../db/actions/RolePermRemove.js');

const util = require('../util/util.js');

class Perms {

    constructor() {
        this.memberPerms = [];
        this.rolePerms = [];
        this.allPerms = [];
        this.perms_ = new Map();
    }

    hasPerm(perm) {
        let r = this.perms_.get(perm);
        return (r === undefined ? false : true);
    }

    static getResolvedPerms(perms) {
        let r = new Map();
        for (let i = perms.length - 1; i >= 0; i--) {
            for (let j = 0; j < perms[i].length; j++) {
                if (perms[i][j].charAt(0) === '-') r.set(perms[i][j].substring(1), false);
                r.set(perms[i][j], true);
            }
        }
        return r;
    }

    static getRoleIDsFromMember(member) {
        let r = [];
        for (let entry of member.roles[Symbol.iterator]()) {
            r.push(entry);
        }
        r.sort((a, b) => (a[1].calculatedPosition < b[1].calculatedPosition ? 1 : -1)); // highest role first
        //r = r.map(x => x[0]);
        return r;
    }

    static getRolePerms(member) {
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
    }

    static get(member) {
        return new Promise((res, rej) => {
            Promise.all([
                MemberGet(member.id, member.guild.id),
                Perms.getRolePerms(member)
            ]).then((vs) => {
                let r = new Perms();
                r.member = member;
                r.memberPerms = vs[0];
                r.rolePerms = vs[1];
                r.allPerms = [vs[0], ...vs[1].map(x => x[1])];
                r.perms_ = Perms.getResolvedPerms(r.allPerms);
                res(r);
            }).catch(rej);
        });
    }

    static addMemberPerms(member, perms) {
        return new Promise((res, rej) => {
            MemberAdd(member.id, member.guild.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.memberNotFound) {
                    MemberCreate(member.id, member.guild.id, {
                        ps: perms
                    }).then(() => { res() }).catch(rej);
                }
            });
        });
    }

    static removeMemberPerms(member, perms) {
        //return MemberRemove(member.id, member.guild.id, perms);
        return new Promise((res, rej) => {
            MemberRemove(member.id, member.guild.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.memberNotFound) {
                    MemberCreate(member.id, member.guild.id).then(() => { res() }).catch(rej);
                }
            });
        });
    }

    static addRolePerms(role, perms) {
        return new Promise((res, rej) => {
            RoleAdd(role.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.roleNotFound) {
                    RoleCreate(role.id, {
                        ps: perms
                    }).then(() => { res() }).catch(rej);
                }
            });
        });
    }

    static removeRolePerms(role, perms) {
        //return MemberRemove(member.id, member.guild.id, perms);
        return new Promise((res, rej) => {
            RoleRemove(role.id, perms).then(() => { res() }).catch((err) => {
                if (err === util.error.roleNotFound) {
                    RoleCreate(role.id).then(() => { res() }).catch(rej);
                }
            });
        });
    }
}

module.exports = Perms;
