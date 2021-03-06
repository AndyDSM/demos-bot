const Command = require('djs-router/cmd');
const C = require('demos-console');
const Parser = require('demos-util/discord/cmdParser');
const util = require('demos-util');
const Embed = require('demos-util/discord/embed');
const tinycolor = require('tinycolor2');
const AccessoryRole = require('demos-db/discord/role-accessory');
const Router = require('djs-router').Router;

let RoleAccessoryRouter = new Router();

RoleAccessoryRouter.stop((data, next) => {
    if (data.cmdArgs.length <= 1) {
        Embed.sendError(data.message.channel, "Valid arguments are ' `name` ' or ' `colour` '");
        next(false);
    } else next();
});

let NameColourRouter = new Router();

NameColourRouter.stop(/^name$|^n$/, async (data, next) => {
    let name, role;
    try {
        name = data.cmdArgs.slice(2).reduce((a,x) => a+' '+x);
        role = await AccessoryRole.getByMember(data.message.member);
    } catch (err) { await Embed.sendError(data.message.channel, "Invalid command input."); next(); return; }
    try {
        await role.setName(name);
        await data.message.member.addRole(role);
        await Embed.sendSuccess(data.message.channel, "Role name changed to ' `" + name + "` '.");
        next();
    } catch (err) { C.logError(err); await Embed.sendError(data.message.channel, "Error connecting with database, please try again."); next(); }
});

NameColourRouter.stop(/^colour$|^color$|^clr$|^c$/, async (data, next) => {
    let colour, role;

    try { colour = tinycolor(data.cmdArgs.slice(2).reduce((a,x) => a+' '+x)); } 
    catch (err) { await Embed.sendError(data.message.channel, "Invalid command input."); next(); return; }

    if (colour.isValid()) {
        try { 
            role = await AccessoryRole.getByMember(data.message.member); 
            await role.setColor('#' + colour.toHex());
            await data.message.member.addRole(role);
            await data.message.channel.send('', {
                "embed": {
                    "title": "Name colour changed to ' ` " + colour.getOriginalInput() + "` '.",
                    "color": parseInt(colour.toHex(), 16)
                }
            });
            next();
        }
        catch (err) { await Embed.sendError(data.message.channel, "Error connecting with Demos database, please try again."); next(); }
    } else { await Embed.sendError(data.message.channel, "Invalid colour format."); next(); }
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
