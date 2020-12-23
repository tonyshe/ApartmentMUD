function capitalizeFirstLetter(string) {
  //Add capital to first letter of a sentence.
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addArticle(string) {
  //adds AN to words that start with vowels, otherwise A
  if ("aeiou".indexOf(string.charAt(0).toLowerCase()) > -1) { return "an " + string; };
  return "a " + string;
}

function objLister(objArray) {
  //goes through a list of words and returns a sentence
  //first index of list is a concatenated string of "x, y... and z"
  //second index of list is the verb is/are
  var outString = ['', ''];
  console.log(objArray)
  if (objArray.length == 0) {
    //empty list inputted
    return outString;
  }
  else if (objArray.length == 1) {
    //just one thing in list
    outString[0] += addArticle(objArray[0]);
    outString[1] = 'is';
  }
  else {
    //2 or more
    for (var i = 0; i < objArray.length - 1; i++) {
      outString[0] += addArticle(objArray[i]) + ", ";
    };
    outString[0] += "and " + addArticle(objArray[i]);
    outString[1] = 'are';
  }
  return outString;
}

module.exports = {
  capitalizeFirstLetter,
  addArticle,
  objLister
}
