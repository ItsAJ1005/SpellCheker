# SpellChecker 🔍

A simple spell checker implemented in JavaScript that uses an iterative approach to correct spelling errors based on a given corpus 📑. The project utilizes techniques given below:

## Features ✨

- **Word Counting**: Counts the occurrences of each unique word in the corpus.
- **Edit Distance Calculation**: Generates suggestions for misspelled words based on edit distance algorithms.
- **Dynamic Suggestions**: Provides suggestions for corrections based on user input and the frequency of words in the corpus.
- **Dictionary Management**: Add, remove, or edit words in the dictionary dynamically.
- **User-Friendly Interface**: Allows users to check the spelling of sentences directly.

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

### Reference: 📄
This project is inspired by the research paper:
Cucerzan, S., & Brill, E. Spelling correction as an iterative process that exploits the collective knowledge of web users.

### Acknowledgement: 🎄
Thank you to Dr. Rajendra Prasath, Silviu Cucerzan and Eric Brill for their insightful talks & research on spelling correction techniques.
