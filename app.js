const COMBINED_KEY = 'COMBINED_KEY'

const host = 'https://listenhistory.herokuapp.com'

const USER_ID = COMBINED_KEY.split("_")[0]
const USER_SECRET = COMBINED_KEY.split("_")[1]

require('es6-promise').polyfill()
require('isomorphic-fetch')
var itunes = require('playback')
var FormData = require('form-data')

function call_api(path, method, opts) {
  var params = opts.params || {};
  var headers = opts.headers || {};
  var data = new FormData()
  Object.keys(params).forEach(key => {
    data.append(key, params[key])
  })
  return fetch(host + path, {
    method: method, body: data, headers: headers
  })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}

call_api('/api/users/' + USER_ID, 'put', {params: {secret: USER_SECRET}})
  .then(resp => {
    resp.json().then(json => {
      token = JSON.parse(json).token
      start_app(token)
    })
  })
  .catch(resp => {
    console.error("Failed to get token")
  })

function start_app(token) {
  itunes.on('playing', data => {
    var name = data.name, album = data.album, artist = data.artist;
    call_api('/api/users/' + USER_ID + '/play', 'post', {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      params: {
        artist: artist,
        album: album,
        song: name
      }
    })
      .then(resp => {
        console.log('Play: ' + artist + ', ' + album + ', ' + name)
      })
      .catch(resp => {
        console.error(resp)
      })
  })
}
