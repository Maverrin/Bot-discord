/* eslint-disable max-len */

module.exports = (client, msg) => {
    const words = msg.content.split(' ');
    const firstWord = words[1];

    console.log({
        content: msg.content,
        author : msg.author.username,
        words,
        firstWord,
    });


    if (firstWord === undefined) {
        msg.author.send(mapping.rules);
        return msg.author.send(mapping.commandList());
    }
    if (!(firstWord in mapping)) {
        return msg.author.send(mapping.commandList(':exclamation: Commande non comprise'));
    }

    mapping[firstWord];

};




// ============================
// CONSTANTS
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


const formFormat = `
Pour remplir les informations de l'offre de recrutement, 
`;


const messages = {
    commandList: (text = '') => ({
        embed: {
            title      : '',
            description: 'Voici les commandes possibles: !recrutement [ rules | preview | commandList ]',
        },
    }),
    rules: {
        embed: {
            title      : 'Vous souhaitez poster une annonce ? Pas de problème !',
            description: rulesDescription
        },
    },
    example: {}
};


const mapping = {
    preview    : () => {},
    rules      : messages.rules,
    commandList: messages.commandList
};