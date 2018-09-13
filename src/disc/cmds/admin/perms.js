const Router = require('djs-router').Router;
const Embed = require('demos-util/discord/embed');

let PermRouter = new Router();

PermRouter.stop((data, next) => {

    next();
});

module.exports = PermRouter;