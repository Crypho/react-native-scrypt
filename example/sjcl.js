// We require buffer and process to get the crypto module to work
global.Buffer = require('buffer').Buffer
console.log(global.Buffer)
global.process = require('process')
const crypto = require('crypto')

// Then replace randomBytes with native implementations
const randomBytes = require('react-native-randombytes').randomBytes
crypto.randomBytes = randomBytes

// Finally seed it asyncronously with native random bytes.
crypto.randomBytes(1024/8, (err, buff) => {
    buff = new Uint32Array(new Uint8Array(buff).buffer)
    sjcl.random.addEntropy(buff, 1024, 'crypto.randomBytes')
})

global.sjcl = require('sjcl')
require('sjcl/core/scrypt')
require('sjcl/core/codecBytes')

export default global.sjcl