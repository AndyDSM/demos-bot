module.exports = function(req, res_) {
    return new Promise(function(res, rej) {
        res({ err: false, m: 'Sockets returned.', data: req.session.wsIDs });
    });
}
