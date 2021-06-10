const offersFile = require('../../../offers.json');
const tempOffersFile = require('../../../offersTemp.json');
const messages = require('../embedMessages');
const {writeFile, offerToEmbed} = require('../../../utils');

/**
 * Save offer in "definitive file" and publishes 
 * to public Discord server
 * @param {*} text -
 * @param {*} user -
 * @param {DiscordClient} client -
 * @return {Msg} -
 */
module.exports = (text, user, client) => {
    const userName = user.username;
    const fullName = `${user.username}#${user.discriminator}`;
    const tempOffers = Object.keys(tempOffersFile[userName]);  

    if (tempOffers.length === 0) return 'Aucune annonce créée. Utilisez [!rec offer] pour créer une annonce.';
    if (tempOffers.length > 1) {
        if (!text) return messages.multipleTempOffers(tempOffers);
        if (!tempOffers.includes(text)) return messages.multipleTempOffers(tempOffers, `Le nom de l'offre n'a pas été trouvé: ${text}`);
    }

    const offer = {
        ...(tempOffers.length > 1 
            ? tempOffersFile[userName][text] 
            : tempOffersFile[userName][tempOffers[0]]),
        creationDate: new Date().toISOString()
    };

    // SAVE IN JSON FILE
    if (offersFile[userName]) offersFile[userName][offer.title] = offer;
    else offersFile[userName] = {[offer.title]: offer};    
    writeFile('offers.json', JSON.stringify(offersFile));  
    console.log(`[OFFER SAVED] An offer from ${fullName} has been saved`);

    // DELETE FROM TEMP FILE
    tempOffers.length > 1 
        ? delete tempOffersFile[userName][text] 
        : delete tempOffersFile[userName][tempOffers[0]];
    writeFile('offersTemp.json', JSON.stringify(tempOffersFile));  

    // SEND TO PUBLIC CHANNEL
    const channelId = process.env.OFFER_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);
    const embed = offerToEmbed(offer);

    channel.send(embed);
    console.log(`[OFFER POSTED] "${offer.title}" from ${fullName} has been posted on channel: #${channel.name} (id: ${channelId})`);

    return 'Felicitations ! Ton annonce a été postée :partying_face: \nBonne chance !';
};