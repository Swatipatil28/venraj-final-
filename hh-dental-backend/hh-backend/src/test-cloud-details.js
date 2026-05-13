const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudDetails() {
  console.log('--- Verifying Cloud Details ---');
  try {
    const result = await cloudinary.api.usage();
    console.log('✅ Success: API Keys are valid!');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('Plan:', result.plan);
    console.log('Usage:', result.objects.usage, '/', result.objects.limit);
  } catch (error) {
    console.error('❌ Failed:');
    console.error(error);
  }
}

testCloudDetails();
