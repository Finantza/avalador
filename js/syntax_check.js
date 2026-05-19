const fs = require('fs');
const path = require('path');
const vm = require('vm');

const directories = [
    'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\js',
    'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\legacy'
];

let hasErrors = false;

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(dir, file);
            const code = fs.readFileSync(filePath, 'utf8');
            try {
                new vm.Script(code, { filename: file });
                console.log(`✅ ${file}: Syntax OK`);
            } catch (err) {
                console.error(`❌ ${file}: Syntax Error in ${filePath}!`);
                console.error(err.stack);
                hasErrors = true;
            }
        }
    });
});

process.exit(hasErrors ? 1 : 0);
