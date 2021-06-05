const {sendEmbedMessage} = require('../utils'); 

module.exports = (client, oldMsg, newMsg) => {
    if(newMsg.content != oldMsg.content){
        sendEmbedMessage(
            client,
            {
                title : 'Message édité:',
                author: {
                    name   : `${oldMsg.author.username} (${oldMsg.author.id})`, 
                    iconUrl: oldMsg.author.avatarURL()
                },
                description: `**Ancien:** ${oldMsg.content} \n **Nouveau:** ${newMsg.content}`
            },
            process.env.LOG_CHANNEL_ID 
        );
    }
};
