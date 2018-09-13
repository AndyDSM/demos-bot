const SessionModel = require('../_models/Session.js').model;
const util = require('demos-util');
const C = require('demos-console');

let SessionMem = {
    Sockets: new Map(),
};

class Session {

    // get socket from ram
    static getSocketsByID(id) {
        let r = SessionMem.Sockets.get(id);
        return ( r instanceof Array ? r : [] );
    }
    static setSocketsByID(id, ss = []) {
        if (ss instanceof Array) SessionMem.Sockets.set(id,ss);
    }
    static addSocketsByID(id, ss = []) {
        if (ss instanceof Array) {
            let s = SessionMem.Sockets.get(id);
            if (s instanceof Array) s.splice(s.length,0,...ss);
            else SessionMem.Sockets.set(id,ss)
        }
    }
    static removeSocketsByID(id, ss = []) {
        if (ss instanceof Array) {
            let s = SessionMem.Sockets.get(id);
            if (s instanceof Array) {
                for (let i = s.length-1; i >= 0; i--) {
                    if (ss.includes(s[i])) s.splice(i,1);
                }
                if (s.length === 0) SessionMem.Sockets.delete(id);
            }
        }
    }

    // mongoDB funcs
    static async getByID_DB(id) {
        return await SessionModel.findOne({_id:id}).exec();
    }

    static async getSocketsByID_DB(id) {
        try {
            let s = await SessionModel.findOne({_id:id}, 'session.wsIDs').exec();
            return s.session.wsIDs || [];
        } catch (e) { throw util.error.dbError; }
    }
    static async setSocketsByID_DB(id, ss = []) {
        try {
            if (ss instanceof Array) await SessionModel.findOneAndUpdate({id: id}, { $set: { 'session.wsIDs': ss } }).exec();
            else throw '';
        } catch (e) { throw util.error.dbError; }
    }
    static async addSocketsByID_DB(id, ss = []) {
        try {
            if (ss instanceof Array) await SessionModel.findOneAndUpdate({id: id}, { $addToSet: { 'session.wsIDs': ss } }).exec();
            else throw '';
        } catch (e) { throw util.error.dbError; }
    }
    static async removeSocketsByID_DB(id, ss = []) {
        try {
            let q = {};
            switch (ss.length) {
                case 0: return;
                case 1: q = { 'session.wsIDs': ss[0] }; break;
                default: q = { 'session.wsIDs': { $in: ss } };
            }
            if (ss instanceof Array) await SessionModel.findOneAndUpdate({id: id}, { $pull: q }, { multi: true }).exec();
            else throw '';
        } catch (e) { throw util.error.dbError; }
    }

}

module.exports = Session;