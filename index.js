const spell = require('spell')
const EventEmitter = require('events')
const HdKeyring = require('eth-hd-keyring')
const words = require('bip39/wordlists/english.json')
const dict = spell()

dict.load(words.join(' '))

class Guesser extends EventEmitter {

  constructor(opts) {
    super()
    const { phrase, getBalance } = opts
    this.phrase = phrase
    this.getBalance = getBalance

    this.cleanup()
  }

  cleanup () {
    this.phrase = this.phrase.split(' ')
    .filter((word) => {
      return word !== ''
    })
    .map((word) => {
      const suggestions = dict.suggest(word)
      if (suggestions.length === 1) {
        return suggestions[0].word
      } else {
        return word
      }
    })
    .join(' ')
  }

  async guess (depth = 5) {
    this.depth = depth

    if (this.result) {
      return this.emit('found', this.result)
    }

    const keyring = new HdKeyring({
      mnemonic: this.phrase,
      numberOfAccounts: this.depth,
    })

    const accounts = await keyring.getAccounts()
    let balances = await Promise.all(accounts.map((account) => {
      return this.getBalance(account)
    }))
    balances = balances.filter(balance => balance.toString() !== '0')

    if (balances.length > 0) {
      this.result = this.phrase
      return this.emit('found', this.result)
    }

    return this.emit('gave-up')
  }

}

module.exports = Guesser

