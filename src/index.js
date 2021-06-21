require('dotenv').config();
const handlers = require('./handlers');

const Discord = require('discord.js');
const client = new Discord.Client();

// Overwrite console.log to keep log file
if (process.env.ENV === 'PROD') {
    let fs = require('fs');
    let log_file = fs.createWriteStream('./debug.log', {flags: 'a'});
    let log_stdout = process.stdout;
    console.log = (text) => {
        const now = new Date().toISOString();
        const date = now.substr(2, 8) + ' ' + now.substr(11, 8);
        const string = `[${date}] ${text}\n`;
        log_file.write(string);
        log_stdout.write(string);

    };
    
    //Delete each month 2628000000
    setInterval(() => fs.truncate('./debug.log', 0, ()=>console.log('[LOGS DELETED]')), 1209600000); 
}

client.inProcessAdvert = {};

// All DiscordJs events here: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
client.on('ready', () => handlers.ready(client));
client.on('guildMemberAdd', member => handlers.guildMemberAdd(client));
client.on('guildMemberRemove', member => handlers.guildMemberRemove(client));
client.on('messageDelete', msg => handlers.messageDelete(client, msg));
client.on('messageUpdate', (oldMsg, newMsg) => handlers.messageUpdate(client, oldMsg, newMsg));
client.on('message', msg => handlers.message(client, msg));

client.login(process.env.TOKEN);
