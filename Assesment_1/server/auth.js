const axios = require('axios');

const TOKEN_EXPIRATION_BUFFER = 60 * 1000;

let accessToken = '';
let expiresAt = 0;
let renewingToken = false;
let renewTokenTimeout = null;

async function getAccessToken() {
  const authData = {"companyName":"Kongu Engineering College","clientID":"388b066f-3105-444b-9b9a-8a332a446d3a","clientSecret":"FPINyUWQlqQGYWKf","ownerName":"Sathish Kumar G","ownerEmail":"sathiskumqr1004@gmail.com","rollNo":"23MCR087"}

  try {
    const response = await axios.post('http://20.244.56.144/test/auth', authData);
    accessToken = response.data.access_token;
    expiresAt = Date.now() + (response.data.expires_in * 1000);
  } catch (error) {
    console.error(error);
  }
}

function isTokenExpiring() {
  return Date.now() + TOKEN_EXPIRATION_BUFFER >= expiresAt;
}

async function renewToken() {
  if (renewingToken) {
    while (renewingToken) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return accessToken;
  }

  renewingToken = true;
  try {
    if (isTokenExpiring()) {
      await getAccessToken();
    }
  } finally {
    renewingToken = false;
  }
  return accessToken;
}

async function scheduleRenewToken() {
  await renewToken();
  console.log("renewed token");
  renewTokenTimeout = setTimeout(scheduleRenewToken, 5 * 60 * 1000);
}

scheduleRenewToken();

module.exports = { getAccessToken, isTokenExpiring, renewToken, accessToken };