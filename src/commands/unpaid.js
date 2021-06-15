module.exports = async (msg, user) => {
    // TODO
    console.log('non payé!');
    const questions = [
        "**Ajoute un titre qui définit clairement ce que tu recherches.**\nExemple : Modélisateur 3D pour un projet de mod",
        "**Ajoute une description détaillée du projet et ce dont tu as besoins.**",
        "**Comment peut-on te contacter ?**",
        "**C'est presque fini! Regarde ton message afin de vérifier qu'il soit bon.**"
    ]

    const applying = {};

    try {
        console.log(`${msg.author.tag} a commencé a postuler.`);
        for (let i = 0, cancel = false; i < questions.length && cancel === false; i++) {
            await msg.channel.send(questions[i]);
            await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 300000, errors: ["time"] })
                .then(async (collected) => {
                    if (collected.first().content.toLowerCase() === "!stop") {
                        await msg.channel.send("**Application arrêté.**");
                        cancel = true;

                        console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                    }
                }).catch(async () => {
                    await msg.channel.send("**L'annonce a été mis en arrêt suite a un délai trop long.**");
                    cancel = true;

                    console.log(`${msg.author.tag} : délai trop long.`);
                });
        }

        await msg.channel.send("Message qui change en fonction d'une réponse (choisi une option : 1 / 2)");

        console.log(`${msg.author.tag} a fini de créer son annonce.`);
    } catch (err) {
        console.error(err);
    }
};