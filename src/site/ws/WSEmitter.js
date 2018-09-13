const WSSessionManager = require('./WSSessionManager.js');
const C = require('../util/console.js');
const ArrayUtil = require('../util/array.js');

class WSEmitter {
    static toSockets(io, sockets, eventName, args) {
        for (let i = 0; i < sockets.length; i++) {
            try {
                sockets[i].emit(eventName, args);
            } catch (e) {}
        }
    }
    static toSessions(io, sessions, eventName, args) {
        let sessionPromises = [];
        for (let i = 0; i < sessions.length; i++) {
            sessionPromises.push(WSSessionManager.getSocketsBySessionID(io, sessions[i]));
        }
        return Promise.all(sessionPromises).then((sockets) => {
            for (let i = 0; i < sockets.length; i++) {
                WSEmitter.toSockets(io, sockets[i], eventName, args);
            }
        })
    }
}

module.exports = WSEmitter;
