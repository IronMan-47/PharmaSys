const fs = require('fs');
const path = require('path');

const dir = './src';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5001')) {
    content = content.replace(/'http:\/\/localhost:5001\/([^']+)'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5001\'}/$1`');
    // Also handle cases without trailing slash or path if any
    content = content.replace(/'http:\/\/localhost:5001'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5001\'}`');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
};

const walk = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  });
};

walk(dir);
