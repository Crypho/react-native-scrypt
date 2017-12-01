/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import scrypt from 'react-native-scrypt'

global.sjcl = require('sjcl')
require('sjcl/core/scrypt')
require('sjcl/core/codecBytes')

const password = 'correct horse battery staple'
const salt = sjcl.random.randomWords(2)
const params = [16384, 8, 1]
const length = 64

;(async () => {

  console.time('sjcl')
  const sjclScrypt = sjcl.codec.hex.fromBits(sjcl.misc.scrypt(password, salt, ...params, length * 8))
  console.timeEnd('sjcl')

  console.time('libscrypt')
  const libScrypt = await scrypt(password, sjcl.codec.bytes.fromBits(salt), ...params, length)
  console.timeEnd('libscrypt')

  console.log(sjclScrypt, libScrypt)
})()

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
