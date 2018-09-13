const User = require('../models/User.js').model;
const C = require('../../util/console.js');
const bcrypt = require('bcryptjs');

module.exports = function(req, res_) {
    let body = req.query || {};
    return new Promise(function(res, rej) {

        if (body.n_u === undefined || typeof body.n_u !== 'string') { res({ err: true, m: 'Username required.' }); return; }
        if (body.pw === undefined || typeof body.pw !== 'string') { res({ err: true, m: 'Password required.' }); return; }

        let q = User.findOne({
            n_u: body.n_u
        }).exec((err, user) => {
            //C.logTest(err, user);
            if (err) { res({ err: true, m: 'Database error.' }); return; }
            if (user === null) { res({ err: true, m: 'Username not found.' }); return; }

            if (!bcrypt.compareSync(body.pw, user.pw)) { res({ err: true, m: 'Password incorrect.' }); return; }
            req.session.user = {
                n_u: user.n_u,
                i: user.i
            }
            res({ err: false, m: 'Login successful.' });
            return;

        });
    });
}
