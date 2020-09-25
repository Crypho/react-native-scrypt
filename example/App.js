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
import {randomBytes} from 'react-native-randombytes'

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
    const password = (await randomBytes(64)).toString('hex')
    const salt = (await randomBytes(64)).toString('hex')
    await this.libScrypt(password, salt)
    await this.sjclScrypt(password, salt)
  }

  async sjclScrypt(password, salt) {
    const start = Date.now()
    const sjclScrypt = sjcl.codec.hex.fromBits(
      sjcl.misc.scrypt(
        sjcl.codec.hex.toBits(password),
        sjcl.codec.hex.toBits(salt),
        ...params,
        length * 8,
      ),
    )
    this.setState({sjcl: `${sjclScrypt} ${Date.now() - start}ms`})
    return sjclScrypt
  }

  async libScrypt(password, salt) {
    const start = Date.now()
    const libScrypt = await scrypt(password, salt, ...params, length)
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
