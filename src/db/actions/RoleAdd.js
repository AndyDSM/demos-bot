const Role = require('../models/Role.js').model;
const C = require('../../util/console.js');
const config = require('../../util/config.json');
const mongoose = require('../DB.js').m;
const util = require('../../util/util.js');

module.exports = function(id, o) {
    return new Promise(function(res, rej) {

        let roleProps = { id: id };
        let o = Object.assign({}, o);
        if (o.ps !== undefined) roleProps.ps = o.ps;

        let roleItem = new Role(roleProps);
        roleItem.save(function(err) {
            if (err) rej(util.error.dbError);
            else res(roleProps);
        });
    });
}
