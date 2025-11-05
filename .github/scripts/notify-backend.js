const https = require('https');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const workspace = process.env.GITHUB_WORKSPACE;
const newChangelogPath = path.join(workspace, 'changelog.mdx');
const newFileContent = fs.readFileSync(newChangelogPath, 'utf8');
const { data: newFrontmatter } = matter(newFileContent);
const newSummary = newFrontmatter.summary;


const oldChangelogPath = path.join(__dirname, 'old_changelog.mdx');
const oldFileContent = fs.readFileSync(oldChangelogPath, 'utf8');
const { data: oldFrontmatter } = matter(oldFileContent);
const oldSummary = oldFrontmatter.summary;
if (!newSummary) {
  console.error("Error: 'summary' not found in changelog.mdx frontmatter.");
  process.exit(1); 
}

if (newSummary === oldSummary) {
  console.log('Summary is unchanged. Skipping notification.');
  process.exit(0); 
}
console.log('Summary has changed. Sending notification...');
const options = {
  hostname: 'changelog-api.strettchcloud.com',
  path: '/api/changelog',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':'Bearer a6d20a8a-3eb2-42f7-9762-5c8a1ec0b464'
  }
};

const requestBody = JSON.stringify({
  message: 'Changelog has been updated!',
  summary: newSummary,
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
  process.exit(1);
});

req.write(requestBody);
req.end();