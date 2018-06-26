const songsService = require('../services/songsService');

function get(req, res, next) {
  const { songId } = req.params;

  return songsService.get(songId)
    .then((wantedChannel) => res.status(200).json(wantedChannel))
    .catch(next);
}

function list(req, res, next) {
  return songsService.list()
    .then((songs) => res.status(200).json(songs))
    .catch(next);
}

module.exports = {
  get,
  list
};
