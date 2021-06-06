/* eslint-disable max-len */

const {writeFile} = require('../utils');
const offers = require('../offers.json');
const tempOffer = require('../offersTemp.json');

module.exports = msg => {
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

    return mapping[firstWord](words.slice(2).join(' '), msg.author.username);
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
`;


const messages = {
    commandList: (title = ':question: Liste des commandes') => ({
        embed: {
            title : title,
            fields: [
                {name: '!recrutement commandList', value: 'description'},
                {name: '!recrutement example', value: 'description'},
                {name: '!recrutement preview', value: 'description'},
                {name: '!recrutement rules', value: 'description'},
                {name: '!recrutement offer', value: 'description'},
            ]
        },
    }),
    rules: () => ({
        embed: {
            title      : 'Vous souhaitez poster une annonce ? Pas de problème !',
            description: rulesDescription
        },
    }),
    example : () => {},
    template: () => ({
        embed: {
            title      : 'Utilisez ce template pour formuler votre annonce:',
            description: formTemplate
        },
    }),
    multipleTempOffers: (offers) => ({
        embed: {
            title      : 'Vous avez plusieurs offres non publiées:',
            description: `${offers.toString().replace(/,/g, ', ')}.\nVeuillez utiliser la commande \`!preview [projet]\` pour avoir une preview du message de recrutement`
        },
    })
};


// ============================
// COMMANDS
// ============================

const mapping = {
    commandList: messages.commandList,
    example    : messages.example,
    rules      : messages.rules,
    template   : messages.template,
    preview    : (text, username) => {
        const tempOffers = Object.keys(tempOffer[username]);  
        console.log(tempOffer, tempOffers);
        if (tempOffers.length > 1) return messages.multipleTempOffers(tempOffers);
    },
    finish: (text, username) => {},
    offer : (text, username) => {
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
        if (tempOffer[username]) tempOffer[username][offer.title] = offer;
        else tempOffer[username] = {[offer.title]: offer};

        writeFile('offersTemp.json', JSON.stringify(tempOffer));  

        console.log(`[OFFER ADDED] An offer from ${username} has been saved (temp)`);

        // return mapping.preview(null, username);
    },
};
