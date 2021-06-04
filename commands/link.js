module.exports = (text) => {
    const mapping = {
        ping: () => msg.reply(commands.pong()),
        say: (text) => {
            msg.delete();
            msg.channel.send(commands.say(text));
        },
        link: () => {
            msg.delete();
            msg.channel.send(commands.say(text));
        }
    }
};