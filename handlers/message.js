const commands = require('../commands');
const quotes = require('../quotes');
const {tryToSend} = require('../utils');

// this variable is for the bot to not spam
// the helperString message 
let canSendHelp = true;
const helperTimeout = 15*1000;

module.exports = (client, msg) => {
    // ============================
    // VARIABLES
    // ============================
    const mapping = {
        ping : () => msg.reply(commands.pong()),
        say  : (text) => tryToSend(msg.channel, commands.say(text)),
        link : (text) => tryToSend(msg.channel, commands.link(text)),
        quote: (userName) => tryToSend(msg.channel, commands.quote(userName, msg)),
        rec  : () => commands.recrutement(client, msg),
        add  : (messageId) => commands.add(client, messageId, msg)
            .then(text => tryToSend(msg.channel, text))     
            .catch(err => tryToSend(msg.channel, `${messageId} not found :/`))
    };

    // TODO? transform in embed with fields
    const helperString = `
\`\`\`
Mauvaise commande. Voici la liste des commandes possibles: 
**!say [text]** -  Fait dire votre texte au bot\n
**!link [uefr, evan, cherno, ue, uol, a2a]**  -  Donne le lien vers les ressources prédéfinies\n
**![${Object.keys(quotes).toString().replace(/,/g, ' | ')}]**  -  Fait dire une phrase sauvegardée aléatoire de cette personne\n
**!add [messageID]**  -  Ajoute une phrase pour la commande ![Pseudo]\n
**!rec**  -  Créé une annonce de recrutement 
\`\`\``;

    // ============================
    // HANDLING
    // ============================
    if (msg.content[0] !== '!') return;
    //prevent bot using commands
    if (msg.author.bot) return;

    const words = msg.content.split(' ');
  
    const command = words.shift().substr(1);
    const message = words.join(' ');
    const quotedPersons = Object.keys(quotes);

    if (!(command in mapping) && !quotedPersons.includes(command) && canSendHelp === true) {
        canSendHelp = false;
        setTimeout(() => canSendHelp = true, helperTimeout);
        return tryToSend(msg.channel, commands.say(helperString));
    }

    if (!msg.channel.type === 'dm') msg.delete();

    // in this context, the command is a pseudo
    if (quotedPersons.includes(command)) return mapping.quote(command);

    try {
        if (command in mapping) return mapping[command](message);
    } catch (error) {
        console.log(error);
        return tryToSend(msg.channel, ':bangbang: Error, please check logs ¯\\_(ツ)_/¯');
    }
};
