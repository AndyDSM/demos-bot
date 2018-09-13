
class Channel {

    static fromName(channelname, guild) {
        let r = [];
        let channelname_ = channelname.toUpperCase();
        for (let [id, channel] of guild.channels) {
            if (channel.name.toUpperCase() === channelname_) r.push(channel);
        }
        return r;
    }

    static fromText(channelname, guild) {
        //C.logDev(rolename);
        let channelID = (channelname).match(/\d+/);
        if ((/^<#\d+>$/).test(channelname) || (channelID !== null && channelID[0] === channelname)) {
            let r = guild.channels.get(channelID[0]);
            if (r !== undefined) return [r];
        } 
        let r = Channel.fromName(channelname, guild);
        return (r.length === 0 ? null : r);
    }

}

module.exports = Channel;