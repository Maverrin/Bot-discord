const {addQuote} = require('../utils');

module.exports = async (client, messageId) => {
    const channels = client.guilds.cache.get(process.env.SERVER_ID).channels.cache;

    const promises = [];
    for (let channel of channels) {
        // channel[0] is just the ID
        channel = channel[1];

        // Try to fetch in each text channel
        if (channel.type === 'text') promises.push(channel.messages.fetch(messageId));
    }

    const foundMessage = await oneSuccess(promises);

    // TODO Check if quote already saved
    addQuote(foundMessage.author.username, foundMessage.content);
    
    return foundMessage;
};


// Returns first resolving promise
const oneSuccess = (promises) => {
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