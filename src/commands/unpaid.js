module.exports = async (msg, user) => {
    const dmChannel = msg.channel;
    const questions = [
        {
            "question": "Ajoute un titre qui définit clairement ce que tu recherches",
        },
        {
            "question": "Ajoute une description détaillée du projet et ce dont tu as besoin",
        },
        {
            "question": "Comment peut on te contacter?",
        },
        {
            "question": "Presque fini! Regarde ton poste et fais en sorte que ça soit juste.",
            "1": "Envoyer mon poste",
            "2": "Recommencer"
        }
    ]

    const applying = [];
    console.log(`${msg.author.tag} a commencé a postuler.`);

    for (let i = 0, cancel = false; i < questions.length && cancel === false; i++) {
        await dmChannel.send(questions[i].question);
        console.log(questions[i].question);
        try {
            const collected = await dmChannel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 5 * 60 * 1000, errors: ['time'] });

            applying.push(collected.last().content);
            console.log(applying[i]);
            if (collected.last().content.toLowerCase() === '!stop') {
                await dmChannel.send('**Application arrêté.**');
                console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                cancel = true;
            }

            // Last question
            if (i === questions.length - 1) optionChosen = collected.last().content;
        } catch (error) {
            await dmChannel.send('**L\'annonce a été mis en arrêt suite a un délai trop long.**');
            cancel = true;
            console.log(`${msg.author.tag} : délai trop long.`);
        }
    }

    console.log(`${msg.author.tag} a fini de créer son annonce.`);
};