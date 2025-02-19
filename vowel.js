#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to count vowels from input text
function countVowels(text) {
    const vowels = text.match(/[aeiouAEIOU]/g) || [];
    return vowels.length;
}

// Function to count consonants from input text
function countConsonants(text) {
    const consonants = text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || [];
    return consonants.length;
}

// Prompt user for input
rl.question('Enter a paragraph or text: ', (input) => {
    const vowelCount = countVowels(input);
    const consonantCount = countConsonants(input);
    
    console.log(chalk.green(`${vowelCount} vowels`), 'and', chalk.blue(`${consonantCount} consonants`), 'found');
    rl.close();
});

// To run this script as a CLI command, add the following to package.json:
// "bin": {
//   "vowel": "vowel.js"
// }
// Then run: npm link (to create a global command)
// Use: vowel