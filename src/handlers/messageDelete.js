const {tryToSend} = require('../utils');

module.exports = (msg) => {
    if (msg.channel.type === 'dm') return;
  
    tryToSend(msg.channel, {
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