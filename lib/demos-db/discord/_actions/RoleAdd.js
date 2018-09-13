const Role = require('../_models/Role.js').model;
const C = require('demos-console');
const util = require('demos-util');

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
