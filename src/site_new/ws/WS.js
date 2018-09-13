const C = require('demos-console');
const sharedSession = require('express-socket.io-session');
const socket_io = require('socket.io');

class WS {

    constructor(io, server, session) {
        let io = io;
        let server = server;
        let session = session;
    }

    toSockets(sockets, events, args) {
        for (let s of sockets) {
            try {
                s.emit(eventName, args);
            } catch (e) {}
        }
    }

    toSocketsByID(socketIDs, events, args) {
        for (let s of socketIDs) {
            try {
                io.sockets.connected[s].emit(eventName, args);
            } catch (e) {}
        }
    }

}

module.exports = function(server, session) {

    let io = socket_io(server);
    let WS_overlay = new WS(io, server, session);

    let r_WS = new Proxy(io, {
        get: function (obj, prop) {
            if (prop in WS_overlay) return WS_overlay[prop];
            return obj[prop]
        }
    })

}
