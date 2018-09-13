const C = require('demos-console');

exports.colour = {
    success: 5237624,
    error: 16737123,
}

exports.sendSuccess = function(channel, str) {
    return channel.send({
        "embed": {
            "title": str,
            "color": exports.colour.success
        }
    }).catch(C.logError);
}

exports.sendError = function(channel, str) {
    return channel.send({
        "embed": {
            "title": str,
            "color": exports.colour.error
        }
    }).catch(C.logError);
}