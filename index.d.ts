declare module "react-native-scrypt" {
  const scrypt: (
    password: string,
    salt: number[],
    cost?: number,
    blocksize?: number,
    parallel?: number,
    length?: number
  ) => Promise<string>;
  export default scrypt;
}
