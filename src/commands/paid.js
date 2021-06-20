const {tryToSendChannelId, advertToEmbedPaid} = require('../utils');

module.exports = async (client, msg, user) => {
    if (client.inProcessAdvert[user.tag]) return;
    client.inProcessAdvert[user.tag] = 'paid';
    const dmChannel = msg.channel;
    const questions = [
        {
            step    : 'pay',
            question: '**Comment le travail sera t-il compensé ?**',
            options : [
                '1. **Rémunération**',
                '2. **Si le jeu fonctionne, partage des revenus**',
                '3. **Pas de rémunération**',
            ],
        },
        {
            step    : 'contract',
            question: '**Est-ce un contrat permanent ou contractuel ?**',
            options : [
                '1. **Permanent**',
                '2. **Contractuel**',
            ],
        },
        {
            permanentQuestions: [
                {
                    step    : 'role',
                    question: '**Quel rôle recrutes-tu ?**\nExemples : Gameplay developer, Game online programmer ..., Game charact designer',
                },
                {
                    step    : 'companyName',
                    question: '**Quel est le nom de l\'entreprise ?**',
                },
                {
                    step    : 'localisation',
                    question: '**Ou est localisé l\'entreprise ?**\n"Partout" pour du remote ou ne possède pas de siège social.',
                },
                {
                    step    : 'remote',
                    question: '**Est-ce que le remote est possible ?**',
                    options : [
                        '1. **Oui**',
                        '2. **Non**',
                    ],
                },
                {
                    step    : 'responsabilities',
                    question: '**Liste des responsabilites associes pour ce rôle ? (Max 1024 lettres) ?**',
                },
                {
                    step    : 'qualifications',
                    question: '**Lister les qualifications pour ce rôle (Max 1024 lettres).**',
                },
                {
                    step    : 'apply',
                    question: '**Comment peut-on postuler ?**',
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
            ],
            contractQuestions: [
                {
                    step    : 'length',
                    question: '**Quel est la durée du contrat ?**\nExemples : 1 semaine, 7 mois, 2 ans ...',
                },
                {
                    step    : 'role',
                    question: '**Quel rôle recrutes-tu ?**\nExemples : Gameplay developer, Game online programmer, Game charact designer ...',
                },
                {
                    step    : 'companyName',
                    question: '**Quel est le nom de l\'entreprise ?**',
                },
                {
                    step    : 'localisation',
                    question: '**Ou est localisé l\'entreprise ?**\n"Partout" pour du remote ou ne possède pas de siège social.',
                },
                {
                    step    : 'remote',
                    question: '**Est-ce que le remote est possible ?**',
                    options : [
                        '1. **Oui**',
                        '2. **Non**',
                    ],
                },
                {
                    step    : 'responsabilities',
                    question: '**Liste des responsabilites associes pour ce rôle ? (Max 1024 lettres) ?**',
                },
                {
                    step    : 'qualifications',
                    question: '**Lister les qualifications pour ce rôle (Max 1024 lettres).**',
                },
                {
                    step    : 'apply',
                    question: '**Comment peut-on postuler ?**',
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
            ]
        },
    ];
    const answers = {};
    
    console.log(`${msg.author.tag} a commencé a postuler.`);

    for (let i = 0, cancel = false; i < questions.length && cancel === false; i++) {
        let questionMsg = questions[i].question;

        if (questionMsg == null) {
            const lastMessage = msg.channel.lastMessage.content;

            const selected = Object.keys(questions[i])[lastMessage - 1];
            const selectedQuestions = questions[i][selected];

            for (let x = 0, cancel = false; x < selectedQuestions.length && cancel === false; x++) {

                let questionMsgX = selectedQuestions[x].question;
                const hasOptionsX = 'options' in selectedQuestions[x];

                if (hasOptionsX) {
                    questionMsgX += '\n\nChoisissez-en un :\n';
                    for (const option of selectedQuestions[x].options) {
                        questionMsgX += '\n' + option;
                    }
                }
                await dmChannel.send(questionMsgX);
                if (selectedQuestions[x].step === 'finish') await dmChannel.send(advertToEmbedPaid(answers, user));
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

                    if (selectedQuestions[x].step === 'responsabilities' || selectedQuestions[x].step === 'qualifications') {
                        if (msgContent.length > 1024) {
                            await dmChannel.send('**Trop de charactère dans votre description. Veuillez réduire.**');
                            x--;
                            continue;
                        }
                    }

                    if (hasOptionsX) {
                        if (msgContent.length > 1 || !/[1-9]/.test(msgContent[0]) || (msgContent > selectedQuestions[x].options.length)) {
                            await dmChannel.send('**Veuillez tapper le numéro de l\'option choisie**');
                            x--;
                            continue;
                        }

                    }

                    // Save response
                    answers[selectedQuestions[x].step] = msgContent;
                    console.log(`${msg.author.tag} - ${selectedQuestions[x].step}: ${msgContent}`);

                } catch (error) {
                    console.log(error);
                    await dmChannel.send('**L\'annonce a été mis en arrêt suite a un délai trop long.**');
                    cancel = true;
                    console.log(`${msg.author.tag} : délai trop long.`);
                }

                // Send advert
                if (answers.finish == 1) tryToSendChannelId(client, process.env.ADVERT_CHANNEL_ID, advertToEmbedPaid(answers, user));
                if (answers.finish == 2) {
                    answers.finish = null;
                    x = -1;
                    continue;
                }
                if (answers.finish == 3) {
                    await dmChannel.send('**Application arrêté.**');
                    console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                    cancel = true;
                    break;
                }
            }
            continue;
        }

        // Display options, if there are some
        const hasOptions = 'options' in questions[i];

        if (hasOptions) {
            questionMsg += '\n\nChoisissez-en un :\n';
            for (const option of questions[i].options) {
                questionMsg += '\n' + option;
            }
        }

        await dmChannel.send(questionMsg);
        if (questions[i].step === 'finish') await dmChannel.send(advertToEmbedPaid(answers, user));

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

            // Check if content is the number of an option
            if (hasOptions) {
                if (msgContent.length > 1 || !/[1-9]/.test(msgContent[0]) || (msgContent > questions[i].options.length)) {
                    await dmChannel.send('**Veuillez tapper le numéro de l\'option choisie**');
                    i--;
                    continue;
                }

                if (questions[i].step == 'pay') {
                    if (msgContent == '2' || msgContent == '3') {
                        await dmChannel.send('**Pour les projets de loisirs ou pour tout autre type de payement, veuillez utiliser la commande !unpaid.**');
                        console.log(`${msg.author.tag} a stopper la création d'une annonce.`);
                        cancel = true;
                    }
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
        if (answers.finish == 1) tryToSendChannelId(client, process.env.ADVERT_CHANNEL_ID, advertToEmbedPaid(answers, user));
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
