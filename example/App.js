/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import scrypt from 'react-native-scrypt'
import sjcl from './sjcl'

const password = 'correct horse battery staple'
const params = [16384, 8, 1]
const length = 64

function seeded() {
  return new Promise(resolve => {
    if (sjcl.random.isReady()) resolve()
    else sjcl.random.addEventListener('seeded', resolve)
  })
}

export default class App extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      sjcl: '...',
      libscrypt: '...',
    }
  }

  async componentDidMount() {
    await seeded()
    const salt = sjcl.random.randomWords(2)
    await this.libScrypt(salt)
    await this.sjclScrypt(salt)
  }

  async sjclScrypt(salt) {
    const start = Date.now()
    const sjclScrypt = sjcl.codec.hex.fromBits(
      sjcl.misc.scrypt(password, salt, ...params, length * 8),
    )
    this.setState({sjcl: `${sjclScrypt} ${Date.now() - start}ms`})
    return sjclScrypt
  }

  async libScrypt(salt) {
    const start = Date.now()
    const libScrypt = await scrypt(
      password,
      sjcl.codec.bytes.fromBits(salt),
      ...params,
      length,
    )
    this.setState({libscrypt: `${libScrypt} ${Date.now() - start}ms`})
    return libScrypt
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{`sjcl: ${this.state.sjcl}`}</Text>
        <Text style={styles.text}>
          {`react-native-scrypt: ${this.state.libscrypt}`}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
