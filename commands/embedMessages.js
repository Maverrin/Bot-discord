const {rulesDescription} = require('./strings');

// ----------------------------------
// PREPARED RESPONSE EMBED MESSAGES
// ----------------------------------

module.exports = {
    commandList: (title) => ({
        embed: {
            title : title || ':question: Liste des commandes',
            fields: [
                // Corresponds to ./index object
                // TODO descriptions
                {name: '!rec rules', value: 'description'},
                {name: '!rec commandList', value: 'description'},
                {name: '!rec example', value: 'description'},
            ]
        },
    }),
    rules: () => ({
        embed: {
            title      : 'Vous souhaitez poster une annonce ? Pas de problème !',
            description: rulesDescription
        },
    }),
};