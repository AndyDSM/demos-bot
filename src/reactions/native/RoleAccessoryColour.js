const Command = require('../Command.js');
//const CommandTree = require('../../commands/Tree.js');
const C = require('../../util/console.js');
const Parser = require('../CommandParser.js');
const Client = require('../../disc/Discord.js');
const util = require('../../util/util.js');

class RoleAccessoryColourCommand extends Command {
    constructor() {
        super();
        this.desc = 'Pings you.';
    }

    run(cmdData, msg) {
        //console.log(msg);
        try {
            let args = Parser.parseArgs(msg.content, cmdData.prefix);
            let colour = args[1].toUpperCase();
            let colourValid = this.validColour(colour);
            if (colourValid) {
                this.getRole(msg.member).then(role => {
                    role.setColor(colour).then(() => {
                        msg.member.addRole(role).then(() => {
                            msg.channel.send('', {
                                "embed": {
                                    "title": "Name colour changed to ' `" + colour + "` '.",
                                    "color": util.embed.colourSuccess
                                }
                            }).catch(C.logError);
                        }).catch();
                    }).catch(err => {
                        msg.channel.send('', {
                            "embed": {
                                "title": "Error connecting with Demos database, please try again.",
                                "color": util.embed.colourError
                            }
                        }).catch(C.logError);
                    });
                })
            } else {
                msg.channel.send('', {
                    "embed": {
                        "title": "Invalid colour format. Give colour in hex format, `#XXXXXX`.",
                        "color": util.embed.colourError
                    }
                }).catch(C.logError);
            }
        } catch (err) {
            C.logError(err);
            msg.channel.send('', {
                "embed": {
                    "title": "Invalid command input.",
                    "color": util.embed.colourError
                }
            }).catch(C.logError);
        }
    }

    validColour(colour) {
        return colour.charAt(0) === '#' && colour.substring(1).search(/[^0123456789ABCDEF]/) === -1 && colour.length === 7;
    }

    getRole(member) {
        return new Promise((res, rej) => {
            require('../../db/actions/MemberGetRole.js')(member).then(roleID => {
                try {
                    //console.log('yup');
                    let role = member.guild.roles.get(roleID);
                    if (role === undefined) throw '';
                    res(role);
                } catch (e) {
                    this.createRole(member).then(role => {
                        res(role);
                    }).catch(err => { rej(err); });
                }
            }).catch(err => {
                if (err === util.error.memberNotFound) {
                    this.createMember(member).then(role => {
                        res(role);
                    }).catch(err => { rej(err); });
                } else if (err === util.error.roleAccessoryNotFound) {
                    this.createRole(member).then(role => {
                        res(role);
                    }).catch(err => { rej(err); });
                } else rej(err);
            });
        });
    }

    createMember(member) {
        return new Promise((res, rej) => {
            member.guild.createRole().then(role => role.setPosition(member.guild.roles.size - 2)).then(role => {
                require('../../db/actions/MemberAdd.js')(member, role).then(() => {
                    res(role);
                }).catch(err => { rej(err); });
            }).catch(err => { rej(err); });
        });
    }

    createRole(member) {
        return new Promise((res, rej) => {
            member.guild.createRole().then(role => role.setPosition(member.guild.roles.size - 2)).then(role => {
                require('../../db/actions/MemberAddRole.js')(member, role).then(() => {
                    res(role);
                }).catch(err => { rej(err); });
            }).catch(err => { rej(err); });
        });
    }
}

module.exports = RoleAccessoryColourCommand;
