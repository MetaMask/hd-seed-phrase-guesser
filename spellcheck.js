const spell = require('spell')
const EventEmitter = require('events')
const HdKeyring = require('eth-hd-keyring')
const words = require('bip39/wordlists/english.json')
const dict = spell()

dict.load(words.join(' '))

console.log(dict.suggest('cra'))

