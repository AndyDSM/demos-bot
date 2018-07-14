const StateRouter = require('./StateRouter.js');
const State = require('./State.js');
const States = require('./States.js');
const Prefix = require('./Prefix.js');
const Parser = require('./CommandParser.js');
const DefaultCommandState = require('./StateDefaultCommand.js');
const InvalidCommandState = require('./StateInvalidCommand.js');
const C = require('../util/console.js');

class Router {

    static messageRoute(event, msg) {
        Prefix.get(msg.guild).then(prefix => {
            let route = new StateRouter();
            //C.logDev(States.channels.getStateRouter(msg.channel.id).state());
            route.appendStart([
                States.channels.getStateRouter(msg.channel.id).state(),
                States.guilds.getStateRouter(msg.guild.id).state(),
                DefaultCommandState,
                InvalidCommandState
            ]);
            //console.log(prefix);
            let cmdData = Parser.parseData(msg.content, prefix);
            //console.log(cmdData);
            route.run(event, cmdData, msg).catch(C.logError);
        }).catch(C.logError);
        /*Prefix.get(msg.guild).then(prefix => {
            return States.channels.getStateRouter(msg.channel.id).run(msg).then(handled => {
                //console.log('saf');
                if (handled) return true;
                else {
                    if (!msg.content.startsWith(prefix)) return;
                    let name = Parser.parseName(msg.content, prefix);
                    let f = CommandTree.list.get(name);
                    //console.log(Object.keys(f));
                    if (f === undefined) return;
                    else f.run(msg, prefix);
                }
            }).catch(e => C.logError(e));
        }).catch(e => C.logError(e));*/
    }

    static run(event) {
        switch (event) {
            case 'message':
                Router.messageRoute(...arguments);
                break;
            default:
                break;
        }
        return false;
    }

    static getMessageRoute(o) {
        let route = new StateRouter();
        let states = [];
        if (o.user) states.push(States.users.getStateRouter(o.user).state());
        if (o.channel) states.push(States.channels.getStateRouter(o.channel).state());
        if (o.guild) states.push(States.guilds.getStateRouter(o.guild).state());
        route.appendStart([
            ...states,
            DefaultCommandState,
            InvalidCommandState
        ]);
        return route;
    }

    static getRoute(event, o) {
        switch (event) {
            case 'message':
                return Router.getMessageRoute(o);
        }
        return new StateRouter();
    }

}

module.exports = Router;
