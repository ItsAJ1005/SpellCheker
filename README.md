# SpellChecker 🔍

A simple spell checker implemented in JavaScript that uses an iterative approach to correct spelling errors based on a given corpus 📑. The project utilizes techniques given below:

## Features ✨

- **Word Counting**: Counts the occurrences of each unique word in the corpus to identify commonly used words.
- **Edit Distance Calculation**: Generates suggestions for misspelled words based on edit distance algorithms.
- **Dynamic Suggestions**: Provides frequency-based suggestions for corrections.
- **Dictionary Management**: Allows users to add, remove, or edit words in the dictionary dynamically during runtime.
- **Interactive Word-by-Word Correction**: Users can interactively correct multiple misspelled words in a sentence, with options to:
  - **Choose a suggested correction**
  - **Enter a custom replacement**
  - **Skip correction entirely**
- **User-Friendly Command-Line Interface**: Enables users to interactively check the spelling of sentences and manage the dictionary through an easy-to-use CLI.

## Installation 📲

To get started with the SpellChecker project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YourUsername/SpellChecker.git
   cd SpellChecker
    ```
```
node index.js your_input_sentence_here
```
- To add a new word to the dictionary: 
```
addWord("newword");
```
- To remove a word from the dictionary:
```
removeWord("wrongword");
```
- To edit a word in the dictionary:
```
editWord("oldword", "newword");
```

## Usage Example 📜

When you run the spell checker, it will check the spelling of a sentence and interactively ask you if you'd like to correct any misspelled words. You can choose to replace each misspelled word or skip the correction process.

For example:

```
Enter a sentence: hell wrld iss a mann
```
The program will identify misspelled words like "wrld" and give you options to either choose a suggestion or enter a custom replacement.


### Reference: 📄
This project is inspired by the research paper:
Cucerzan, S., & Brill, E. Spelling correction as an iterative process that exploits the collective knowledge of web users.

### Acknowledgement: 🎄
Thank you to Dr. Rajendra Prasath, Silviu Cucerzan and Eric Brill for their insightful talks & research on spelling correction techniques.
