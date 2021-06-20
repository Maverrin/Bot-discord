const {tryToSendChannelId} = require('../utils');

module.exports = (client, msg) => {
    if (msg.channel.type === 'dm') return;
  
    tryToSendChannelId(client, process.env.LOG_CHANNEL_ID, { 
        embed: {
            title : 'Message supprimé:',
            author: {
                name   : `${msg.author.username} (${msg.author.id})`, 
                iconURL: msg.author.avatarURL()
            },
            description: msg.content
        }
    });
};