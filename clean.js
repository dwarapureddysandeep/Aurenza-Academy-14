const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');

if (fs.existsSync(nextDir)) {
  console.log('[Aurenza Clean] Cleaning Next.js build cache and directory...');
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('[Aurenza Clean] Successfully cleared .next directory.');
  } catch (err) {
    console.error('[Aurenza Clean] Failed to clear .next directory:', err.message);
  }
} else {
  console.log('[Aurenza Clean] No .next directory found. Starting fresh.');
}
