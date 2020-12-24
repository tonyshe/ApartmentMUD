async function showHelp(userId) {
    const response =
        `<em>
        "l" or "look": Look around<br>
        "x ___" or "examine ___": Examine something<br>
        "take ___": Take an object<br>
        "i": Your inventory<br>
        "put ___ on/in ___": Put an object on/in something<br>
        "open ___" or "close___": Open/close something<br>
        "go ___": Go somewhere<br><br>

        There are other valid commands that you can make in different situations. Feel free to play around and find them!
        </em>`
    return { [response]: [userId] }
}

module.exports = {
    showHelp
}