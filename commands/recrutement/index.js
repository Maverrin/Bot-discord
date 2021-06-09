const commands = require('./commands');

module.exports = (client, msg) => {
    const words = msg.content.replace('\n', ' \n').split(' ');
    const command = words[1];

    // First interaction with bot
    if (command === undefined) {
        msg.author.send(commands.rules());
        return msg.author.send(commands.commandList());
    }

    // Wrong command
    if (!(command in commands)) {
        return msg.author.send(commands.commandList(':exclamation: Commande non comprise: ' + command));
    }

    // Call the command
    return msg.author.send(commands[command](words.slice(2).join(' '), msg.author.username, client));
};
