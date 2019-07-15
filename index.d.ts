declare module "react-native-scrypt" {
  const scrypt: (
    password: string,
    salt: string,
    cost?: number,
    blocksize?: number,
    parallel?: number,
    length?: number
  ) => string;
  export default scrypt;
}
