const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../app/hireai-pro/components');

function cleanClassString(classStr) {
  // Split by whitespace
  const tokens = classStr.split(/\s+/).filter(Boolean);
  const newTokens = [];
  const processed = new Set();

  // Find all tokens with 'light:' prefix
  const lightTokens = tokens.filter(t => t.startsWith('light:'));
  
  for (const lt of lightTokens) {
    const base = lt.replace('light:', '');
    
    // Find if there's a corresponding 'dark:BASE' or just a 'dark:SOMETHING'
    // Let's determine the category of this class (e.g. 'bg', 'text', 'border', 'shadow', etc.)
    const category = base.split('-')[0]; // e.g. 'bg', 'text'
    
    // Find all dark classes in the same category
    const darkClasses = tokens.filter(t => t.startsWith('dark:') && t.startsWith(`dark:${category}`));
    // Find all default classes in the same category
    const defaultClasses = tokens.filter(t => !t.includes(':') && t.startsWith(category) && t !== 'border');

    if (darkClasses.length > 0) {
      // We have explicit dark classes. The default class should be the light one (base).
      newTokens.push(base);
      processed.add(lt);
      
      // Keep all dark classes
      for (const dc of darkClasses) {
        newTokens.push(dc);
        processed.add(dc);
      }
      
      // Mark default classes in this category as processed (so we discard the old dark defaults)
      for (const df of defaultClasses) {
        processed.add(df);
      }
    } else {
      // No explicit dark class, but we might have a default class that is actually the dark style
      // e.g. text-slate-200 text-slate-700
      const defaultClassesInCat = tokens.filter(t => !t.includes(':') && t.startsWith(category));
      
      if (defaultClassesInCat.length > 0) {
        // The light class becomes the default
        newTokens.push(base);
        processed.add(lt);
        
        // The old default class becomes the dark class
        for (const df of defaultClassesInCat) {
          if (df !== base) {
            newTokens.push(`dark:${df}`);
          }
          processed.add(df);
        }
      } else {
        // Just convert light:class to class
        newTokens.push(base);
        processed.add(lt);
      }
    }
  }

  // Add all other tokens that were not processed
  for (const t of tokens) {
    if (!processed.has(t)) {
      if (t.startsWith('light:')) {
        newTokens.push(t.replace('light:', ''));
      } else {
        newTokens.push(t);
      }
    }
  }

  return newTokens.join(' ');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Find all className="..." or className={`...`}
  // Match className="any characters inside quotes"
  const classRegex = /className="([^"]+)"/g;
  content = content.replace(classRegex, (match, classStr) => {
    if (classStr.includes('light:')) {
      const cleaned = cleanClassString(classStr);
      return `className="${cleaned}"`;
    }
    return match;
  });

  // Match className={`any characters inside backticks`}
  const templateRegex = /className={`([^`]+)`}/g;
  content = content.replace(templateRegex, (match, classStr) => {
    if (classStr.includes('light:')) {
      // Split template literal lines or handle them carefully
      // For simple ones, we can clean each word
      const cleaned = cleanClassString(classStr);
      return `className={\`${cleaned}\`}`;
    }
    return match;
  });

  // Also replace light: inside string variables or style mappings
  // Match text patterns like 'light:bg-rose-50'
  const stringRegex = /'([^']+)'.*light:/g;
  // Let's do a general regex replacement for any '...' containing light:
  content = content.replace(/'([^'\n]+)'/g, (match, str) => {
    if (str.includes('light:')) {
      return `'${cleanClassString(str)}'`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

// Read all files in the directory
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    processFile(path.join(dir, file));
  }
});
