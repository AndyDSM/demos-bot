const User = require('../models/User.js').model;
const C = require('../../util/console.js');
const bcrypt = require('bcryptjs');

module.exports = function(req, res_) {
    let body = req.query || {};
    return new Promise(function(res, rej) {
        delete req.session.user;
        res({ err: false, m: 'Logout successful.' });
    });
}
