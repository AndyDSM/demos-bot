const Session = require('./WSSession.js');
const C = require('../util/console.js');
const ArrayUtil = require('../util/array.js');

class WSSessionManager {

    static getSocketIDs(sessionID) {
        return new Promise((res, rej) => {
            Session.findOne({ '_id': sessionID }, 'session.wsIDs', function(err, session) {
                if (err) {
                    //C.logError('Session retrieve at WSSessionManager failed. \n', err);
                    rej(err);
                    return;
                }
                res(session.session.wsIDs);
            });
        })
    }

    static setSocketIDs(sessionID, socketIDs) {
        return new Promise(function(res, rej) {
            Session.update({ '_id': sessionID }, { 'session.wsIDs': socketIDs }, {}, function(err, raw) {
                if (err) {
                    rej(err);
                    return;
                }
                res();
            });
        });
    }

    static removeID(sessionID, socketID) {
        return WSSessionManager.getSocketIDs(sessionID).then((IDs) => {
            let IDPos = IDs.indexOf(socketID);
            if (IDPos !== -1) {
                IDs.splice(IDPos, 1);
                return WSSessionManager.setSocketIDs(sessionID, IDs);
            }
        }).catch((err) => {
            C.logError('Session retrieve at WSSessionManager failed. \n', err);
        });
    }

    static getSocketsBySessionID(io, sessionID) { // get all alive sockets, remove dead ones from session data
        return WSSessionManager.getSocketIDs(sessionID).then((IDs_) => {
            let IDs = ArrayUtil.removeDups(IDs_);
            let rSockets = []; // returned sockets
            let rIDs = []; // returned socket IDs
            let changed = false; // whether db rewrite needs to happen
            for (let i = 0; i < IDs.length; i++) {
                let r = io.sockets.connected[IDs[i]];
                if (r === undefined) {
                    changed = true;
                    continue;
                } else if (r.handshake.session.id !== sessionID) {
                    changed = true;
                    continue;
                } else {
                    rSockets.push(r);
                    rIDs.push(IDs[i]);
                }
            }
            //C.logDev('ids: ', rIDs);
            if (changed) return WSSessionManager.setSocketIDs(sessionID, rIDs).then(() => rSockets);
            else return rSockets;
        });
    }

    static getSocket(io, sessionID, socketID) {
        let r = io.sockets.connected[socketID];
        if (r === undefined) WSSessionManager.removeID(sessionID, socketID);
        else return r;
    }

}

module.exports = WSSessionManager;
