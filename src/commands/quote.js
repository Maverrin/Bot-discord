const quotes = require('../../data/quotes.json');

module.exports = (userName, msg) => {
    const pseudos = Object.keys(quotes);
    const lowerCasePseudos = pseudos.map(pseudo => pseudo.toLowerCase());

    const askedPseudo = pseudos[lowerCasePseudos.indexOf(userName)];

    const userQuotes = quotes[askedPseudo];
    const randomQuote = userQuotes[Math.floor(Math.random() * userQuotes.length)];
    const capitalizedUserName = userName[0].toUpperCase() + userName.slice(1);

    return {
        embed: {
            title      : randomQuote,
            description: `*${capitalizedUserName}* - Demandé par ${msg.author.tag}`,
            color      : process.env.COLOR_QUOTE,
            channel    : msg.channel
        }
    };
};