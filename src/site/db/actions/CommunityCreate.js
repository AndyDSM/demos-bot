const Community = require('../models/Community.js').model;
const C = require('../../util/console.js');
const uuid = require('../../util/id.js');
const mongoose = require('../DB.js').m;

module.exports = function(req, res_) {
    let body = req.query || {};
    return new Promise(function(res, rej) {

        if (body.n_u === undefined || typeof body.n_u !== 'string') { res({ err: true, m: 'URL name required.' }); return; }
        if (body.n_d === undefined || typeof body.n_d !== 'string') { res({ err: true, m: 'Display name required.' }); return; }
        if (req.session.user === undefined) { res({ err: true, m: 'You must be logged in to perform this action.' }); return; }

        let q = Community.findOne({
            n_u: body.n_u
        }).exec((err, user) => {
            //C.logTest(err, user);
            if (err) { res({ err: true, m: 'Database error.' }); return; }
            if (user !== null) { res({ err: true, m: 'URL name already taken.' }); return; }

            C.logTest(req.session.user)
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

            let communityItem = new Community(communityProps);
            communityItem.save(function(err) {
                if (err) { res({ err: true, m: 'Database error.' }); return; }
                res({ err: false, m: 'Community creation successful.' });
                return;
            });

        });
    });
}
