const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../app/candidate/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix non-existent colors
  content = content.replace(/slate-650/g, 'slate-600');
  content = content.replace(/indigo-650/g, 'indigo-600');
  content = content.replace(/blue-650/g, 'blue-600');

  // Fix inputs having too dark background in light mode
  content = content.replace(/bg-slate-950\/40/g, 'bg-slate-50 dark:bg-slate-950/40');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[fix-contrast] Finalized ${file}`);
});
