module.exports = (text) => {

    const firstWord = text.split(' ')[0];
    const mapping = {
        //UE FR YT channel
        uefr  : 'https://www.youtube.com/channel/UCVo4TMKRmdiMYHdMaPWbPNA',
        //Gamedev Teacher channel
        evan  : 'https://www.youtube.com/channel/UCyswDjUH1_gFIFJyu0sjJMg',
        //The Cherno channel
        cherno: 'https://www.youtube.com/channel/UCQ-W1KE9EYfdxhL6S4twUNw',
        //Unreal Engine channel
        ue    : 'https://www.youtube.com/channel/UCBobmJyzsJ6Ll7UbfhI4iwQ',
        //online course
        uol   : 'https://www.unrealengine.com/en-US/onlinelearning-courses',
        //don't ask to ask
        a2a   : 'https://dontasktoask.com/fr/'
    };

    if (firstWord in mapping) return mapping[firstWord];

    return `!link [ ${Object.keys(mapping).toString().replace(/,/g,' | ')} ]`;
};