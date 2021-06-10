const messages = require('../embedMessages');

module.exports = {
    offer      : require('./offer'),
    preview    : require('./preview'),
    finish     : require('./finish'),
    commandList: messages.commandList,
    example    : messages.example,
    rules      : messages.rules,
    template   : messages.template,
};