const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\The King\\.gemini\\antigravity\\brain\\76461793-3481-4740-8d55-5aca9e48c640';
const publicDir = 'c:\\Users\\The King\\OneDrive\\Desktop\\gaya ji\\gaya-connect\\frontend\\public';
const targetDir = path.join(publicDir, 'images');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Find files in artifact dir that start with gaya_seva
const files = fs.readdirSync(artifactDir);
const images = files.filter(f => f.startsWith('gaya_seva') && f.endsWith('.png'));

images.forEach(file => {
    let targetName = file;
    let destDir = targetDir; // default to public/images

    if (file.includes('app_icon')) {
        targetName = 'gaya_seva_app_icon.png';
        destDir = publicDir; // app icon goes directly to public/
    }
    else if (file.includes('nav_logo')) targetName = 'gaya_seva_nav_logo.png';
    else if (file.includes('logo')) targetName = 'gaya_seva_logo.png';
    else if (file.includes('banner')) targetName = 'gaya_seva_hero_banner.png';
    else if (file.includes('marketing')) targetName = 'gaya_seva_marketing.png';

    fs.copyFileSync(path.join(artifactDir, file), path.join(destDir, targetName));
    console.log(`Copied ${targetName} to ${destDir.includes('images') ? 'public/images' : 'public'} folder`);
});

console.log('✅ All assets updated successfully!');
