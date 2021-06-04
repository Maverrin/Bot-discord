require('dotenv').config();
const Discord = require('discord.js');
const commands = require('./commands');
const botConfig = require('./botConfig');

const client = new Discord.Client(botConfig);

const serverId = '384349653254275082';

client.on('ready', () => {
    // if the bot is actually not connected to the specific server
    if (!client.guilds.cache.has(serverId)){
        console.log('[LOGOUT] Not connected to any server');
        client.destroy();
    }

    console.log(`[LOGIN] Logged in as ${client.user.tag}`);

    updateClientActivity();
});

client.on('message', msg => {
    if (msg.content[0] !== '!') return;
    //prevent bot using commands
    if (msg.author.bot) return;

    const mapping = {
        ping: () => msg.reply(commands.pong()),
        say : (text) => tryToSend(msg.channel, commands.say(text)),
        link: (text) => tryToSend(msg.channel, commands.link(text)),
    };

    const words = msg.content.split(' ');

    const command = words.shift().substr(1);
    const message = words.join(' ');
    
    if (!(command in mapping)) return;

    msg.delete();
    mapping[command](message);
});

client.on('guildMemberAdd', member => updateClientActivity());
client.on('guildMemberRemove', member => updateClientActivity());

client.login(process.env.TOKEN);

const getMemberCount = () => client.guilds.cache.get(serverId).memberCount;
const updateClientActivity = () => {
    // const memberCount = getMemberCount().toString();
    // client.user.setActivity(memberCount, {type: 'WATCHING'});
};
const tryToSend = (channel, text) => {
    if (!!text === false) channel.send('You did not send any text, please specify your request.');
    channel.send(text);
};