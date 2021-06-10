const quotes = require('../quotes');

module.exports = (userName, msg) => {
    const userQuotes = quotes[userName];
    const authorFullName = `${msg.author.username}#${msg.author.discriminator}`;
    const capitalizedUserName = userName[0].toUpperCase() + userName.slice(1);

    return {
        embed: {
            title      : userQuotes[Math.floor(Math.random() * userQuotes.length)],
            description: `*${capitalizedUserName}* - Demandé par ${authorFullName}`,
            color      : process.env.COLOR_QUOTE,
            channel    : msg.channel
        }
    };

};