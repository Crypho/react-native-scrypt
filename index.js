import { NativeModules } from 'react-native'

const { RNScrypt } = NativeModules

async function scrypt (passwd, salt, N, r, p, dkLen) {
  alert(RNScrypt)
  const retval:string = await RNScrypt.scrypt(passwd, salt, N, r, p, dkLen)
  return retval
}

export default scrypt
