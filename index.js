import { NativeModules } from 'react-native'
import { Buffer } from 'buffer'

const { RNScrypt } = NativeModules

/**
 * Copied from SJCL, bitArray.js#bitLength and bitArray.js#getPartial
 * Find the length of an array of bits.
 * @param {sjcl.bitArray} array The array.
 * @return {Number} The length of a, in bits.
 */
const bitLength = array => {
  const l = array.length
  if (l === 0) return 0
  const x = array[l - 1]
  return (l - 1) * 32 + (Math.round(x / 0x10000000000) || 32)
}
/**
 * Inspired from SJCL's codecBytes.js#frombits
 * @param {sjcl.bitArray} array The array.
 * @returns {Buffer}
 */
const bitArrayToBuffer = array => {
  const bl = bitLength(array)
  const out = Buffer.alloc(bl / 8)
  let tmp
  for (let i = 0; i < bl / 8; i++) {
    if ((i & 3) === 0) tmp = array[i / 4]
    out[i] = tmp >>> 24
    tmp <<= 8
  }
  return out
}

export default async function scrypt (passwd, salt, N = 16384, r = 8, p = 1, dkLen = 64, encoding = 'legacy') {
  let encodedInput = passwd
  let encodedSalt = salt
  if (encoding === 'legacy') {
    encodedInput = Buffer.from(passwd, 'utf-8').toString('hex')
    encodedSalt = bitArrayToBuffer(salt).toString('hex')
  } else if (encoding === 'base64') {
    encodedInput = Buffer.from(passwd, 'base64').toString('hex')
    encodedSalt = Buffer.from(salt, 'base64').toString('hex')
  } else if (encoding === 'buffer') {
    encodedInput = passwd.toString('hex')
    encodedSalt = salt.toString('hex')
  } else if (encoding !== 'hex') throw new Error(`Encoding ${encoding} is invalid, it must be 'legacy', 'base64', 'hex' or 'buffer'`)

  const result = await RNScrypt.scrypt(encodedInput, encodedSalt, N, r, p, dkLen)
  if (encoding === 'base64') return Buffer.from(result, 'hex').toString('base64')
  else if (encoding === 'buffer') return Buffer.from(result, 'hex')
  else return result
}
