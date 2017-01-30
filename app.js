const host = 'https://sha.herokuapp.com'

const USER_ID = 'a'
const USER_SECRET = 'NVpObXNRMHJHYksyOUM0aENHbiszWXNCUnZ6RzZHVmFDaHpZNWVENmNWRT0='

require('es6-promise').polyfill()
require('isomorphic-fetch')
var FormData = require('form-data')

function call_api(path, method, opts) {
  var params = opts.params || {}
  var headers = opts.headers || {}
  var data = new FormData()
  Object.keys(params).forEach(key => {
    data.append(key, params[key])
  })
  return fetch(host + path, {
    method: method, body: data, headers: headers
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })
}

call_api('/api/users/' + USER_ID, 'put', {params: {secret: USER_SECRET}})
  .then(resp => {
    resp.json().then(json => {
      token = json.token
      post(token, {text: 'from node.js!'})
    }).catch(resp => {
      console.error(resp)
    })
  })
  .catch(resp => {
    console.error('Failed to get token')
  })

function post(token, params) {
  call_api('/api/users/' + USER_ID + '/post', 'post', {
    headers: {
      'Authorization': 'Bearer ' + token
    },
    params
  }).then(resp => {
    console.log('posted!')
  }).catch(resp => {
    console.error(resp)
  })
}
