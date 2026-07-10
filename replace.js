const fs = require('fs');
const path = require('path');

function replaceInDir(dir, oldText, newText) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === 'dist' || file === '.git') {
            continue;
        }
        
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            replaceInDir(filePath, oldText, newText);
        } else if (stat.isFile() && /\.(js|jsx|ts|tsx|md|json|html)$/.test(file)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldText)) {
                const newContent = content.replace(new RegExp(oldText, 'g'), newText);
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

const targetDir = path.resolve('c:/Users/The King/OneDrive/Desktop/gaya ji/gaya-connect');
console.log(`Starting replacement in ${targetDir}`);
replaceInDir(targetDir, 'Gaya Seva', 'Gaya Seva');
replaceInDir(targetDir, 'GayaSeva', 'GayaSeva');
console.log('Finished.');
