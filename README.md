
# react-native-scrypt

Non blocking and fast scrypt React native module powered by [libscrypt](https://github.com/technion/libscrypt).

## Benchmark

React Native 0.49 - JavaScriptCore

| Platform | SJCL.misc.scrypt | react-native-scrypt |
|:--------:|:----------------:|:-------------------:|
| Android  | 68396ms          | 867ms               |
| iOS      | ?ms              | ?ms                 |

- Android: Nexus 5 Android 6.0.1
- iOS: iPhone SE iOS 11.1.2

## Getting started

`$ npm install react-native-scrypt --save`

### Mostly automatic installation

`$ react-native link react-native-scrypt`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-scrypt` and add `RNScrypt.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNScrypt.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNScryptPackage;` to the imports at the top of the file
  - Add `new RNScryptPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-scrypt'
  	project(':react-native-scrypt').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-scrypt/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-scrypt')
  	```

## Usage
```javascript
import scrypt from 'react-native-scrypt';

// passwd must be a string
// salt must be an array of bytes integers
// see example/App.js

const result = await scrypt(passwd, salt[, N=16384, r=8, p=1, dkLen=64])
```
