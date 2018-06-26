// const createError = require('http-errors');
// const uuid = require('uuid');

const songs = [
  {
    id: 'c44be829-3d89-4b70-80be-177b7633bc5b',
    name: 'qwe qwe'
  },
  {
    id: 'c44be829-3d89-4b70-80be-1773763abc5b',
    name: '123 123'
  },
  {
    id: '1234e829-3d89-4b70-80be-1773763abc5b',
    name: 'opop'
  }
];

function list() {
  return Promise.resolve(songs);
}

function get(songId) {
  const wantedSong = songs.find((song) => song.id === songId);
  return Promise.resolve(wantedSong);
}

module.exports = {
  list,
  get
};
