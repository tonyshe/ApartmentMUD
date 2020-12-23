function capitalizeFirstLetter(string) {
  //Add capital to first letter of a sentence.
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addArticle(string, important = false) {
  //adds AN to words that start with vowels, otherwise A
  if (!important) {
    if ("aeiou".indexOf(string.charAt(0).toLowerCase()) > -1) { return "an " + string; } 
    else {return "a " + string}
  }
  else {
    return 'the ' + string
  }
  
}

function objLister(objArray, article = true) {
  /**
   * Goes through a list of names strings and creates a natural english list
   * @param {[String]} objArray - Array of names
   * @param {Boolean} article  - adds articles to words if true (false for things like user names)
   * @return {[String, String]} - Array of length 2. First element is a list of obj names, second is the verb are/is
   */
  //goes through a list of words and returns a sentence
  //first index of list is a concatenated string of "x, y... and z"
  //second index of list is the verb is/are
  var outString = ['', ''];
  if (objArray.length == 0) {
    //empty list inputted
    return outString;
  }
  else if (objArray.length == 1) {
    //just one thing in list
    if (article) { outString[0] += addArticle(objArray[0]) } else { outString[0] += objArray[0] }
    outString[1] = 'is';
  }
  else {
    //2 or more
    for (var i = 0; i < objArray.length - 1; i++) {
      if (article) { outString[0] += addArticle(objArray[i]) } else { outString[0] += objArray[i] }
      outString[0] += ", ";
    };
    outString[0] += "and "
    if (article) { outString[0] += addArticle(objArray[i]) } else { outString[0] += objArray[i] }
    outString[1] = 'are';
  }
  return outString;
}

module.exports = {
  capitalizeFirstLetter,
  addArticle,
  objLister
}
