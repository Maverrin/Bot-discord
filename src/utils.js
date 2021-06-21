/* eslint-disable max-len */
let fs = require('fs');
const quotes = require('../data/quotes.json');
const Discord = require('discord.js');


module.exports = {
    writeFile         : (absolutePath, str) => fs.writeFileSync(absolutePath, str),
    tryToSend         : (channel, text) => channel.send(text || 'Vous devez spécifier un texte.'),
    tryToSendChannelId: (client, channelId, text) => {
        const channel = client.channels.cache.get(channelId);
        if (!channel) throw new Error('Channel ID not found: ' + channelId);

        module.exports.tryToSend(channel, text);
    },
    getMemberCount: async (client, serverId = process.env.SERVER_ID) => {
        const guild = await client.guilds.fetch(serverId);
        const members = await guild.members.fetch();
        const memberCount = members.filter(member => member.user.bot === false).size;
        return memberCount;
    },
    updateClientActivity: (client) => {
        const serverId = process.env.SERVER_ID;
        return module.exports.getMemberCount(client, serverId).then(memberCount => {
            client.user.setActivity(memberCount + ' utilisateurs', {type: 'WATCHING'});
        });
    },
    addQuote: (username, msgContent) => {
        // clean user name, so only first word is used.
        // If the name has a space in it, it would not recognize it
        // as only the first word of command is understood by the bot
        username = username.split(' ')[0];
        if (quotes[username]) quotes[username].push(msgContent);
        else quotes[username] = [msgContent];

        module.exports.writeFile('data/quotes.json', JSON.stringify(quotes));

        console.log(`[QUOTE ADDED] A quote from ${username} has been saved`);
    },

    advertToEmbedUnpaid: (advert, user) => {
        const embed = new Discord.MessageEmbed();

        const mapping = {
            title      : (text) => embed.setTitle(text),
            description: (text) => embed.setDescription(text),
            contact    : (text) => embed.addField('**Contact**', text),
        };

        for (const key in advert) {
            if (['finish'].includes(key)) continue;

            if (key in mapping) mapping[key](advert[key]);
            else console.log(`'${key}' mapping not found in advertToEmbedUnpaid()`);
        }

        return {
            content: `Publié par : <@${user.id}>`,
            embed
        };
    },

    advertToEmbedPaid: (advert, user) => {
        const embed = new Discord.MessageEmbed();

        const mapping = {
            role  : () => embed.setTitle(`${advert.role} Chez ${advert.companyName}`),
            remote: (text) => {
                if (text == 1) embed.setDescription(':globe_with_meridians: Remote accepté');
            },
            localisation: (text) => embed.addField('**Localisation**', text, true),
            contract    : (text) => {
                if (text == 2) embed.addField('**Durée du contrat**', advert.length, true);
            },
            responsabilities: (text) => embed.addField('**Responsabilités**\n', text),
            qualifications  : (text) => embed.addField('**Qualifications**\n', text),
            apply           : (text) => embed.addField('**Comment postuler**\n', text),
            pay             : () => { },
            companyName     : () => { },
        };

        for (const key in advert) {
            if (['finish'].includes(key)) continue;

            if (key in mapping) mapping[key](advert[key]);
            else console.log(`'${key}' mapping not found in advertToEmbedPaid()`);
        }

        return {
            content: `Publié par : <@${user.id}>`,
            embed
        };
    },
    advertToEmbedFreelance: (advert, user) => {
        const embed = new Discord.MessageEmbed();

        const mapping = {
            title      : (text) => embed.setTitle(text),
            url        : (text) => embed.setDescription(text),
            description: (text) => embed.addField('**Services**\n', text),
            contact    : (text) => embed.addField('**Contact**\n', text),
        };

        for (const key in advert) {
            if (['finish'].includes(key)) continue;

            if (key in mapping) mapping[key](advert[key]);
            else console.log(`'${key}' mapping not found in advertToEmbedFreelance()`);
        }

        return {
            content: `Publié par : <@${user.id}>`,
            embed
        };
    }
};