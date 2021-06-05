const {updateClientActivity} = require('../utils');

module.exports = (client) => {
    // if the bot is actually not connected to the specific server
    if (!client.guilds.cache.has(process.env.SERVER_ID)){
        console.log('[LOGOUT] Not connected to any server');
        return client.destroy();
    }

    console.log(`[LOGIN] Logged in as ${client.user.tag}`);

    updateClientActivity();
};