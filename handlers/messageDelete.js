const {sendEmbedMessage} = require('../utils'); 

module.exports = (client, msg) => sendEmbedMessage(
    client, 
    {
        title : 'Message supprimé:',
        author: {
            name   : `${msg.author.username} (${msg.author.id})`, 
            iconUrl: msg.author.avatarURL()
        },
        description: msg.content
    }, 
    process.env.LOG_CHANNEL_ID    
);