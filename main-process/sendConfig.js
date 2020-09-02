const axios = require('axios')

module.exports = function sendConfig(opts) {
  var opts = opts || {}
  return new Promise((resolve, reject) => {
    axios(opts)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
}
