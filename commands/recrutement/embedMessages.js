const {rulesDescription, formTemplate, previewFooter} = require('./strings');
const {offerToEmbed} = require('../../utils');

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
                {name: '!rec template', value: 'description'},
                {name: '!rec offer', value: 'description'},
                {name: '!rec preview', value: 'description'},
                {name: '!rec finish', value: 'description'},
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
            'https://picsum.photos/300/500'
        ],
        'contact': 'email@me.fr'
    }),
    template: (title) => ({
        embed: {
            title      : title || 'Utilisez ce template pour formuler votre annonce:',
            description: formTemplate
        },
    }),
    multipleTempOffers: (offers, title) => ({
        embed: {
            title      : title || 'Vous avez plusieurs offres non publiées:',
            description: `**${offers.toString().replace(/,/g, ', ')}**.\n
          Veuillez utiliser la commande \`!rec preview [projet]\` pour avoir une preview du message de recrutement
          Ou la commande \`!rec finish [project]\` pour sauvegarder votre annonce et la publier
          `
        },
    }),
    preview: (offer) => offerToEmbed(offer, {footer: {text: previewFooter}}),
};