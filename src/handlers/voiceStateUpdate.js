module.exports = (client, oldState, newState) => {
    let role = newState.guild.roles.cache.get(process.env.VOICE_CHAT_ROLE_ID)

    if(newState.channel === null)
    {
        newState.member.roles.remove(role)
    }
    else
    {
        newState.member.roles.add(role)
    }
};
