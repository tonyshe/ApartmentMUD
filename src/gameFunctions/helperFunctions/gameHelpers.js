function makeUserId() {
    //make a random UUID for user session
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

async function makeRandomWord (wordLen) {
    return Math.random().toString(36).substring(2, 15);
}

module.exports = {
    makeUserId,
    makeRandomWord
}