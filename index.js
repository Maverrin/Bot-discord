require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands');

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
    const mapping = {
        ping: commands.pong,
    };
    
    if (!(msg.content in mapping)) return;

    console.log('Message: ', msg.content);

    msg.reply(mapping[msg]);
});

client.login(process.env.TOKEN);