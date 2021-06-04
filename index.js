require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');


client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
    if (msg.content[0] !== '!') return;

    const mapping = {
        ping: commands.pong,
    };

    const command = msg.content.split(' ')[0].substr(1);

    if (!(command in mapping)) return;

    msg.reply(mapping[msg]);
});

client.login(process.env.TOKEN);