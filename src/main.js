const DB = require('demos-db/start');
const config = require('demos-config');

DB(config.db).then(() => {
    require('./disc/bot.js');
    require('./site_new/main.js');
});

//