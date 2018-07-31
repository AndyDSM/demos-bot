const util = require('./util.js');
const C = require('./console.js');

exports.sendSuccess = function(channel, str) {
    return channel.send({
        "embed": {
            "title": str,
            "color": util.embed.colourSuccess
        }
    }).catch(C.logError);
}

exports.sendError = function(channel, str) {
    return channel.send({
        "embed": {
            "title": str,
            "color": util.embed.colourError
        }
    }).catch(C.logError);
}
