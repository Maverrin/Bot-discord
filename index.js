require('dotenv').config();
const commands = require('./commands');
const botConfig = require('./botConfig');
const quotes = require('./quotes');

const Discord = require('discord.js');
const client = new Discord.Client();

const serverId = '384349653254275082';
const logChannel = '835143486176362527';


client.on('ready', () => {
    // if the bot is actually not connected to the specific server
    if (!client.guilds.cache.has(serverId)){
        console.log('[LOGOUT] Not connected to any server');
        return client.destroy();
    }

    console.log(`[LOGIN] Logged in as ${client.user.tag}`);

    updateClientActivity();
});


client.on('messageDelete', msg => sendEmbedMessage({
    title : 'Message supprimé:',
    author: {
        name   : `${msg.author.username} (${msg.author.id})`, 
        iconUrl: msg.author.avatarURL()
    },
    description: msg.content
})
);


client.on('messageUpdate', (oldMsg, newMsg) => {
    if(newMsg.content != oldMsg.content){
        sendEmbedMessage({
            title : 'Message édité:',
            author: {
                name   : `${oldMsg.author.username} (${oldMsg.author.id})`, 
                iconUrl: oldMsg.author.avatarURL()
            },
            description: `**Ancien:** ${oldMsg.content} \n **Nouveau:** ${newMsg.content}`
        });
    }
});


client.on('message', msg => {
    if (msg.content[0] !== '!') return;
    //prevent bot using commands
    if (msg.author.bot) return;

    const authorObject = client.guilds.cache.get(serverId).members.cache.get(msg.author.id);
    const author = authorObject.nickname || authorObject.user.username;

    const mapping = {
        ping : () => msg.reply(commands.pong()),
        say  : (text) => tryToSend(msg.channel, commands.say(text)),
        link : (text) => tryToSend(msg.channel, commands.link(text)),
        quote: (pseudo, quotes) => sendEmbedMessage({
            title      : commands.quote(quotes),
            description: `*${pseudo[0].toUpperCase() + pseudo.slice(1)}* - Demandé par ${author}`,
            color      : 0x0099ff,
            channel    : msg.channel
        }),
    };

    const words = msg.content.split(' ');
    
    const command = words.shift().substr(1);
    const message = words.join(' ');
    const pseudos = Object.keys(quotes);
    
    if (!(command in mapping) && !pseudos.includes(command)) return;

    msg.delete();
    // in this context, the command is a pseudo
    if (pseudos.includes(command)) mapping.quote(command, quotes[command]);
    if (command in mapping) mapping[command](message);
});


client.on('guildMemberAdd', member => updateClientActivity());
client.on('guildMemberRemove', member => updateClientActivity());

client.login(process.env.TOKEN);


// --------------------
// UTILS
// --------------------
const getMemberCount = () => client.guilds.cache.get(serverId).memberCount;
const updateClientActivity = () => {
    // const memberCount = getMemberCount().toString();
    // client.user.setActivity(memberCount, {type: 'WATCHING'});
};
const tryToSend = (channel, text) => {
    if (!!text === false) channel.send('You did not send any text, please specify your request.');
    channel.send(text);
};
const sendEmbedMessage = (data) => {
    const {title, author, description, color, footer} = data;
    
    const embed = new Discord.MessageEmbed();
    if (title) embed.setTitle(title);
    if (author) embed.setAuthor(author.name, author.iconUrl);
    if (description) embed.setDescription(description);
    if (color) embed.setColor(color);
    if (footer) embed.setFooter(footer);
    

    const channel = data.channel || client.channels.cache.get(logChannel);
    channel.send(embed);
};