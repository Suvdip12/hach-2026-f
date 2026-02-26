const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.git', '.next', 'public', '.gemini', 'dist', 'build', 'out'].includes(file)) continue;
        const fullPath = path.join(dir, file);
        try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                replaceInDir(fullPath);
            } else if (stat.isFile() && /\.(js|ts|jsx|tsx)$/.test(file)) {
                let fc = fs.readFileSync(fullPath, 'utf8');
                let orig = fc;

                // Tailwind classes
                fc = fc.replace(/bg-orange-/g, 'bg-blue-');
                fc = fc.replace(/text-orange-/g, 'text-blue-');
                fc = fc.replace(/border-orange-/g, 'border-blue-');
                fc = fc.replace(/ring-orange-/g, 'ring-blue-');
                fc = fc.replace(/shadow-orange-/g, 'shadow-blue-');

                fc = fc.replace(/bg-lime-/g, 'bg-purple-');
                fc = fc.replace(/text-lime-/g, 'text-purple-');
                fc = fc.replace(/border-lime-/g, 'border-purple-');
                fc = fc.replace(/ring-lime-/g, 'ring-purple-');
                fc = fc.replace(/shadow-lime-/g, 'shadow-purple-');

                if (fc !== orig) {
                    fs.writeFileSync(fullPath, fc, 'utf8');
                    console.log(`Updated tailwind classes in ${fullPath}`);
                }
            }
        } catch (e) { }
    }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Done scanning CSS classes.');
