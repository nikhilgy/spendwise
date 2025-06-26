// test-google-fetch.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

fetch('https://www.googleapis.com/oauth2/v3/userinfo')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);