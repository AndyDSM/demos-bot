const StateRouter = require('./StateRouter.js');
const State = require('./State.js');
const States = require('./States.js');
const Prefix = require('./Prefix.js');
const Parser = require('./CommandParser.js');
const DefaultCommandState = require('./StateDefaultCommand.js');
const InvalidCommandState = require('./StateInvalidCommand.js');
const CommandData = require('./CommandData.js');
const C = require('../util/console.js');

class Router {

    static messageRoute(event, msg) {

        CommandData.get(msg).then(cmdData => {

            let route = new StateRouter();

            route.appendStart([DefaultCommandState, InvalidCommandState]);
            if (cmdData.guild) route.appendStart([States.guilds.getStateRouter(msg.guild.id).state()]);
            route.appendStart([States.channels.getStateRouter(msg.channel.id).state()]);

            //C.logDev(cmdData);
            route.run(event, cmdData, msg).catch(C.logError);

        }).catch(C.logError);

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

    /*static getMessageRoute(o) {
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
    }*/

}

module.exports = Router;
