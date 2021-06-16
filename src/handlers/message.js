const commands = require('../commands');
const quotes = require('../../data/quotes.json');
const { tryToSend } = require('../utils');
const { helperMessage, errorMessage } = require('../../data/strings');

// this variable is for the bot to not spam
// the helperMessage message 
let canSendHelp = true;
const helperTimeout = 15 * 1000;
// const errorMessage = 

module.exports = (client, msg) => {
    const words = msg.content.split(' ');
    const command = words.shift().substr(1);
    const message = words.join(' ');

    if (msg.author.bot) return;
    if (command.length === 0) return;

    // ----------------------------------
    // MESSAGES IN DISCORD SERVER
    // ----------------------------------
    if (msg.channel.type === 'text' && msg.content[0] == '!') {
        const mapping = {
            say: (text) => tryToSend(msg.channel, commands.say(text)),
            link: (text) => tryToSend(msg.channel, commands.link(text)),
            quote: (userName) => tryToSend(msg.channel, commands.quote(userName, msg)),
            add: (messageId) => commands.add(client, messageId, msg)
                .then(text => tryToSend(msg.channel, text))
                .catch(err => tryToSend(msg.channel, `\`${messageId}\` not found :/`))
        };

        const quotedPersons = Object.keys(quotes);

        msg.delete();

        // Unknown command, send help message
        if (!(command in mapping) && !quotedPersons.includes(command) && canSendHelp === true) {
            canSendHelp = false;
            setTimeout(() => canSendHelp = true, helperTimeout);
            return tryToSend(msg.channel, helperMessage);
        }

        // in this context, the command is a pseudo
        if (quotedPersons.includes(command)) return mapping.quote(command);

        // Handle any bug in commands
        try {
            if (command in mapping) return mapping[command](message);
        } catch (error) {
            console.log(error);
            return tryToSend(msg.channel, errorMessage);
        }
    }

    // ----------------------------------
    // MESSAGE IN DM
    // ----------------------------------
    if (msg.channel.type === 'dm') {
        const mapping = {
            paid: (text) => tryToSend(msg.channel, commands.paid(text, msg.author)),
            unpaid: (text) => tryToSend(msg.channel, commands.unpaid(msg, msg.author)),
            freelance: (text) => tryToSend(msg.channel, commands.freelance(text, msg.author)),
        };

        // Handle any bug in commands
        try {
            if (command in mapping) return mapping[command](message);
        } catch (error) {
            console.log(error);
            return tryToSend(msg.channel, errorMessage);
        }
    }
};
