const fetch = require('node-fetch');

const BASE_URI = 'https://api.spotify.com/v1';

function getProfile(context) {
  const url = `${BASE_URI}/me`;
  const headers = {
    Authorization: `${context.authorization}`
  };

  return fetch(url, { headers })
    .then((response) => response.json());
}

module.exports = {
  getProfile
};
