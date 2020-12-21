function capitalizeFirstLetter(string) {
  //Add capital to first letter of a sentence.
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addArticle(string) {
	//adds AN to words that start with vowels, otherwise A
	if ("aeiou".indexOf(string.charAt(0).toLowerCase()) > -1) {return "an " + string;};
	return "a " + string;
}

module.exports = {
    capitalizeFirstLetter, addArticle
}
