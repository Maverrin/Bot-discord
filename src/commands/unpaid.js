module.exports = async (msg, user) => {
    const dmChannel = msg.channel;
    const questions = [
        '**Ajoute un titre qui définit clairement ce que tu recherches.**\nExemple : Modélisateur 3D pour un projet de mod',
        '**Ajoute une description détaillée du projet et ce dont tu as besoins.**',
        '**Comment peut-on te contacter ?**',
        '**C\'est presque fini! Regarde ton message afin de vérifier qu\'il soit bon.**',
        '**Message qui change en fonction d\'une réponse (choisi une option : `1` ou `2`)**',
    ];

    let optionChosen;
    const questionsOption1 = ['1', '2'];
    const questionsOption2 = ['3', '4'];

    const applying = {};

    console.log(`${msg.author.tag} a commencé a postuler.`);

    for (let i = 0, cancel = false; i < questions.length && cancel === false; i++) {
        await dmChannel.send(questions[i]);
        try {
            const collected = await dmChannel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 5*60*1000, errors: ['time']});
            
            if (collected.last().content.toLowerCase() === '!stop') {
                await dmChannel.send('**Application arrêté.**');
                console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                cancel = true;
            }

            // Last question
            if (i === questions.length-1) optionChosen = collected.last().content;
        } catch (error) {
            await dmChannel.send('**L\'annonce a été mis en arrêt suite a un délai trop long.**');
            cancel = true;
            console.log(`${msg.author.tag} : délai trop long.`);
        }
    }

    console.log(`${msg.author.tag} a fini de créer son annonce.`);
};