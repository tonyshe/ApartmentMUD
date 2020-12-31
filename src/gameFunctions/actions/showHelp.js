const helpResponse =
`
<b>Welcome to Tony's multiplayer hangout!</b><br>
<em>Below are some commands you can use to explore and interact with the environment.<br>
Be sure to examine as many things as you can!</em><br><br>

&nbsp;&nbsp;&nbsp;&nbsp;"go __": Go somewhere (try going to anywhere that has <b>bold</b> text)<br>
&nbsp;&nbsp;&nbsp;&nbsp;"l" or "look": Look around<br>
&nbsp;&nbsp;&nbsp;&nbsp;"x __" or "examine __": Examine something<br>
&nbsp;&nbsp;&nbsp;&nbsp;"take __": Take an object<br>
&nbsp;&nbsp;&nbsp;&nbsp;"i": Your inventory<br>
&nbsp;&nbsp;&nbsp;&nbsp;"put __ on/in __": Put an object on/in something<br>
&nbsp;&nbsp;&nbsp;&nbsp;"open __" or "close __": Open/close something<br><br>

<em>There are other valid commands that you can make in different situations. Feel free to play around and find them!
</em>`

async function showHelp(userId) {
    return { [helpResponse]: [userId] }
}

module.exports = {
    showHelp,
    helpResponse
}