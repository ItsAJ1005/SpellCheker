var path = require("path");
var fs = require("fs");
var corpus = String(fs.readFileSync(path.join(__dirname, "../corpus.txt"))); 
console.log("\nInitializing spellchecker!\n");

function getWordCounts(text) {
  var wordsArray = text.toLowerCase().match(/[a-z]+/g) || [];
  var resultMap = new Map(); 

  for (var word of wordsArray) {
    var count = resultMap.get(word) || 0;
    resultMap.set(word, count + 1);
  }

  return resultMap; 
}

var WORD_COUNTS = getWordCounts(corpus);
var alphabet = "abcdefghijklmnopqrstuvwxyz";

function editDistance1(word) {
  word = word.toLowerCase().split('');
  var results = [];   // The added char words and 1 char removed words

  // Adding characters
  for (var i = 0; i <= word.length; i++) {
    for (var j = 0; j < alphabet.length; j++) {
      var newWord = word.slice();
      newWord.splice(i, 0, alphabet[j]);
      results.push(newWord.join(''));
    }
  }

  // Removing characters
  if (word.length > 1) {
    for (var i = 0; i < word.length; i++) {
      var newWord = word.slice();
      newWord.splice(i, 1);
      results.push(newWord.join(''));
    }
  }

  // Transposing characters
  if (word.length > 1) {
    for (var i = 0; i < word.length - 1; i++) {
      var newWord = word.slice();
      var r = newWord.splice(i, 1);
      newWord.splice(i + 1, 0, r[0]);
      results.push(newWord.join(''));
    }
  }

  // Substituting characters
  for (var i = 0; i < word.length; i++) {
    for (var j = 0; j < alphabet.length; j++) {
      var newWord = word.slice();
      newWord[i] = alphabet[j];
      results.push(newWord.join(''));
    }
  }

  return results;
}

function correct(word) {
  word = word.toLowerCase();
  if (WORD_COUNTS.has(word)) {
    return { correct: word, suggestions: [] };
  }

  var editDistance1Words = editDistance1(word);
  var suggestions = [];

  // Collect suggestions from edit distance 1
  for (var i = 0; i < editDistance1Words.length; i++) {
    if (WORD_COUNTS.has(editDistance1Words[i])) {
      suggestions.push(editDistance1Words[i]);
    }
  }

  // Suggest from edit distance 2
  if (suggestions.length === 0) {
    var editDistance2Words = [];
    for (var i = 0; i < editDistance1Words.length; i++) {
      editDistance2Words = editDistance2Words.concat(editDistance1(editDistance1Words[i]));
    }
    for (var i = 0; i < editDistance2Words.length; i++) {
      if (WORD_COUNTS.has(editDistance2Words[i])) {
        suggestions.push(editDistance2Words[i]);
      }
    }
  }

  return { correct: word, suggestions: suggestions };
}

// Add a new word to the dictionary
function addWord(word) {
  word = word.toLowerCase();
  if (!WORD_COUNTS.has(word)) {
    WORD_COUNTS.set(word, 1); // Add the word with an initial count of 1
    console.log(`Added "${word}" to the dictionary.`);
  } else {
    console.log(`"${word}" already exists in the dictionary.`);
  }
}

// Remove a word from the dictionary
function removeWord(word) {
  word = word.toLowerCase();
  if (WORD_COUNTS.has(word)) {
    WORD_COUNTS.delete(word);
    console.log(`Removed "${word}" from the dictionary.`);
  } else {
    console.log(`"${word}" not found in the dictionary.`);
  }
}

// Edit a word in the dictionary
function editWord(oldWord, newWord) {
  oldWord = oldWord.toLowerCase();
  newWord = newWord.toLowerCase();
  if (WORD_COUNTS.has(oldWord)) {
    var count = WORD_COUNTS.get(oldWord); // Get the current count
    WORD_COUNTS.set(newWord, count); // Set the new word with the same count
    WORD_COUNTS.delete(oldWord); // Remove the old word
    console.log(`Edited "${oldWord}" to "${newWord}" in the dictionary.`);
  } else {
    console.log(`"${oldWord}" not found in the dictionary.`);
  }
}

// Function to process a sentence and check for misspelled words
function processSentence(sentence) {
  var words = sentence.split(/\s+/);
  var output = words.map(function(word) {
    var result = correct(word);
    if (result.suggestions.length > 0) {
      return ` - "${word}" is misspelled. Suggestions: ${result.suggestions.join(', ')}.`;
    } else {
      return ` - "${word}" is spelled correctly.`;
    }
  });
  console.log(output.join("\n"));
}

// User interaction for adding/removing/editing words and checking sentences
var inputWords = process.argv.slice(2); // node "file path" {sentence}

// processSentence("helloo worlld");
// addWord("newword");
// removeWord("wrongword");
// editWord("oldword", "newword");
processSentence(inputWords.join(" "));

console.log("\nFinished!");
