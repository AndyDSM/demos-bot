const Guild = require('../_models/Guild.js').model;
const C = require('demos-console');
const util = require('demos-util');

module.exports = function(guildID) {
    return new Promise(function(res, rej) {
        Guild.findOne({ id: guildID }, 'id', function(err, g) {
            if (err) rej(util.error.dbError);
            else if (g === null) res(false);
            else res(true);
        });
    });
}
