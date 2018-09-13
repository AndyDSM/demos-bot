const mongoose = require('../DB.js').m;

let communitySchema = mongoose.Schema({
    i: { type: String, index: true },
    u: { // community creator
        n_u: String, // username
        i: String, // id
    },
    n_u: String, // url name
    n_d: String, // display name
    c: Date, // creation time
    t: String,
    /* type/kind of community:
        'u' = user : user's posts, subscribe by following user, single user has access
        'g' = group : actual community, multiple users, etc.
    */
    ch: [], // chats
});
let Community = mongoose.model('communitie', communitySchema);

exports.schema = communitySchema;
exports.model = Community;
