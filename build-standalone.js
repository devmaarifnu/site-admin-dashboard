const fs = require('fs');
const path = require('path');

console.log('🚀 Starting standalone build process...\n');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  const standaloneDir = path.join(process.cwd(), '.next', 'standalone');

  if (!fs.existsSync(standaloneDir)) {
    console.error('❌ Error: .next/standalone directory not found.');
    console.error('Please run "npm run build" first.\n');
    process.exit(1);
  }

  console.log('📦 Copying static files...');
  const staticSrc = path.join(process.cwd(), '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');

  if (fs.existsSync(staticSrc)) {
    copyDir(staticSrc, staticDest);
    console.log('✅ Static files copied');
  }

  console.log('📦 Copying public files...');
  const publicSrc = path.join(process.cwd(), 'public');
  const publicDest = path.join(standaloneDir, 'public');

  if (fs.existsSync(publicSrc)) {
    copyDir(publicSrc, publicDest);
    console.log('✅ Public files copied');
  }

  console.log('📦 Copying .env file...');
  const envSrc = path.join(process.cwd(), '.env');
  const envDest = path.join(standaloneDir, '.env');

  if (fs.existsSync(envSrc)) {
    fs.copyFileSync(envSrc, envDest);
    console.log('✅ .env file copied');
  }

  console.log('\n✨ Standalone build complete!');
  console.log('\n📂 Output directory: .next/standalone');
  console.log('\n🚀 To run the standalone server:');
  console.log('   cd .next/standalone');
  console.log('   node server.js');
  console.log('\n📝 Or use: npm run start:standalone\n');

} catch (error) {
  console.error('❌ Error during standalone build:', error.message);
  process.exit(1);
}
