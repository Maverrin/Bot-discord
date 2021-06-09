const tempOffersFile = require('../../../offersTemp.json');
const preview = require('./preview.js');
const {writeFile} = require('../../../utils');
const messages = require('../embedMessages');

/**
 * Maps the user's input data in JSON temp file
 * @param {*} text -
 * @param {*} username -
 * @return {Msg} - 
 */
module.exports = (text, username) => {
    const offer = {};

    if (!text) return messages.template('L\'offre est vide. Utilisez cet exemple pour créer une offre:');

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

    return preview(offer.title, username);
};