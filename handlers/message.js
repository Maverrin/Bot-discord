const commands = require('../commands');
const quotes = require('../quotes');
const {tryToSend, sendEmbedMessage} = require('../utils');

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
        rec  : () => commands.recrutement(client, msg),
        quote: (pseudo, quotes) => sendEmbedMessage(client, {
            title      : commands.quote(quotes),
            description: `*${pseudo[0].toUpperCase() + pseudo.slice(1)}* - Demandé par ${msgAuthor}`,
            color      : process.env.COLOR_QUOTE,
            channel    : msg.channel
        }),
        add: (messageId) => commands.add(client, messageId)
            .then(fetchedMsg => {
                const fetchedAuthor = fetchedMsg.author.username[0].toUpperCase() + fetchedMsg.author.username.slice(1);
                sendEmbedMessage(client, {
                    title      : fetchedMsg.content,
                    description: `*${fetchedAuthor}* - Message rajouté par ${msgAuthor}`,
                    color      : process.env.COLOR_NEW_QUOTE,
                    channel    : msg.channel
                });
            })
            .catch(err => tryToSend(msg.channel, `${messageId} not found :/`)),
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

    const authorObject = client.guilds.cache.get(process.env.SERVER_ID).members.cache.get(msg.author.id);
    const msgAuthor = authorObject.nickname || authorObject.user.username;
    const isDirectMessage = !!(msg.channel.type === 'dm');

    const words = msg.content.split(' ');
  
    const command = words.shift().substr(1);
    const message = words.join(' ');
    const pseudos = Object.keys(quotes);

    if (!(command in mapping) && !pseudos.includes(command) && canSendHelp === true) {
        canSendHelp = false;
        setTimeout(() => canSendHelp = true, helperTimeout);
        return tryToSend(msg.channel, commands.say(helperString));
    }

    if (!isDirectMessage) msg.delete();
    // in this context, the command is a pseudo
    if (pseudos.includes(command)) return mapping.quote(command, quotes[command]);

    try {
        if (command in mapping) return mapping[command](message);
    } catch (error) {
        console.log(error);
        return tryToSend(msg.channel, commands.say(':bangbang: Error, please check logs'));
    }
};
