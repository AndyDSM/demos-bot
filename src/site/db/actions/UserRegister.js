const User = require('../models/User.js').model;
const C = require('../../util/console.js');
const uuid = require('../../util/id.js');
const bcrypt = require('bcryptjs');

module.exports = function(req, res_) {
    let body = req.query;
    return new Promise(function(res, rej) {

        if (body.n_u === undefined || typeof body.n_u !== 'string') { res({ err: true, m: 'Username required.' }); return; }
        if (body.n_d === undefined || typeof body.n_d !== 'string') { res({ err: true, m: 'Display name required.' }); return; }
        if (body.pw === undefined || typeof body.pw !== 'string') { res({ err: true, m: 'Password required.' }); return; }
        if (body.pw_c === undefined || typeof body.pw_c !== 'string') { res({ err: true, m: 'Password confirmation required.' }); return; }

        if (body.pw !== body.pw_c) { res({ err: true, m: 'Passwords do not match.' }); return; }
        // pw.c = second password to confirm with

        let q = User.findOne({
            n_u: body.n_u
        }).exec((err, user) => {
            //C.logTest(err, user);
            if (err) { res({ err: true, m: 'Database error.' }); return; }
            if (user !== null) { res({ err: true, m: 'Username already taken.' }); return; }

            let userProps = Object.assign(body, { i: uuid(), pw: bcrypt.hashSync(body.pw, 10), c: new Date(), ip: req.connection.remoteAddress });
            delete userProps.pw_c;

            let userItem = new User(userProps);
            userItem.save(function(err) {
                if (err) { res({ err: true, m: 'Database error.' }); return; }
                res({ err: false, m: 'User creation successful.' });
                return;
            });

        });
    });
}
