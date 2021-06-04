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

    const words = msg.content.split(' ');

    const command = words.shift().substr(1);
    const message = words.join(' ');

    if (!(command in mapping)) return;

    msg.reply(mapping[command](message));
});

client.login(process.env.TOKEN);