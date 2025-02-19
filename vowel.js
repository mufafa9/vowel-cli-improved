#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';
import fs from 'fs/promises';
import { program } from 'commander';

// Initialize commander
program
  .version('1.0.0')
  .description('A CLI tool to analyze text for vowels and consonants')
  .option('-f, --file <path>', 'Read input from a file')
  .option('-s, --stats', 'Show detailed statistics')
  .option('-o, --output <path>', 'Save results to a file')
  .parse(process.argv);

const options = program.opts();

class TextAnalyzer {
    constructor() {
        this.stats = {
            vowels: 0,
            consonants: 0,
            spaces: 0,
            punctuation: 0,
            words: 0,
            sentences: 0
        };
        this.vowelMap = new Map();
        this.consonantMap = new Map();
    }

    countVowels(text) {
        const vowels = text.match(/[aeiouAEIOU]/g) || [];
        vowels.forEach(v => {
            this.vowelMap.set(v.toLowerCase(), (this.vowelMap.get(v.toLowerCase()) || 0) + 1);
        });
        return vowels.length;
    }

    countConsonants(text) {
        const consonants = text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || [];
        consonants.forEach(c => {
            this.consonantMap.set(c.toLowerCase(), (this.consonantMap.get(c.toLowerCase()) || 0) + 1);
        });
        return consonants.length;
    }

    analyzeText(text) {
        this.stats.vowels = this.countVowels(text);
        this.stats.consonants = this.countConsonants(text);
        this.stats.spaces = (text.match(/\s/g) || []).length;
        this.stats.punctuation = (text.match(/[.,!?;:]/g) || []).length;
        this.stats.words = text.trim().split(/\s+/).length;
        this.stats.sentences = (text.match(/[.!?]+/g) || []).length;
        
        return this.stats;
    }

    getDetailedStats() {
        const vowelStats = [...this.vowelMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([vowel, count]) => `${vowel}: ${count}`);

        const consonantStats = [...this.consonantMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([consonant, count]) => `${consonant}: ${count}`);

        return {
            basicStats: this.stats,
            vowelFrequency: vowelStats,
            consonantFrequency: consonantStats
        };
    }
}

const analyzer = new TextAnalyzer();

async function processInput(text) {
    const stats = analyzer.analyzeText(text);
    
    if (options.stats) {
        const detailedStats = analyzer.getDetailedStats();
        console.log('\nDetailed Analysis:');
        console.log(chalk.cyan('Basic Statistics:'));
        console.log(chalk.green(`Vowels: ${detailedStats.basicStats.vowels}`));
        console.log(chalk.blue(`Consonants: ${detailedStats.basicStats.consonants}`));
        console.log(chalk.yellow(`Words: ${detailedStats.basicStats.words}`));
        console.log(chalk.magenta(`Sentences: ${detailedStats.basicStats.sentences}`));
        console.log(chalk.white(`Spaces: ${detailedStats.basicStats.spaces}`));
        console.log(chalk.gray(`Punctuation marks: ${detailedStats.basicStats.punctuation}`));
        
        console.log('\n' + chalk.cyan('Vowel Frequency:'));
        console.log(detailedStats.vowelFrequency.join(', '));
        
        console.log('\n' + chalk.cyan('Consonant Frequency:'));
        console.log(detailedStats.consonantFrequency.join(', '));
    } else {
        console.log(chalk.green(`${stats.vowels} vowels`), 'and', 
                    chalk.blue(`${stats.consonants} consonants`), 'found');
    }

    if (options.output) {
        const output = JSON.stringify(analyzer.getDetailedStats(), null, 2);
        await fs.writeFile(options.output, output);
        console.log(chalk.cyan(`\nResults saved to ${options.output}`));
    }
}

async function main() {
    if (options.file) {
        try {
            const text = await fs.readFile(options.file, 'utf8');
            await processInput(text);
        } catch (error) {
            console.error(chalk.red(`Error reading file: ${error.message}`));
            process.exit(1);
        }
    } else {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter a paragraph or text: ', async (input) => {
            await processInput(input);
            rl.close();
        });
    }
}

main().catch(error => {
    console.error(chalk.red(`An error occurred: ${error.message}`));
    process.exit(1);
});