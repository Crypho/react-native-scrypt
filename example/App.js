/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native'
import scrypt from 'react-native-scrypt'
import sjcl from './sjcl'
import {randomBytes} from 'react-native-randombytes'
import {assert} from 'chai'
import {Buffer} from 'buffer'
import testVectors from './test_vectors'

function seeded() {
  return new Promise(resolve => {
    if (sjcl.random.isReady()) {
      resolve()
    } else {
      sjcl.random.addEventListener('seeded', resolve)
    }
  })
}

export default class App extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      sjcl: '...',
      libscrypt: '...',
      ready: false,
      tests: 0,
      passedTests: 0,
    }
  }

  async test(name, callback) {
    console.log(`Executing ${name}...`)
    const start = Date.now()
    try {
      await callback()
      console.log(`Test ${name} passed in ${Date.now() - start}ms`)
      this.setState({tests: this.state.tests + 1, passedTests: this.state.passedTests + 1})
    } catch (error) {
      console.warn(`Test ${name} failed in ${Date.now() - start}ms with error`, error)
      this.setState({tests: this.state.tests + 1})
    }
  }

  async componentDidMount() {
    await seeded()
    await this.generateRandomTestVector()
    await this.runExample()
  }

  async generateRandomTestVector() {
    // add a random test vector with non-ASCII characters
    console.log('generating random test vector')
    const testVector = {
      password: await randomBytes(64),
      salt: await randomBytes(64),
      N: 16384,
      r: 8,
      p: 1,
      dkLen: 64,
      skipInLegacy: true,
    }
    testVector.expected = Buffer.from(
      sjcl.codec.hex.fromBits(
        sjcl.misc.scrypt(
          sjcl.codec.hex.toBits(testVector.password.toString('hex')),
          sjcl.codec.hex.toBits(testVector.salt.toString('hex')),
          testVector.N,
          testVector.r,
          testVector.p,
          testVector.dkLen * 8,
        ),
      ),
      'hex',
    )
    testVectors.push(testVector)
    console.log('random test vector generated')
  }

  async runExample() {
    console.log('running quick example', testVectors.length)
    await this.sjclScrypt(testVectors[21])
    console.log('control sjcl scrypt done')
    await this.libScrypt(testVectors[21])
    console.log('native scrypt done')
    this.setState({ready: true})
  }

  async startTests() {
    if (this.state.ready === false) {
      return
    }
    this.setState({ready: false, tests: 0, passedTests: 0})
    console.log('starting tests...')

    for (let i = 0; i < testVectors.length; i++) {
      const {password, salt, N, r, p, dkLen, expected, skipInLegacy = false} = testVectors[i]
      if (!skipInLegacy) {
        await this.test(`Test vector ${i + 1} with encoding legacy`, async () => {
          const encodedPassword = password.toString('utf-8')
          const encodedSalt = sjcl.codec.utf8String.toBits(salt.toString('utf-8'))
          const actualResult = await scrypt(encodedPassword, encodedSalt, N, r, p, dkLen)
          assert.strictEqual(actualResult, expected.toString('hex'))
        })
      }
    }

    for (let i = 0; i < testVectors.length; i++) {
      const {password, salt, N, r, p, dkLen, expected} = testVectors[i]
      await this.test(`Test vector ${i + 1} with encoding base64`, async () => {
        const encodedPassword = password.toString('base64')
        const encodedSalt = salt.toString('base64')
        const actualResult = await scrypt(encodedPassword, encodedSalt, N, r, p, dkLen, 'base64')
        assert.strictEqual(actualResult, expected.toString('base64'))
      })
    }

    for (let i = 0; i < testVectors.length; i++) {
      const {password, salt, N, r, p, dkLen, expected} = testVectors[i]
      await this.test(`Test vector ${i + 1} with encoding hex`, async () => {
        const encodedPassword = password.toString('hex')
        const encodedSalt = salt.toString('hex')
        const actualResult = await scrypt(encodedPassword, encodedSalt, N, r, p, dkLen, 'hex')
        assert.strictEqual(actualResult, expected.toString('hex'))
      })
    }

    for (let i = 0; i < testVectors.length; i++) {
      const {password, salt, N, r, p, dkLen, expected} = testVectors[i]
      await this.test(`Test vector ${i + 1} with encoding buffer`, async () => {
        const encodedPassword = password
        const encodedSalt = salt
        const actualResult = await scrypt(encodedPassword, encodedSalt, N, r, p, dkLen, 'buffer')
        assert.isTrue(actualResult.equals(expected))
      })
    }

    if (this.state.tests === this.state.passedTests) {
      console.log(`All ${this.state.tests} passed.`)
    } else {
      console.error(
        `${this.state.passedTests} / ${this.state.tests} passed, ${this.state.tests - this.state.passedTests} failed.`,
      )
    }
    this.setState({ready: true})
  }

  async sjclScrypt(testVector) {
    const password = sjcl.codec.hex.toBits(testVector.password.toString('hex'))
    const salt = sjcl.codec.hex.toBits(testVector.salt.toString('hex'))
    const N = testVector.N
    const r = testVector.r
    const p = testVector.p
    const dkLen = testVector.dkLen * 8

    const start = Date.now()
    const sjclScrypt = sjcl.misc.scrypt(password, salt, N, r, p, dkLen)
    const elapsed = Date.now() - start

    this.setState({sjcl: `${sjcl.codec.hex.fromBits(sjclScrypt)} ${elapsed}ms`})
  }

  async libScrypt(testVector) {
    const password = testVector.password.toString('utf-8')
    const salt = sjcl.codec.hex.toBits(testVector.salt.toString('hex'))
    const N = testVector.N
    const r = testVector.r
    const p = testVector.p
    const dkLen = testVector.dkLen

    const start = Date.now()
    const libScrypt = await scrypt(password, salt, N, r, p, dkLen)
    const elapsed = Date.now() - start

    this.setState({libscrypt: `${libScrypt} ${elapsed}ms`})
    return libScrypt
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{`sjcl: ${this.state.sjcl}`}</Text>
        <Text style={styles.text}>{`react-native-scrypt: ${this.state.libscrypt}`}</Text>
        <Button onPress={() => this.startTests()} title="Start tests" disabled={!this.state.ready} />
        <ActivityIndicator animating={!this.state.ready} />
        <Text style={styles.text}>{`${this.state.passedTests} / ${this.state.tests} passed`}</Text>
        <Text style={styles.text}>{`${this.state.tests - this.state.passedTests} / ${this.state.tests} failed`}</Text>
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
