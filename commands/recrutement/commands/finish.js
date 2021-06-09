const offersFile = require('../../../offers.json');
const tempOffersFile = require('../../../offersTemp.json');
const messages = require('../embedMessages');
const {writeFile, offerToEmbed} = require('../../../utils');

/**
 * Save offer in "definitive file" and publishes 
 * to public Discord server
 * @param {*} text -
 * @param {*} username -
 * @param {DiscordClient} client -
 * @return {Msg} -
 */
module.exports = (text, username, client) => {
    const tempOffers = Object.keys(tempOffersFile[username]);  

    if (tempOffers.length === 0) return 'Aucune annonce créée. Utilisez [!rec offer] pour créer une annonce.';
    if (tempOffers.length > 1) {
        if (!text) return messages.multipleTempOffers(tempOffers);
        if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);
    }

    const offer = {
        ...(tempOffers.length > 1 
            ? tempOffersFile[username][text] 
            : tempOffersFile[username][tempOffers[0]]),
        creationDate: new Date().toISOString()
    };

    // TODO logs: [An offer from Username] <<< ADD #NUMBER

    // SAVE IN JSON FILE
    if (offersFile[username]) offersFile[username][offer.title] = offer;
    else offersFile[username] = {[offer.title]: offer};    
    writeFile('offers.json', JSON.stringify(offersFile));  
    console.log(`[OFFER SAVED] An offer from ${username} has been saved`);

    // DELETE FROM TEMP FILE
    tempOffers.length > 1 
        ? delete tempOffersFile[username][text] 
        : delete tempOffersFile[username][tempOffers[0]];
    console.log(`[TEMP OFFER DELETED] An offer from ${username} has been deleted`);
    writeFile('offersTemp.json', JSON.stringify(tempOffersFile));  

    // SEND TO PUBLIC CHANNEL
    const channelId = process.env.OFFER_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);
    const embed = offerToEmbed(offer);

    channel.send(embed);
    console.log(`[OFFER POSTED] "${offer.title}" from ${username} has been posted on channel: #${channel.name} (id: ${channelId})`);

    return 'Felicitations ! Ton annonce a été postée :partying_face: \nBonne chance !';
};