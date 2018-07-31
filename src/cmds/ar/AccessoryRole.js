const Command = require('../../cmd/Command.js');
const C = require('../../util/console.js');
const Parser = require('../../reactions/CommandParser.js');
const util = require('../../util/util.js');
const Embed = require('../../util/embed.js');
const tinycolor = require('tinycolor2');
const AccessoryRole = require('../../obj/RoleAccessory.js');
const Router = require('../../router/Main.js').Router;

let RoleAccessoryRouter = new Router();

RoleAccessoryRouter.stop((data, next) => {
    if (data.cmdArgs.length <= 1) {
        Embed.sendError(data.message.channel, "Valid arguments are ' `name` ' or ' `colour` '");
        next(false);
    } else next();
});

let NameColourRouter = new Router();

NameColourRouter.stop(/^name$|^n$/, (data, next) => {
    try {
        let name = Parser.mergeArgs(data.cmdArgs.splice(2));
        AccessoryRole.getByMember(data.message.member).then(role => {
            role.setName(name).then(() => {
                data.message.member.addRole(role).then(() => {
                    Embed.sendSuccess(data.message.channel, "Role name changed to ' `" + name + "` '.");
                }).catch();
            }).catch(err => { Embed.sendError(data.message.channel, "Error connecting with database, please try again."); });
        });
    } catch (err) { Embed.sendError(data.message.channel, "Invalid command input."); }
    next();
});

NameColourRouter.stop(/^colour$|^color$|^clr$|^c$/, (data, next) => {
    try {
        let colour = tinycolor(Parser.mergeArgs(data.cmdArgs.splice(2)));
        if (colour.isValid()) {
            //C.logDev('hey');
            AccessoryRole.getByMember(data.message.member).then(role => {
                role.setColor('#' + colour.toHex()).then(() => {
                    data.message.member.addRole(role).then(() => {
                        data.message.channel.send('', {
                            "embed": {
                                "title": "Name colour changed to ' ` " + colour.getOriginalInput() + "` '.",
                                "color": parseInt(colour.toHex(), 16)
                            }
                        }).catch(C.logError);
                    }).catch();
                }).catch(err => {
                    Embed.sendError(data.message.channel, "Error connecting with Demos database, please try again.");
                });
            })
        } else Embed.sendError(data.message.channel, "Invalid colour format.");
    } catch (err) { Embed.sendError(data.message.channel, "Invalid command input."); }
    next();
});

NameColourRouter.keyer(data => data.cmdArgs[1]);
NameColourRouter.continue({
    nonEmpty: false
});

RoleAccessoryRouter.stop(NameColourRouter);

RoleAccessoryRouter.stop((data, next) => {
    Embed.sendError(data.message.channel, "Incorrect argument, valid arguments are ' `name` ' or ' `colour` '");
    next();
});

let RoleAccessoryCommand = new Command('ar', RoleAccessoryRouter, {
    desc: 'Role accessory management.'
});

module.exports = RoleAccessoryCommand;
