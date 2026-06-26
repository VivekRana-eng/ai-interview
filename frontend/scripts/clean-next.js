const fs = require('fs');

const target = '.next';

try {
  fs.rmSync(target, { recursive: true, force: true });
} catch (error) {
  const code = error && typeof error === 'object' ? error.code : undefined;

  // On Windows, .next can stay locked by a running Next.js process.
  // Keep dev startup resilient and let Next reuse the existing folder.
  if (code === 'EPERM' || code === 'EBUSY' || code === 'ENOENT') {
    console.warn(`[clean-next] Skipping ${target} cleanup (${code})`);
  } else {
    throw error;
  }
}
