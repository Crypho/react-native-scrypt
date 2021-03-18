// Type definitions for react-native-scrypt 1.2.0
// Project: https://github.com/Crypho/react-native-scrypt
// Definitions by: Yiorgis Gozadinos <https://github.com/ggozad>
//                 Maddi Joyce <https://github.com/maddijoyce>
//                 Timothée Rebours <https://github.com/tex0l>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

declare module 'react-native-scrypt' {
  function scrypt (
    password: string,
    salt: number[],
    cost?: number,
    blocksize?: number,
    parallel?: number,
    length?: number,
    encoding?: 'legacy'
  ): Promise<string>;
  function scrypt (
    password: Buffer,
    salt: Buffer,
    cost?: number,
    blocksize?: number,
    parallel?: number,
    length?: number,
    encoding?: 'buffer'
  ): Promise<Buffer>;
  function scrypt (
    password: string,
    salt: string,
    cost?: number,
    blocksize?: number,
    parallel?: number,
    length?: number,
    encoding?: 'hex' | 'base64'
  ): Promise<string>;
  export default scrypt
}
