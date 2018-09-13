const C = require('../util/console.js');
const sharedSession = require('express-socket.io-session');
const WSSessionManager = require('./WSSessionManager.js');
const WSEmitter = require('./WSEmitter.js');

class WS {
    static start(server, session) {
        C.log('WS Server started')
        WS.io = require('socket.io')(server);
        WS.io.use(sharedSession(session, {
            autoSave: true
        }))
        WS.io.on('connection', function(socket) {
            C.logDev('WS socket ' + socket.id + ' connected');
            if (socket.handshake.session.wsIDs === undefined) socket.handshake.session.wsIDs = [];
            socket.handshake.session.wsIDs.push(socket.id);
            socket.handshake.session.save();

            WSEmitter.toSessions(WS.io, [socket.handshake.session.id], 'pairConnection', { id: socket.id });

            //WSSessionManager.getSocket(WS.io, socket.handshake.session.id, '124124');

            socket.on('disconnect', function() {
                C.logDev('WS socket ' + socket.id + ' disconnected');
                WSSessionManager.removeID(socket.handshake.session.id, socket.id);
            });

        });
    }
}

module.exports = WS;
