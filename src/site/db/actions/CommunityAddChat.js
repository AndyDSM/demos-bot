const Community = require('../models/Community.js').model;
const Chat = require('../models/Chat.js').model;
const C = require('../../util/console.js');
const uuid = require('../../util/id.js');
const mongoose = require('../DB.js').m;

module.exports = function(req, res_) {
    let body = req.query || {};
    return new Promise(function(res, rej) {

        if (body.com_i === undefined || typeof body.com_i !== 'string') { res({ err: true, m: 'Community ID required.' }); return; }
        if (req.session.user === undefined) { res({ err: true, m: 'You must be logged in to perform this action.' }); return; }

        let chatProps = Object.assign({ i: uuid(), c: new Date() });

        let chatItem = new Chat(chatProps);
        chatItem.save(function(err) {
            if (err) { res({ err: true, m: 'Database error.' }); return; }

            Community.findOneAndUpdate({ i: body.com_i }, { $push: { "ch": chatProps.i } }, { safe: true, upsert: true, new: true },
                function(err, model) {
                    if (err) {
                        res({ err: true, m: 'Database error.' });
                        return;
                    } else {
                        res({ err: true, m: 'Chat added.' });
                        return;
                    }
                }
            );

        });
        /*let q = Community.findOne({
            i: body.com_i
        }).exec((err, com) => {
            //C.logTest(err, user);
            if (err) { res({ err: true, m: 'Database error.' }); return; }
            if (com === null) { res({ err: true, m: 'Community not found.' }); return; }

            C.logTest(req.session.user);
            let communityProps = Object.assign({
                i: uuid(),
                u: {
                    n_u: req.session.user.n_u,
                    i: req.session.user.i
                },
                n_u: body.n_u,
                n_d: body.n_d,
                c: new Date(),
                t: (body.type === 'u' ? 'u' : 'g')
            })

            com.update({}, { 'session.wsIDs': socketIDs }, function(err, raw) {
                if (err) {
                    rej(err);
                    return;
                }
                res();
            });

        });*/
    });
}
