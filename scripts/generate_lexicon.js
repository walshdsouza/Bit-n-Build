const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '..', 'public', 'signs');
const outputFile = path.join(signsDir, 'lexicon.json');

function generateLexicon() {
    if (!fs.existsSync(signsDir)) {
        console.error(`Directory not found: ${signsDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(signsDir);
    const lexicon = {};

    for (const file of files) {
        if (file.endsWith('.sigml')) {
            const basename = path.basename(file, '.sigml');
            const upperName = basename.toUpperCase();
            lexicon[upperName] = `/signs/${file}`;
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(lexicon, null, 2), 'utf-8');
    console.log(`Lexicon generated at ${outputFile} with ${Object.keys(lexicon).length} entries.`);
}

generateLexicon();
