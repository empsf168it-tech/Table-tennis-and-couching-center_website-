const fs = require('fs');
const path = require('path');

function processFiles() {
    const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;
        
        // 1. CTA gradient removal
        content = content.replace(/background:\s*linear-gradient\([^)]+\)/g, 'background: var(--primary)');
        
        // 2. Icon and Tag color replacement
        content = content.replace(/<[^>]+style="[^"]*var\(--(?:accent|secondary)\)[^"]*"[^>]*>/g, match => {
            if (match.includes('<i ') || match.toLowerCase().includes('icon') || match.toLowerCase().includes('tag') || match.toLowerCase().includes('radius')) {
                let replaced = match.replace(/var\(--accent\)/g, 'var(--primary)');
                replaced = replaced.replace(/var\(--secondary\)/g, 'var(--primary)');
                return replaced;
            }
            return match;
        });

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated ' + file);
        }
    }
}

processFiles();
