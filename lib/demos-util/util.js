exports.error = {
    guildNotFound: 'DBError: Guild not found, please add to database',
    memberNotFound: 'DBError: Member not found, please add to database',
    roleAccessoryNotFound: 'DBError: Member does not have an accessory role, please add to database',
    roleNotFound: 'DBError: Role not found, please add to database',
    permsNotFound: 'DBError: Perms were not found in query, please add to database',
    pollNotFound: 'DBError: Poll not found in database, please add if necessary',
    voteNotFound: 'DBError: Vote not found, please add to database',
    dbError: 'DBError: There was an error communicating with the database'
};

exports.sleep = (t) => {
    return new Promise(res => {
        setInterval(() => {
            res()
        }, t);
    });
}

exports.range = function* (n) {
    let i = 0;
    while(i < n) yield i++;
}

const uuidv4 = require('uuid/v4');
exports.uuid = function() {
    return uuidv4().replace(/-/g, '');
}


