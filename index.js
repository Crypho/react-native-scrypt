import { NativeModules } from 'react-native'

const { RNScrypt } = NativeModules

export async function scryptB64 (passwd, salt, N=16384, r=8, p=1, dkLen=64) {
  return RNScrypt.scrypt_b64(passwd, salt, N, r, p, dkLen)
}

export default async function scrypt (passwd, salt, N=16384, r=8, p=1, dkLen=64) {
  return RNScrypt.scrypt(passwd, salt, N, r, p, dkLen)
}
