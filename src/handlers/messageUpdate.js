const {tryToSendChannelId} = require('../utils');

module.exports = (client, oldMsg, newMsg) => {
    if (newMsg.channel.type === 'dm') return;
    if(newMsg.content != oldMsg.content) {
        tryToSendChannelId(client, process.env.LOG_CHANNEL_ID, { 
            embed: {
                title : 'Message édité:',
                color : process.env.COLOR_MESSAGE_UPDATED,
                author: {
                    name   : `${oldMsg.author.username} (${oldMsg.author.id})`, 
                    iconUrl: oldMsg.author.avatarURL()
                },
                description: `**Ancien:** ${oldMsg.content} \n **Nouveau:** ${newMsg.content}`
            }
        }
        );}
};
