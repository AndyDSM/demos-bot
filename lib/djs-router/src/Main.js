const Router = require('./Router.js');

let events = [
    ['channelCreate', ['channel']],
    ['channelDelete', ['channel']],
    ['channelPinsUpdate', ['channel', 'time']],
    ['channelUpdate', ['oldChannel', 'newChannel']],
    ['clientUserGuildSettingsUpdate', ['clientUserGuildSettings']],
    ['clientUserSettingsUpdate', ['clientUserSettings']],
    ['debug', ['info']],
    ['disconnect', ['event']],
    ['emojiCreate', ['emoji']],
    ['emojiDelete', ['emoji']],
    ['emojiUpdate', ['oldEmoji', 'newEmoji']],
    ['error', ['error']],
    ['guildBanAdd', ['guild', 'user']],
    ['guildBanRemove', ['guild', 'user']],
    ['guildCreate', ['guild']],
    ['guildDelete', ['guild']],
    ['guildMemberAdd', ['member']],
    ['guildMemberAvailable', ['member']],
    ['guildMemberRemove', ['member']],
    ['guildMembersChunk', ['member', 'guild']],
    ['guildMemberSpeaking', ['member', 'speaking']],
    ['guildMemberUpdate', ['oldMember', 'newMember']],
    ['guildUnavailable', ['guild']],
    ['guildUpdate', ['oldGuild', 'newGuild']],
    ['message', ['message']],
    ['messageDelete', ['message']],
    ['messageDeleteBulk', ['messages']],
    ['messageReactionAdd', ['messageReaction', 'user']],
    ['messageReactionRemove', ['messageReaction', 'user']],
    ['messageReactionRemoveAll', ['message']],
    ['messageUpdate', ['oldMessage', 'newMessage']],
    ['presenceUpdate', ['oldMember', 'newMember']],
    ['ready', []],
    ['reconnecting', []],
    ['resume', ['replayed']],
    ['roleCreate', ['role']],
    ['roleDelete', ['role']],
    ['roleUpdate', ['oldRole', 'newRole']],
    ['typingStart', ['channel', 'user']],
    ['typingStop', ['channel', 'user']],
    ['userNoteUpdate', ['user', 'oldNote', 'newNote']],
    ['userUpdate', ['oldUser', 'newUser']],
    ['voiceStateUpdate', ['oldMember', 'newMember']],
    ['warn', ['info']]
]

let Main = function(client) {
    let r = new Router();

    for (let e of events) {
        client.on(e[0], function() {
            let data = { args: arguments };
            for (let arg in e[1]) {
                data[e[1][arg]] = arguments[arg];
            }
            r.route(e[0], data);
        });
    }

    r.login = function(token) { client.login(token) };

    return r;
}

Main.Router = Router;
Main.Symbol = require('./Symbol.js');

module.exports = Main;
