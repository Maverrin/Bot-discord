/* eslint-disable max-len */

const Discord = require('discord.js');
let fs = require('fs');
const quotes = require('./quotes');


module.exports = {
    getMemberCount      : async (client, serverId = process.env.SERVER_ID) => {
        const guild = await client.guilds.fetch(serverId)
        const members = await guild.members.fetch()
        const memberCount = members.filter(member => member.user.bot === false).size
        return memberCount
    },
    updateClientActivity: (client) => {
        const serverId = process.env.SERVER_ID 
        return module.exports.getMemberCount(client, serverId).then(memberCount => {
            client.user.setActivity(memberCount + " utilisateurs", {type: 'WATCHING'});
        });
    },
    tryToSend       : (channel, text) => channel.send(text || 'You did not send any text, please specify your request.'),
    sendEmbedMessage: (client, data, channelId = null) => {
        const {title, author, description, color, footer} = data;
    
        const embed = new Discord.MessageEmbed();
        if (title) embed.setTitle(title);
        if (author) embed.setAuthor(author.name, author.iconUrl);
        if (description) embed.setDescription(description);
        if (color) embed.setColor(color);
        if (footer) embed.setFooter(footer);

        const channel = data.channel || client.channels.cache.get(channelId);
        if (!channel) throw new Error('Wrong channel information');

        channel.send(embed);
    },
    addQuote: (username, msgContent) => {
        // clean user name, so only first word is used.
        // If the name has a space in it, it would not recognize it
        // as only the first word of command is understood by bot
        username = username.split(' ')[0];
        if (quotes[username]) quotes[username].push(msgContent);
        else quotes[username] = [msgContent];

        fs.writeFile('quotes.json', JSON.stringify(quotes), 'utf8', function (err) {
            if (err) return console.log(err);
            console.log(`[QUOTE ADDED] A quote from ${username} has been saved`);
        });    
    }
};