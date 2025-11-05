const https = require('https');

const options = {
  hostname: 'your-backend-api.com',
  path: '/api/changelog-updated',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  message: 'Changelog has been updated!',
  timestamp: new Date().toISOString()
});

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
  process.exit(1); // Exit with a non-zero code to fail the workflow step
});

req.write(data);
req.end();