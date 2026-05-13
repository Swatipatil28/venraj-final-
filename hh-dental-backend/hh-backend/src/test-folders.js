const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testFolders() {
  console.log('--- Testing Folder Access ---');
  try {
    const result = await cloudinary.api.root_folders();
    console.log('✅ Success: Can list folders!');
    console.log('Folders:', result.folders.map(f => f.name));
  } catch (error) {
    console.error('❌ Failed:');
    console.error(error);
  }
}

testFolders();
