const tempOffersFile = require('../../../offersTemp.json');
const messages = require('../embedMessages');

/**
 * @param {*} text -
 * @param {*} username -
 * @return {Msg} -
 */
module.exports = (text, username) => {
    const tempOffers = Object.keys(tempOffersFile[username]);  

    if (tempOffers.length > 1 && !text) return messages.multipleTempOffers(tempOffers);
    if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);
    return messages.preview(tempOffersFile[username][text]);
};