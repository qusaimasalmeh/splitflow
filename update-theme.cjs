const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Global replacements for the "White & Green" flat theme:
  
  // 1. Remove glassmorphism backgrounds
  content = content.replace(/bg-white\/(40|50|60|80|95)/g, 'bg-white');
  content = content.replace(/bg-slate-900\/(60|80)/g, 'bg-slate-50');
  content = content.replace(/bg-slate-950\/(60|80)/g, 'bg-slate-100');
  
  // 2. Remove backdrop blurs
  content = content.replace(/backdrop-blur-(md|xl|2xl|sm)/g, '');
  content = content.replace(/backdrop-blur/g, '');

  // 3. Change all teal to emerald (green)
  content = content.replace(/teal-/g, 'emerald-');
  
  // 4. Change some specific white text back to dark
  content = content.replace(/text-white/g, 'text-white'); // keep text-white on emerald buttons
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Update index.css
const indexCssPath = path.join(srcDir, 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');
indexCss = indexCss.replace(/background: linear-gradient.*/, 'background: #f3f4f6;');
indexCss = indexCss.replace(/rgba\(255, 255, 255, 0\.65\)/g, '#ffffff');
indexCss = indexCss.replace(/rgba\(255, 255, 255, 0\.5\)/g, '#ffffff');
indexCss = indexCss.replace(/backdrop-filter:.*/g, '');
indexCss = indexCss.replace(/-webkit-backdrop-filter:.*/g, '');
fs.writeFileSync(indexCssPath, indexCss, 'utf8');

// 2. Walk components
walkDir(path.join(srcDir, 'components'), processFile);
walkDir(path.join(srcDir, 'core'), processFile);
processFile(path.join(srcDir, 'App.tsx'));
