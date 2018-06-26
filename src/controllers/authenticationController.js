const express = require('express');
const querystring = require('querystring');
const request = require('request');
const authenticationService = require('../services/authenticationService');

const CLIENT_ID = 'cef0240898234a69b3c60dce6d4e4f7d';
const CLIENT_SECRET = '269b977816da48d09c9d69a59902fe49';
const UI_BASE_URI = 'http://0.0.0.0:3000';
const API_BASE_URI = 'http://0.0.0.0:3001';
const REDIRECT_URI = `${API_BASE_URI}/api/callback`;
const SPOTIFY_BASE_URI = 'https://accounts.spotify.com';
const TOKEN_URL = `${SPOTIFY_BASE_URI}/api/token`;

const STATE_KEY = 'spotify_auth_state';
const SCOPE = 'user-read-private user-read-email';
const AUTH_RESPONSE_TYPE = 'code';
const STATE_MISMATCH_ERROR_MESSAGE = 'state_mismatch';
const INVALID_TOKEN_ERROR_MESSAGE = 'invalid_token';
const GRANT_TYPE = 'authorization_code';
const REFRESH_GRANT_TYPE = 'refresh_token';

const REFRESH_TOKEN = 'refresh_token';
const REQUEST_TOKEN = 'refresh_token';

function getProfile(req, res, next) {
  return authenticationService
    .getProfile({ authorization: req.headers.authorization })
    .then((user) => res.status(200).json(user))
    .catch(next);
}

function login(req, res) {
  const state = generateRandomString(16);
  const query = querystring.stringify({
    response_type: AUTH_RESPONSE_TYPE,
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state
  });

  res.cookie(STATE_KEY, state);
  res.redirect(`${SPOTIFY_BASE_URI}/authorize?${query}`);
}

function requestToken(req, res) {
  const { state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  let query;

  if (state === null || state !== storedState) {
    query = querystring.stringify({ error: STATE_MISMATCH_ERROR_MESSAGE });
    res.redirect(`${UI_BASE_URI}/#${query}`);
  } else {
    const authOptions = buildAuthOptions({ type: REQUEST_TOKEN, query: req.query });

    res.clearCookie(STATE_KEY);
    request.post(authOptions, requestTokenCallback);
  }

  function requestTokenCallback(error, response, body) {
    if (!error && response.statusCode === 200) {
      query = querystring.stringify({
        access_token: body.access_token,
        refresh_token: body.refresh_token
      });
    } else {
      query = querystring.stringify({ error: INVALID_TOKEN_ERROR_MESSAGE });
    }
    res.redirect(`${UI_BASE_URI}/#${query}`);
  }
}

function refreshToken(req, res) {
  const authOptions = buildAuthOptions({ type: REFRESH_TOKEN, query: req.query });

  request.post(authOptions, refreshTokenCallback);

  function refreshTokenCallback(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send({ access_token: body.access_token });
    }
  }
}

function buildAuthOptions({ type, query }) {
  const clientCredentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const authOptions = {
    url: TOKEN_URL,
    headers: { Authorization: `Basic ${clientCredentials}` },
    json: true
  };

  if (type === REQUEST_TOKEN) {
    authOptions.form = {
      redirect_uri: REDIRECT_URI,
      code: query.code,
      grant_type: GRANT_TYPE
    };
  } else {
    authOptions.form = {
      grant_type: REFRESH_GRANT_TYPE,
      refresh_token: query.refresh_token
    };
  }

  return authOptions;
}

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = express
  .Router()
  .get('/me', getProfile)
  .get('/login', login)
  .get('/callback', requestToken)
  .get('/refresh_token', refreshToken);
