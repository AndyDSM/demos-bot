const D = require('djs-router');
const Router = D.Router;
const Sym = D.Symbol;
const C = require('demos-console');

/*
        case 'channelCreate':
        case 'channelDelete':
        case 'channelPinsUpdate':
        case 'channelUpdate':
        case 'clientUserGuildSettingsUpdate':
        case 'clientUserSettingsUpdate':
        case 'debug':
        case 'disconnect':
        case 'emojiCreate':
        case 'emojiDelete':
        case 'emojiUpdate':
        case 'error':
        case 'guildBanAdd':
        case 'guildBanRemove':
        case 'guildCreate':
        case 'guildDelete':
        case 'guildMemberAdd':
        case 'guildMemberAvailable':
        case 'guildMemberRemove':
        case 'guildMembersChunk':
        case 'guildMemberSpeaking':
        case 'guildMemberUpdate':
        case 'guildUnavailable':
        case 'guildUpdate':
        case 'message':
        case 'messageDelete':
        case 'messageDeleteBulk':
        case 'messageReactionAdd':
        case 'messageReactionRemove':
        case 'messageReactionRemoveAll':
        case 'messageUpdate':
        case 'presenceUpdate':
        case 'ready':
        case 'reconnecting':
        case 'resume':
        case 'roleCreate':
        case 'roleDelete':
        case 'roleUpdate':
        case 'typingStart':
        case 'typingStop':
        case 'userNoteUpdate':
        case 'userUpdate':
        case 'voiceStateUpdate':
        case 'warn':
*/

let userRouter = new Router();
userRouter.keyer(data => {
    try {
        switch (data.key) {
            case 'guildBanAdd':
                return data.user.id;
            case 'guildBanRemove':
                return data.user.id;
            case 'guildMemberAdd':
                return data.member.id;
            case 'guildMemberAvailable':
                return data.member.id;
            case 'guildMemberRemove':
                return data.member.id;
            case 'guildMemberSpeaking':
                return data.member.id;
            case 'guildMemberUpdate':
                return data.newMember.id;
            case 'message':
                return data.message.author.id;
            case 'messageDelete':
                return data.message.author.id;
            case 'messageReactionAdd':
                return data.user.id;
            case 'messageReactionRemove':
                return data.user.id;
            case 'messageReactionRemoveAll':
                return data.message.author.id;
            case 'messageUpdate':
                return data.newMessage.author.id;
            case 'presenceUpdate':
                return data.newMember.id;
            case 'typingStart':
                return data.user.id;
            case 'typingStop':
                return data.user.id;
            case 'userNoteUpdate':
                return data.user.id;
            case 'userUpdate':
                return data.newUser.id;
            case 'voiceStateUpdate':
                return data.newMember.id;
            default:
                return Sym.skipRouter;
        }
    } catch (e) {
        C.logError(e);
        return Sym.skipRouter;
    }
});
//userRouter.deletable(true);

let channelRouter = new Router();
channelRouter.keyer(data => {
    try {
        switch (data.key) {
            case 'channelCreate':
                return data.channel.id;
            case 'channelDelete':
                return data.channel.id;
            case 'channelPinsUpdate':
                return data.channel.id;
            case 'channelUpdate':
                return data.newChannel.id;
            case 'message':
                return data.message.channel.id;
            case 'messageDelete':
                return data.message.channel.id;
                //case 'messageDeleteBulk':
            case 'messageReactionAdd':
                return data.messageReaction.message.channel.id;
            case 'messageReactionRemove':
                return data.messageReaction.message.channel.id;
            case 'messageReactionRemoveAll':
                return data.message.channel.id;
            case 'messageUpdate':
                return data.newMessage.channel.id;
            case 'typingStart':
                return data.channel.id;
            case 'typingStop':
                return data.channel.id;
            default:
                return Sym.skipRouter;
        }
    } catch (e) {
        C.logError(e);
        return Sym.skipRouter;
    }
});
//channelRouter.deletable(true);

let guildRouter = new Router();
guildRouter.keyer(data => {
    try {
        switch (data.key) {
            case 'channelCreate':
                return (data.channel.type === 'text' ? data.channel.guild.id : Sym.skipRouter);
            case 'channelDelete':
                return (data.channel.type === 'text' ? data.channel.guild.id : Sym.skipRouter);
            case 'channelPinsUpdate':
                return (data.channel.type === 'text' ? data.channel.guild.id : Sym.skipRouter);
            case 'channelUpdate':
                return (data.newChannel.type === 'text' ? data.newChannel.guild.id : Sym.skipRouter);
            case 'clientUserGuildSettingsUpdate':
                return data.clientUserGuildSettings.guildID;
            case 'emojiCreate':
                return data.emoji.guild.id;
            case 'emojiDelete':
                return data.emoji.guild.id;
            case 'emojiUpdate':
                return data.newEmoji.guild.id;
            case 'guildBanAdd':
                return data.guild.id;
            case 'guildBanRemove':
                return data.guild.id;
            case 'guildCreate':
                return data.guild.id;
            case 'guildDelete':
                return data.guild.id;
            case 'guildMemberAdd':
                return data.member.guild.id;
            case 'guildMemberAvailable':
                return data.member.guild.id;
            case 'guildMemberRemove':
                return data.member.guild.id;
            case 'guildMembersChunk':
                return data.guild.id;
            case 'guildMemberSpeaking':
                return data.member.guild.id;
            case 'guildMemberUpdate':
                return data.newMember.guild.id;
            case 'guildUnavailable':
                return data.guild.id;
            case 'guildUpdate':
                return data.newGuild.id;
            case 'message':
                return (data.message.channel.type === 'text' ? data.message.guild.id : Sym.skipRouter);
            case 'messageDelete':
                return (data.message.channel.type === 'text' ? data.message.guild.id : Sym.skipRouter);
                //case 'messageDeleteBulk':
            case 'messageReactionAdd':
                return (data.messageReaction.message.channel.type === 'text' ? data.messageReaction.message.guild.id : Sym.skipRouter);
            case 'messageReactionRemove':
                return (data.messageReaction.message.channel.type === 'text' ? data.messageReaction.message.guild.id : Sym.skipRouter);
            case 'messageReactionRemoveAll':
                return (data.message.channel.type === 'text' ? data.message.guild.id : Sym.skipRouter);
            case 'messageUpdate':
                return (data.newMessage.channel.type === 'text' ? data.newMessage.guild.id : Sym.skipRouter);
            case 'presenceUpdate':
                return data.newMember.guild.id;
            case 'roleCreate':
                return data.role.guild.id;
            case 'roleDelete':
                return data.role.guild.id;
            case 'roleUpdate':
                return data.newRole.guild.id;
            case 'typingStart':
                return (data.channel.type === 'text' ? data.channel.guild.id : Sym.skipRouter);
            case 'typingStop':
                return (data.channel.type === 'text' ? data.channel.guild.id : Sym.skipRouter);
            case 'voiceStateUpdate':
                return data.newMember.guild.id;
            default:
                return Sym.skipRouter;
        }
    } catch (e) {
        C.logError(e);
        return Sym.skipRouter;
    }
});
//guildRouter.deletable(true);

module.exports = {
    guildRouter: guildRouter,
    channelRouter: channelRouter,
    userRouter: userRouter,
}
