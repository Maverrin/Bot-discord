const Discord = require('discord.js');

module.exports = {
    getMemberCount      : (client, serverId) => client.guilds.cache.get(serverId).memberCount,
    updateClientActivity: (client) => {
        // const serverId = process.env.SERVER_ID 
        // const memberCount = getMemberCount(client, serverId).toString();
        // client.user.setActivity(memberCount, {type: 'WATCHING'});
    },
    tryToSend: (channel, text) => {
        if (!!text === false) channel.send('You did not send any text, please specify your request.');
        channel.send(text);
    },
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
};