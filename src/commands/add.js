const {addQuote} = require('../utils');
const quotes = require('../../data/quotes.json');

module.exports = async (client, messageId, msg) => {
    const channels = client.guilds.cache.get(process.env.SERVER_ID).channels.cache;
    const authorFullName = `${msg.author.username}#${msg.author.discriminator}`;

    // FIND MESSAGE
    const promises = [];
    for (let channel of channels) {
        // channel[0] is just the ID
        // channel[1] is the actual channel object
        channel = channel[1];

        // Try to fetch in each text channel
        if (channel.type === 'text') promises.push(channel.messages.fetch(messageId));
    }

    const foundMessage = await firstSuccess(promises);

    let foundMessageAuthor = foundMessage.author.username;
    foundMessageAuthor = foundMessageAuthor[0].toUpperCase() + foundMessageAuthor.slice(1);

    // CHECK IF ALREADY ADDED
    const quoteAlreadySaved = quotes[foundMessage.author.username].includes(foundMessage.content);
    if (quoteAlreadySaved) return 'The quote was already saved.';

    // SAVE QUOTE
    addQuote(foundMessage.author.username, foundMessage.content);
    return {
        embed: {
            title      : foundMessage.content,
            description: `*${foundMessageAuthor}* - Message rajouté par ${authorFullName}`,
            color      : process.env.COLOR_NEW_QUOTE,
            channel    : msg.channel
        }
    };
};


// Returns first resolving promise
const firstSuccess = (promises) => {
    return Promise.all(promises.map(p => {
        // If a request fails, count that as a resolution so it will keep
        // waiting for other possible successes. If a request succeeds,
        // treat it as a rejection so Promise.all immediately bails out.
        return p.then(
            val => Promise.reject(val),
            err => Promise.resolve(err)
        );
    })).then(
        // If '.all' resolved, we've just got an array of errors.
        errors => Promise.reject(errors),
        // If '.all' rejected, we've got the result we wanted.
        val => Promise.resolve(val)
    );
};