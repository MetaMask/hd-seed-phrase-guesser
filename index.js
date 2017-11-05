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

    this.candidates = this.phrase.split(' ').map((word) => {
      return dict.suggest(word)
    })

    this.tries = this.candidates.map(words => words.length)
    this.current = this.candidates.map(() => 1)

    let mnemonic = await this.tryAgain(this.currentTry())
    while (!mnemonic && this.canTryMore()) {
      const nextTry = this.getNextTry()
      mnemonic = await this.tryAgain(nextTry)
    }

    if (!mnemonic) {
      return this.emit('gave-up')
    }
  }

  canTryMore() {
    let maxed = true
    for (var i = 0; i < this.current.length; i++) {
      if (this.current[i] + 1 < this.candidates[i].length) {
         maxed = false
      }
    }
    console.log('can try more? ' + !maxed)
    return !maxed
  }

  getNextTry() {
    let next
    let { current, tries } = this
    console.log(JSON.stringify({current, tries}))
    for (let i = this.current.length - 1; i >= 0; i--) {
      console.log(`checking if current at ${i} is still less than tries: ${current[i]}, ${tries[i]}`)
      if (this.current[i] < this.tries[i]) {
        console.log('it is! Incrementing!')
        this.current[i]++
        for(let x = i + 1; x < this.tries.length; x++) {
          this.current[x] = 1
        }
        break
      }
    }

    return this.currentTry()


/*
    for (var i = 0; i < this.tries.length; i++) {
      if (this.tries[i] + 1 !== this.candidates[i].length) {
        this.tries[i]++
        return this.currentTry()
      }
    }
    */
  }

  currentTry () {
    return this.candidates.map((words, index) => {
      console.log(`Retrieving word at current index ${index} from words: ${JSON.stringify(words)} and this current: ${JSON.stringify(this.current)}`)
      return words[this.current[index] - 1].word
    })
    .join(' ')
  }


  async tryAgain(mnemonic) {
    this.emit('trying', mnemonic)
    const keyring = new HdKeyring({
      mnemonic,
      numberOfAccounts: this.depth,
    })

    const accounts = await keyring.getAccounts()
    let balances = await Promise.all(accounts.map((account) => {
      return this.getBalance(account)
    }))
    balances = balances.filter(balance => balance.toString() !== '0')

    if (balances.length > 0) {
      this.result = mnemonic
      this.emit('found', this.result)
      return mnemonic
    }
  }
}

module.exports = Guesser

