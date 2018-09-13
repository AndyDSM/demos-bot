const Discord = require('discord.js');
const client = require('demos-discClient');
const config = require('demos-config');

const Member = require('../member');
const Role = require('../role');

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

    static getRolesByMember(member) {
        let r = [];
        for (let [k,entry] of member.roles) r.push(entry);
        r.sort((a, b) => (a.calculatedPosition < b.calculatedPosition ? 1 : -1)); // highest role first
        return r;
    }

    static async getRolePermsByMember(member) {
        let roles = Perms.getRolesByMember(member);
        let DBroles = await Role.getPerms(roles);
        let r = [];
        for (let role of roles) {
            let r_ = [role, []];
            for (let DBrole of DBroles) {
                if (role.id === DBrole.id) {
                    r_[1] = DBrole.ps;
                    break;
                }
            }
            r.push(r_);
        }
        return r;
    }

    static getResolvedPerms(perms) {
        let r = new Map();
        for (let i = perms.length - 1; i >= 0; i--) {
            for (let p of perms[i]) {
                if (p.charAt(0) === '-') r.delete(p.substring(1));
                else r.set(p, true);
            }
        }
        return r;
    }

    static async get(member) {
        let [memberPerms, rolePerms] = await Promise.all([
                Member.getPerms(member),
                Perms.getRolePermsByMember(member),
            ]);
        let r = new Perms();
        r.member = member;
        r.memberPerms = memberPerms;
        r.rolePerms = rolePerms;
        r.allPerms = [memberPerms, ...rolePerms.map(x => x[1])];
        r.perms_ = Perms.getResolvedPerms(r.allPerms);
        r.isAdmin = member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR);
        r.isOwner = member.guild.ownerID === member.id;
        r.isBotOwner = member.id === config.discord.ownerID;
        return r;
    }

    static async getByMemberIDs(uid, gid) {
        let member;
        try {
            member = client.guilds.get(gid).members.get(uid);
            return await Perms.get(member);
        } catch (e) {
            C.logDev(e);
            return null;
        }
    }

}

module.exports = Perms;