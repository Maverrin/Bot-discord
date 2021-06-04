module.exports = (text) => {

    const firstWord = text.split(' ')[0];
    console.log(firstWord)
    const mapping = {
        yt: "https://www.youtube.com/channel/UCVo4TMKRmdiMYHdMaPWbPNA"
    }

    return mapping[firstWord];
};