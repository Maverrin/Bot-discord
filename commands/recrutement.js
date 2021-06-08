/* eslint-disable max-len */

const {writeFile, offerToEmbed} = require('../utils');
const offersFile = require('../offers.json');
const tempOffersFile = require('../offersTemp.json');

module.exports = (client, msg) => {
    const words = msg.content.replace('\n', ' \n').split(' ');
    const firstWord = words[1];

    // First interaction with bot
    if (firstWord === undefined) {
        msg.author.send(mapping.rules());
        return msg.author.send(mapping.commandList());
    }

    // Wrong command
    if (!(firstWord in mapping)) {
        return msg.author.send(mapping.commandList(':exclamation: Commande non comprise'));
    }

    // Use mapping object
    return msg.author.send(mapping[firstWord](words.slice(2).join(' '), msg.author.username, client));
};




// ============================
// MESSAGE STRINGS
// ============================

const rulesDescription = `
__**Les règles :**__

:money_with_wings:  Précisez si votre annonce est rémunérée ou bénévole.

:warning:  **Les promesses de rémunération sont illégales**, pas de : "si le jeu se vend, vous prendrez votre part" "on prévoit de monter une boite".
Soit vous avez des statuts, soit vous n'en avez pas, aucun problème, mais pas d'ambiguïté, cela doit être clair dans l'annonce.

:bookmark_tabs:  **Présentez votre jeu** pour donner envie aux potentielles recrues (tout le monde a des idées, n'ayez pas peur d'un vol de concept, cela n'existe pas).
**Précisez le stade de votre jeu**, décrivez son gameplay, évitez au maximum les descriptions brefs du style "c'est un jeu comme ...".

:man_teacher:  **Présentez vous** ! Vos compétences, votre place dans le projet, présentez aussi votre équipe !

:man_construction_worker:  **Précisez les postes recherchés**. 

:frame_photo:  **N'hésitez pas à illustrer votre annonce** avec un site web, une vidéo, une image, pour maximiser vos chances (même si ce n'est qu'un début de prototype).

:pencil:  **Relisez-vous** ! une annonce sans fautes serait bien plus crédible !

:information_source:  **Respectez les règles**, ou sinon votre annonce sera rejetée.
`;


const formTemplate = `
!rec offer
title: Example title2
about-us: test
project: test
project-status: commencé
images: https://picsum.photos/200/300, https://picsum.photos/200/300
contact: email@me.fr
`;


const messages = {
    commandList: (title = ':question: Liste des commandes') => ({
        embed: {
            title : title,
            fields: [
                {name: '!recrutement rules', value: 'description'},
                {name: '!recrutement commandList', value: 'description'},
                {name: '!recrutement example', value: 'description'},
                {name: '!recrutement offer', value: 'description'},
                {name: '!recrutement preview', value: 'description'},
                {name: '!recrutement finish', value: 'description'},
            ]
        },
    }),
    rules: () => ({
        embed: {
            title      : 'Vous souhaitez poster une annonce ? Pas de problème !',
            description: rulesDescription
        },
    }),
    example: () => offerToEmbed({
        'title'         : 'Super RPG !',
        'about-us'      : 'petite équipe sympa, on bosse à 3 sur le jeu depuis quelques mois',
        'project'       : '[Super description du jeu]',
        'project-status': 'Pré-alpha',
        'images'        : [
            'https://picsum.photos/200/300',
            'https://picsum.photos/200/300'
        ],
        'contact': 'email@me.fr'
    }),
    template: () => ({
        embed: {
            title      : 'Utilisez ce template pour formuler votre annonce:',
            description: formTemplate
        },
    }),
    multipleTempOffers: (offers, title = 'Vous avez plusieurs offres non publiées:') => ({
        embed: {
            title      : title,
            description: `${offers.toString().replace(/,/g, ', ')}.\n
            Veuillez utiliser la commande \`!recrutement preview [projet]\` pour avoir une preview du message de recrutement
            Ou la commande \`!recrutement finish [project]\` pour sauvegarder votre annonce et la publier
            `
        },
    }),
    preview: (offer) =>  offerToEmbed(offer, {
        footer: {
            text: 'Pour editer l\'offre, il suffit de refaire la commande `!recrutement offer` avec les nouvelles données'
        }
    }),
};


// ============================
// COMMANDS
// ============================

const mapping = {
    commandList: messages.commandList,
    example    : messages.example,
    rules      : messages.rules,
    template   : messages.template,

    /**
     * Maps the user's input data in JSON temp file
     * @param {*} text -
     * @param {*} username -
     * @return {Msg} - 
     */
    offer: (text, username) => {
        const offer = {};
      
        // Parsing message
        text.split('\n').forEach(line => {
            const key = line.substr(0, line.indexOf(':'));
            const value = line.substr(line.indexOf(':')+1).trim();
            const authorizedKeys = ['title', 'about-us', 'project', 'project-status', 'images', 'images', 'contact'];

            if (key == false) return;
            if (!authorizedKeys.includes(key)) throw new Error(`Wrong key: ${key}. Authorized ones: ${authorizedKeys})`);

            if (['images', 'videos'].includes(key)) return offer[key] = value.split(',');
            return offer[key] = value;
        });
        
        // Save in temp json
        if (tempOffersFile[username]) tempOffersFile[username][offer.title] = offer;
        else tempOffersFile[username] = {[offer.title]: offer};
        writeFile('offersTemp.json', JSON.stringify(tempOffersFile));  

        console.log(`[TEMP OFFER SAVED] An offer from ${username} has been saved`);

        return mapping.preview(offer.title, username);
    },

    /**
     * @param {*} text -
     * @param {*} username -
     * @return {Msg} -
     */
    preview: (text, username) => {
        const tempOffers = Object.keys(tempOffersFile[username]);  

        if (tempOffers.length > 1 && !text) return messages.multipleTempOffers(tempOffers);
        if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);
        return messages.preview(tempOffersFile[username][text]);
    },

    /**
     * Save offer in "definitive file" and publishes 
     * to public Discord server
     * @param {*} text -
     * @param {*} username -
     * @param {DiscordClient} client -
     * @return {Msg} -
     */
    finish: (text, username, client) => {
        const tempOffers = Object.keys(tempOffersFile[username]);  

        if (tempOffers.length > 1 && !text) return messages.multipleTempOffers(tempOffers);
        if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);

        const offer = tempOffersFile[username][text];

        // Save in json file
        if (offersFile[username]) offersFile[username][offer.title] = offer;
        else offersFile[username] = {[offer.title]: offer};    
        writeFile('offers.json', JSON.stringify(tempOffersFile));  
        console.log(`[OFFER SAVED] An offer from ${username} has been saved`);

        // Delete from temp file
        delete tempOffersFile[username][text];
        console.log(`[TEMP OFFER DELETED] An offer from ${username} has been deleted`);
        writeFile('offersTemp.json', JSON.stringify(tempOffersFile));  

        // Send to public channel
        const channelId = process.env.OFFER_CHANNEL_ID;
        const channel = client.channels.cache.get(channelId);
        const embed = offerToEmbed(offer);
        channel.send(embed);
        console.log(`[OFFER POSTED] "${offer.title}" from ${username} has been posted on channel: #${channel.name} (id: ${channelId})`);

        return 'Felicitations ! Ton annonce a été postée :partying_face: \n Bonne chance !';
    },
};
