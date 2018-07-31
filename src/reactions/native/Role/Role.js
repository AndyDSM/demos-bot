const Command = require('../../Command.js');
const C = require('../../../util/console.js');
const Parser = require('../../CommandParser.js');
const RoleObj = require('../../../obj/Role/Role.js');
const tinycolor = require('tinycolor2');
const util = require('../../../util/util.js');

const ChannelStates = require('../../States.js').channels;
const RoleConfirmState = require('./RoleConfirmState.js');

class RoleCommand extends Command {
    constructor() {
        super();
        this.desc = 'General role management.';
    }

    roleUse(cmdData, msg) {
        //C.logDev('lol');
        let role_ = Parser.mergeArgs(cmdData.args.splice(2));
        let role = RoleObj.parse(role_, msg.guild);
        if (role !== null) {
            if (role.length === 1) {
                msg.channel.send({
                    embed: {
                        color: role[0].color,
                        title: 'Role Info',
                        description: 'Name: ` ' + role[0].name +
                            ' `\nId: ` ' + role[0].id +
                            ' `\nColour: ` ' + tinycolor({ r: Math.floor(role[0].color / 65536) % 256, g: Math.floor(role[0].color / 256) % 256, b: role[0].color % 256 }).toHexString() +
                            ' `\nPosition: ` ' + role[0].position +
                            ' `\nMembers: ` ' + role[0].members.size + ' `'
                    }
                });
            } else {
                let description = '';
                for (let i = 0; i < role.length; i++) {
                    description += '`--- ' + i +
                        ' ---`\nName: ` ' + role[i].name +
                        ' `\nId: ` ' + role[i].id +
                        ' `\nColour: ` ' + tinycolor({ r: Math.floor(role[i].color / 65536) % 256, g: Math.floor(role[i].color / 256) % 256, b: role[i].color % 256 }).toHexString() +
                        ' `\nPosition: ` ' + role[i].position +
                        ' `\nMembers: ` ' + role[i].members.size + ' `' + (i === role.length - 1 ? '' : '\n\n')
                }
                msg.channel.send({
                    embed: {
                        color: 0x333333,
                        title: 'Multiple roles detected, type number 0 - ' + (role.length - 1) + ' to confirm.',
                        description: description
                    }
                }).then(() => {
                    let state = new RoleConfirmState();
                    state.props = {
                        roles: role,
                        msg: msg
                    }
                    ChannelStates.addState(msg.channel.id, state);
                }).catch(C.logError);
            }
        } else {
            msg.channel.send({
                embed: {
                    color: util.embed.colourError,
                    title: 'Invalid role.'
                }
            });
        }
        //C.logTest(role);
    }

    run(cmdData, msg) {
        C.logDev('yup');
        cmdData.getPerms().then(perms_ => {
            C.logDev(cmdData.args[1]);
            switch (cmdData.args[1]) {
                case 'use':
                    this.roleUse(cmdData, msg)
            }
        }).catch(C.logError);
    }
}

module.exports = RoleCommand;
