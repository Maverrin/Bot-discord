module.exports = {
    pong       : () => 'Response message: pong!',
    quote      : (quotes) => quotes[Math.floor(Math.random() * quotes.length)],
    say        : (text) => text,
    add        : require('./add'),
    link       : require('./link'),
    recrutement: require('./recrutement'),
};