#!/usr/bin/env node
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to extract vowels from input text
function extractVowels(text) {
    return text.match(/[aeiouAEIOU]/g) || [];
}

// Prompt user for input
rl.question('Enter a paragraph or text: ', (input) => {
    const vowels = extractVowels(input);
    console.log('Vowels found:', vowels.join(' '));
    rl.close();
});

// To run this script as a CLI command, add the following to package.json:
// "bin": {
//   "vowel": "vowel.js"
// }
// Then run: npm link (to create a global command)
// Use: vowel
