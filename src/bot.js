const db = require('./db/DB.js');
const C = require('./util/console.js');
const config = require('./util/config.json');
const util = require('./util/util.js');
const client = require('./disc/Discord.js');
const Router = require('./reactions/Router.js');

db.p.then(() => {

    client.on('ready', () => {
        C.log(`Logged in as ${client.user.tag}`);
        //C.log(client.guilds.get('462055788790284319'));
        //C.log(client.guilds);
    });

    client.on('guildCreate', (guild) => {
        require('./db/actions/GuildCheckById.js')(guild).then(exists => {
            if (!exists) require('./db/actions/GuildAdd.js')(guild).catch();
        }).catch();
    });

    client.on('message', msg => {
        if (msg.author.bot) return;
        //if (msg.content.startsWith())
        Router.run('message', msg);
        /*if (msg.content === 'marco') {
            msg.reply('polo you fucking bitch');
        }*/
    });

    client.login(config.discToken);

}).catch((err) => {
    C.logError(err);
});
