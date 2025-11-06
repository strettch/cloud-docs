const https = require('https');


const summary = process.env.RELEASE_SUMMARY;
const versionTag = process.env.VERSION_TAG;
const title = process.env.RELEASE_TITLE;
const imageUrl = process.env.RELEASE_IMAGE_URL;
const apiToken = process.env.BACKEND_API_SECRET;


if (!summary) {
  console.error("FATAL ERROR: RELEASE_SUMMARY missing from workflow inputs.");
  process.exit(1);
}


const options = {
  hostname: 'changelog-api.strettchcloud.com', 
  path: '/api/changelog',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}` 
  }
};


const requestBody = JSON.stringify({
  summary: summary, 
  tag: versionTag,
  title: title,
  imageUrl: imageUrl,
  timestamp: new Date().toISOString()
});

console.log(`Sending notification for version: ${versionTag}`);
console.log(`Payload: ${requestBody}`);

const req = https.request(options, res => {
  console.log(`API Response Status Code: ${res.statusCode}`);
  if (res.statusCode < 200 || res.statusCode >= 300) {
      console.error(`API call failed with status: ${res.statusCode}`);
      process.exit(1);
  }

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error during API request:', error);
  process.exit(1);
});

req.write(requestBody);
req.end();