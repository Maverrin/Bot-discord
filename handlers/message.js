const commands = require('../commands');
const quotes = require('../quotes');
const {tryToSend} = require('../utils');

// this variable is for the bot to not spam
// the helperString message 
let canSendHelp = true;
const helperTimeout = 15*1000;

module.exports = (client, msg) => {
    if (msg.author.bot) return;

    // ============================
    // VARIABLES
    // ============================
    
    const helperString = 
    {
        embed: {
            title      : 'Mauvaise commande. Voici la liste des commandes possibles:',
            description: `**!say [text]** -  Fait dire votre texte au bot.\n
            **!link [uefr | evan | cherno | ue | uol | a2a]**  -  Donne le lien vers les ressources prédéfinies.\n
            **![${Object.keys(quotes).toString().replace(/,/g, ' | ')}]**  -  Fait dire une phrase sauvegardée aléatoire de cette personne.\n
            **!add [messageID]**  -  Ajoute une phrase pour la commande ![Pseudo].\n
            **!impaye**  -  Créé une annonce de recrutement non payé.\n
            **!paye**  -  Créé une annonce de recrutement payé.\n
            **!service**  -  Crée une annonce de recrutement pour proposer ses services (freelance).\n`
        }
    };

    // ----------------------------------
    // SERVER MESSAGES HANDLING
    // ----------------------------------
    if (msg.channel.type == 'text' && msg.content[0] == '!') {
        const mapping = {
            say  : (text) => tryToSend(msg.channel, commands.say(text)),
            link : (text) => tryToSend(msg.channel, commands.link(text)),
            quote: (userName) => tryToSend(msg.channel, commands.quote(userName, msg)),
            add  : (messageId) => commands.add(client, messageId, msg)
                .then(text => tryToSend(msg.channel, text))     
                .catch(err => tryToSend(msg.channel, `${messageId} not found :/`))
    
        };

        const words = msg.content.split(' ');
    
        const command = words.shift().substr(1);
        const message = words.join(' ');
        const quotedPersons = Object.keys(quotes);

        if (command.length === 0) return;

        msg.delete();

        // Unknown command, send help message
        if (!(command in mapping) && !quotedPersons.includes(command) && canSendHelp === true) {
            canSendHelp = false;
            setTimeout(() => canSendHelp = true, helperTimeout);
            return tryToSend(msg.channel, helperString);
        }

        // in this context, the command is a pseudo
        if (quotedPersons.includes(command)) return mapping.quote(command);

        // Handle any bug in commands
        try {
            if (command in mapping) return mapping[command](message);
        } catch (error) {
            console.log(error);
            return tryToSend(msg.channel, ':bangbang: Error, please check logs ¯\\_(ツ)_/¯');
        }
    }

    // ----------------------------------
    // DM MESSAGE HANDLING
    // ----------------------------------
    if (msg.channel.type == 'dm')
    {
        const mapping = {
            paid     : (text) => tryToSend(msg.channel, commands.paid(text, msg.author)),
            unpaid   : (text) => tryToSend(msg.channel, commands.unpaid(text, msg.author)),
            freelance: (userName) => tryToSend(msg.channel, commands.freelance(userName, msg)),
        };

        //prevent bot using commands
        if (msg.author.bot) return;

        const words = msg.content.split(' ');
        const command = words.shift().substr(1);
        const message = words.join(' ');

        if (command.length === 0) return;

        // Handle any bug in commands
        try {
            if (command in mapping) return mapping[command](message);
        } catch (error) {
            console.log(error);
            return tryToSend(msg.channel, ':bangbang: Erreur! Demande de l\'aide a un membre du staff ¯\\_(ツ)_/¯');
        }
    }
};
