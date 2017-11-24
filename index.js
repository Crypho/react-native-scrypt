import { NativeModules } from 'react-native'

const { RNScrypt } = NativeModules

async function scrypt (passwd, salt, N=16384, r=8, p=1, dkLen=64) {
  const retval = await RNScrypt.scrypt(passwd, salt, N, r, p, dkLen)
  return retval
}

export default scrypt
