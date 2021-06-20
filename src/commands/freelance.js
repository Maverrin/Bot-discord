const {tryToSendChannelId, advertToEmbedFreelance} = require('../utils');

module.exports = async (client, msg, user) => {
    // check client.inProcessAdvert[user.tag] 
    if (client.inProcessAdvert[user.tag]) return;
    client.inProcessAdvert[user.tag] = 'freelance';
    const dmChannel = msg.channel;
    const questions = [
        {
            step    : 'title',
            question: '**Faites-vous une annonce pour un freelancer individuel ou un studio ?**',
            options : [
                '1. **Freelance**',
                '2. **Studio**',
            ],
            optionsQuestions: [
                '**Quel est ton nom ?**',
                '**Quel est le nom de ton studio ?**',
            ]
        },
        {
            step    : 'url',
            question: '**Entrez l\'url de votre site portfolio (URL requis)**\nPar exemple: https://monsuperportfolio.com/',
        },
        {
            step    : 'description',
            question: '**Quel est la liste des services que tu proposes ? (Max 1024 lettres)**',
        },

        {
            step    : 'contact',
            question: '**Comment les clients potentiels peuvent-ils vous contacter ? (Max 1024 lettres)**',
        },
        {
            step    : 'finish',
            question: '**Presque fini! Regarde ton poste et fais en sorte que ça soit juste.**', // + message example
            options : [
                '1. **Envoyer mon poste**',
                '2. **Recommencer**',
                '3. **Arrêter**',
            ]
        }
    ];

    const answers = {};

    console.log(`${msg.author.tag} a commencé a postuler.`);

    for (let i = 0, cancel = false; i < questions.length && cancel === false; i++) {

        let questionMsg = questions[i].question;

        // Display options, if there are some
        const hasOptions = 'options' in questions[i];
        const hasOptionsQuestions = 'optionsQuestions' in questions[i];

        if (hasOptions) {
            questionMsg += '\n\nChoisissez-en un :\n';
            for (const option of questions[i].options) {
                questionMsg += '\n' + option;
            }
        }
        await dmChannel.send(questionMsg);
        if (questions[i].step === 'finish') await dmChannel.send(advertToEmbedFreelance(answers, user));

        try {
            // Fetch message
            const collected = await dmChannel.awaitMessages(m => m.channel.type === 'dm', {
                max: 1, time: 5 * 60 * 1000, errors: ['time']
            });
            let msgContent = collected.last().content.trim();

            // !stop command
            // possible !edit command to change precedent answer
            if (msgContent.toLowerCase() === '!stop' || msgContent.toLowerCase() === '!freelance' || msgContent.toLowerCase() === '!unpaid' || msgContent.toLowerCase() === '!paid') {
                await dmChannel.send('**Application arrêté.**');
                console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                cancel = true;
                break;
            }

            if (questions[i].step === 'description' || questions[i].step === 'contact') {
                if (msgContent.length > 1024) {
                    await dmChannel.send('**Trop de charactère dans votre description. Veuillez réduire.**');
                    i--;
                    continue;
                }
            }

            if (questions[i].step === 'url') {
                const url = msgContent;
                const urlTegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/g;
                const isURL = urlTegex.test(url);
                if (isURL == false) {
                    await dmChannel.send('**Ce n\'est pas une URL valide.**');
                    i--;
                    continue;
                }
            }

            // Check if content is the number of an option
            if (hasOptions) {
                if (msgContent.length > 1 || !/[1-9]/.test(msgContent[0]) || (msgContent > questions[i].options.length)) {
                    await dmChannel.send('**Veuillez tapper le numéro de l\'option choisie**');
                    i--;
                    continue;
                }

                if (hasOptionsQuestions) {
                    await dmChannel.send(questions[i].optionsQuestions[msgContent - 1]);
                    const collectedOption = await dmChannel.awaitMessages(m => m.channel.type === 'dm', {
                        max: 1, time: 5 * 60 * 1000, errors: ['time']
                    });
                    msgContent = collectedOption.last().content.trim();
                }

            }

            // Save response
            answers[questions[i].step] = msgContent;
            console.log(`${msg.author.tag} - ${questions[i].step}: ${msgContent}`);

        } catch (error) {
            console.log(error);
            await dmChannel.send('**L\'annonce a été mis en arrêt suite a un délai trop long.**');
            cancel = true;
            console.log(`${msg.author.tag} : délai trop long.`);
        }

        // Send advert
        if (answers.finish == 1) tryToSendChannelId(client, process.env.ADVERT_CHANNEL_ID, advertToEmbedFreelance(answers, user));
        if (answers.finish == 2) {
            answers.finish = null;
            i = -1;
            continue;
        }
        if (answers.finish == 3) {
            await dmChannel.send('**Application arrêté.**');
            console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
            cancel = true;
            break;
        }
    }

    client.inProcessAdvert[user.tag] = null;
    console.log(`${msg.author.tag} a fini de créer son annonce.`);
};
