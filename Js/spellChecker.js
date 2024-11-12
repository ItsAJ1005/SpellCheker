const path = require("path");
const fs = require("fs");
const readline = require("readline");

// Read the corpus and initialize word counts
const corpusPath = path.join(__dirname, "../corpus.txt");
const corpus = String(fs.readFileSync(corpusPath));
console.log("\nInitializing spellchecker...\n");

function getWordCounts(text) {
  const wordsArray = text.toLowerCase().match(/[a-z]+/g) || [];
  const resultMap = new Map();

  for (const word of wordsArray) {
    const count = resultMap.get(word) || 0;
    resultMap.set(word, count + 1);
  }
  return resultMap;
}

let WORD_COUNTS = getWordCounts(corpus);
const alphabet = "abcdefghijklmnopqrstuvwxyz";

// Generate words with edit distance 1
function editDistance1(word) {
  word = word.toLowerCase().split('');
  const results = new Set();

  // Adding characters
  for (let i = 0; i <= word.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const newWord = word.slice();
      newWord.splice(i, 0, alphabet[j]);
      results.add(newWord.join(''));
    }
  }

  // Removing characters
  if (word.length > 1) {
    for (let i = 0; i < word.length; i++) {
      const newWord = word.slice();
      newWord.splice(i, 1);
      results.add(newWord.join(''));
    }
  }

  // Transposing characters
  if (word.length > 1) {
    for (let i = 0; i < word.length - 1; i++) {
      const newWord = word.slice();
      [newWord[i], newWord[i + 1]] = [newWord[i + 1], newWord[i]];
      results.add(newWord.join(''));
    }
  }

  // Substituting characters
  for (let i = 0; i < word.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const newWord = word.slice();
      newWord[i] = alphabet[j];
      results.add(newWord.join(''));
    }
  }

  return Array.from(results);
}

// Spell correction with frequency-based suggestions
function correct(word) {
  word = word.toLowerCase();
  if (WORD_COUNTS.has(word)) {
    return { correct: word, suggestions: [] };
  }

  const editDistance1Words = new Set(editDistance1(word));
  let suggestions = [];

  // Collect suggestions from edit distance 1
  editDistance1Words.forEach((w) => {
    if (WORD_COUNTS.has(w)) {
      suggestions.push({ word: w, count: WORD_COUNTS.get(w) });
    }
  });

  // If no suggestions from edit distance 1, try edit distance 2
  if (suggestions.length === 0) {
    const editDistance2Words = new Set();
    editDistance1Words.forEach((w) => {
      editDistance1(w).forEach((w2) => editDistance2Words.add(w2));
    });

    editDistance2Words.forEach((w) => {
      if (WORD_COUNTS.has(w)) {
        suggestions.push({ word: w, count: WORD_COUNTS.get(w) });
      }
    });
  }

  // Sort suggestions by frequency
  suggestions.sort((a, b) => b.count - a.count);

  return {
    correct: word,
    suggestions: suggestions.map((s) => s.word),
  };
}

// Add a new word to the dictionary
function addWord(word) {
  word = word.toLowerCase();
  if (!WORD_COUNTS.has(word)) {
    WORD_COUNTS.set(word, 1);
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
    const count = WORD_COUNTS.get(oldWord);
    WORD_COUNTS.set(newWord, count);
    WORD_COUNTS.delete(oldWord);
    console.log(`Edited "${oldWord}" to "${newWord}" in the dictionary.`);
  } else {
    console.log(`"${oldWord}" not found in the dictionary.`);
  }
}

// User Interface using readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nOptions:");
  console.log("1. Check spelling of a sentence");
  console.log("2. Add a new word to the dictionary");
  console.log("3. Remove a word from the dictionary");
  console.log("4. Edit an existing word");
  console.log("5. Exit");
  rl.question("\nSelect an option: ", handleInput);
}

function handleInput(option) {
  switch (option.trim()) {
    case "1":
      rl.question("\nEnter a sentence: ", (sentence) => {
        processSentence(sentence);
        showMenu();
      });
      break;
    case "2":
      rl.question("\nEnter a word to add: ", (word) => {
        addWord(word);
        showMenu();
      });
      break;
    case "3":
      rl.question("\nEnter a word to remove: ", (word) => {
        removeWord(word);
        showMenu();
      });
      break;
    case "4":
      rl.question("\nEnter the word to edit: ", (oldWord) => {
        rl.question("Enter the new word: ", (newWord) => {
          editWord(oldWord, newWord);
          showMenu();
        });
      });
      break;
    case "5":
      console.log("\nExiting...");
      rl.close();
      break;
    default:
      console.log("\nInvalid option! Please try again.");
      showMenu();
  }
}

function processSentence(sentence) {
  const words = sentence.split(/\s+/);
  misspelledWords = [];

  correctedSentence = [...words];

  words.forEach((word, index) => {
    const result = correct(word);
    if (result.suggestions.length > 0) {
      misspelledWords.push({ word, index, suggestions: result.suggestions });
    }
  });

  if (misspelledWords.length === 0) {
    console.log("\nAll words are spelled correctly.");
    showMenu();
    return;
  }

  console.log(`\nFound ${misspelledWords.length} misspelled word(s).`);
  rl.question("\nDo you want to correct them? (yes/no): ", (answer) => {
    if (answer.trim().toLowerCase() === "yes") {
      console.log("\nStarting correction process...");
      handleCorrections(0); // Start correcting from the first misspelled word
    } else {
      console.log("\nCorrection skipped.");
      showMenu();
    }
  });
}

function handleCorrections(i) {
  if (i >= misspelledWords.length) {
    console.log("\nCorrected Sentence:\n" + correctedSentence.join(" "));
    showMenu();
    return;
  }

  const { word, index, suggestions } = misspelledWords[i];
  console.log(`\n"${word}" is misspelled. Suggestions: ${suggestions.join(", ")}`);
  console.log("Options:");
  console.log("1. Choose a suggestion");
  console.log("2. Enter a custom replacement");
  console.log("3. Skip correction");

  rl.question("Select an option (1/2/3): ", (option) => {
    switch (option.trim()) {
      case "1":
        if (suggestions.length > 0) {
          console.log("\nSuggestions:");
          suggestions.forEach((s, idx) => {
            console.log(`${idx + 1}. ${s}`);
          });
          rl.question("Select a suggestion: ", (choice) => {
            const suggestionIndex = parseInt(choice) - 1;
            if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
              correctedSentence[index] = suggestions[suggestionIndex];
            } else {
              console.log("Invalid choice. Skipping correction.");
            }
            handleCorrections(i + 1);
          });
        } else {
          handleCorrections(i + 1);
        }
        break;

      case "2":
        rl.question("Enter your replacement word: ", (replacement) => {
          correctedSentence[index] = replacement.trim();
          handleCorrections(i + 1);
        });
        break;

      case "3":
        handleCorrections(i + 1);
        break;

      default:
        console.log("Invalid option. Skipping correction.");
        handleCorrections(i + 1);
        break;
    }
  });
}


// Start the interactive session
showMenu();
