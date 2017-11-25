/**
 * Created by ABCD on 2015/11/18.
 */

const MD5 = require('vendor/scripts/md5')
const SHA512 = require('vendor/scripts/sha512')

const Encryption = Base.PrefabView.extend({

  initialize () {
  },
  render () {
    return this
  },

  encrypt (password, salt) {
    return SHA512.hex_sha512(`${MD5.hex_md5(`${password}`)}${salt}`)
  },

  encryptSha (data) {
    return SHA512.hex_sha512(`${data}`)
  },
})

module.exports = Encryption
