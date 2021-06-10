const tempOffersFile = require('../../../offersTemp.json');
const messages = require('../embedMessages');

/**
 * @param {*} text -
 * @param {*} user -
 * @return {Msg} -
 */
module.exports = (text, user) => {
    const userName = user.username;
    const tempOffers = Object.keys(tempOffersFile[userName]);  

    if (tempOffers.length > 1 && !text) return messages.multipleTempOffers(tempOffers);
    if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);
    return messages.preview(tempOffersFile[userName][text]);
};