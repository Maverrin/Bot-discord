const quotes = require('./quotes.json');

// ============================
// LONG MESSAGE STRINGS
// ============================

module.exports.rulesDescription = `
__**Les règles :**__

:money_with_wings:  Précisez si votre annonce est rémunérée ou bénévole.

:warning:  **Les promesses de rémunération sont illégales**, pas de : "si le jeu se vend, vous prendrez votre part" "on prévoit de monter une boite".
Soit vous avez des statuts, soit vous n'en avez pas, aucun problème, mais pas d'ambiguïté, cela doit être clair dans l'annonce.

:bookmark_tabs:  **Présentez votre jeu** pour donner envie aux potentielles recrues (tout le monde a des idées, n'ayez pas peur d'un vol de concept, cela n'existe pas).

**Précisez le stade de votre jeu**, décrivez son gameplay, évitez au maximum les descriptions brefs du style "c'est un jeu comme ...".

:man_teacher:  **Présentez vous** ! Vos compétences, votre place dans le projet, présentez aussi votre équipe !

:man_construction_worker:  **Précisez les postes recherchés**. 

:frame_photo:  **N'hésitez pas à illustrer votre annonce** avec un site web, une vidéo, une image, pour maximiser vos chances (même si ce n'est qu'un début de prototype).

:pencil:  **Relisez-vous** ! une annonce sans fautes serait bien plus crédible !

:information_source:  **Respectez les règles**, ou sinon votre annonce sera rejetée.

:military_helmet: **Attention**, lorsque vous commencé un nouveau projet avec des personnes que vous ne connaissez pas. On ne peut pas vous protéger contre la fraude et ou les dégats relationels individuels ou bien des entreprises. __Afin d'éviter ceci, le mieux est de faire un contrat signé entre les deux parties qui définit clairement les responsabilités, la possession et les termes de payement **avant** de commencer tout travail__.
`;



module.exports.helperMessage = {embed: {
    title      : 'Mauvaise commande. Voici la liste des commandes possibles:',
    description: `
      **!say [text]** -  Fait dire votre texte au bot.\n
      **!link [uefr | evan | cherno | ue | uol | a2a]**  -  Donne le lien vers les ressources prédéfinies.\n
      **![${Object.keys(quotes).toString().replace(/,/g, ' | ')}]**  -  Fait dire une phrase sauvegardée aléatoire de cette personne.\n
      **!add [messageID]**  -  Ajoute une phrase pour la commande ![Pseudo].\n
      **!unpaid**  -  Créé une annonce de recrutement non payé. __Envoi la commande en MP au bot__.\n
      **!paid**  -  Créé une annonce de recrutement payé.__Envoi la commande en MP au bot__.\n
      **!freelance**  -  Crée une annonce de recrutement pour proposer ses services (freelance).__Envoi la commande en MP au bot__.\n
      `
}};

module.exports.errorMessage = ':bangbang: Erreur! Demande de l\'aide a un membre du staff ¯\\_(ツ)_/¯';