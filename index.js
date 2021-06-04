require('dotenv').config();
const Discord = require('discord.js');
const botConfig = require('./botConfig');
const client = new Discord.Client(botConfig);
const commands = require('./commands');


client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('message', msg => {
    if (msg.content[0] !== '!') return;

    const mapping = {
        ping: () => msg.reply(commands.pong()),
        say: (text) => {
            msg.delete();
            msg.channel.send(commands.say(text));
            
        }
    };

    const words = msg.content.split(' ');

    const command = words.shift().substr(1);
    const message = words.join(' ');

    if (!(command in mapping)) return;

    mapping[command](message);
});

client.login(process.env.TOKEN);