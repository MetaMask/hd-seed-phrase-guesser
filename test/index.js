const test = require('tape')
const Guesser = require('../')
const BN = require('ethereumjs-util').BN

const phrase = 'travel funny ocean erupt crater whale mandate timber scatter scout actress elbow'

test('can fix a space at the beginning of a phrase', function (t) {
  t.plan(1)

  const input = ' ' + phrase
  const expected = '0xf40762669ac55878e34691e6fc048e75518043c9'
  const getBalance = async (addr) => {

    if (addr.toLowerCase() === expected) {
      return new BN(10000000000)
    } else {
      return new BN(0)
    }
  }

  const guesser = new Guesser({ phrase: input, getBalance })

  guesser.on('found', (result) => {
    t.equal(result, phrase, 'found the correct phrase')
  })

  guesser.on('gave-up', () => {
    t.fail('gave up')
  })

  guesser.guess()
  .catch((reason) => {
    t.ifError(reason)
  })
})

test('can fix a misspelling', function (t) {
  t.plan(1)

  const input = 'travel funny ocean erupt srader whale mandate timber scatter scout actress elbow'
  const expected = '0xf40762669ac55878e34691e6fc048e75518043c9'
  const getBalance = async (addr) => {

    if (addr.toLowerCase() === expected) {
      return new BN(10000000000)
    } else {
      return new BN(0)
    }
  }

  const guesser = new Guesser({ phrase: input, getBalance })

  guesser.on('found', (result) => {
    t.equal(result, phrase, 'found the correct phrase')
  })

  guesser.on('gave-up', () => {
    t.fail('gave up')
  })

  guesser.guess()
  .catch((reason) => {
    t.ifError(reason)
  })
})

test('can fix multiple ambiguous misspellings and formatting errors', function (t) {
  t.plan(1)

  const input = ' travel funny  ocean erupt srader whale mandate timber scoter escout actress elbow'
  const expected = '0xf40762669ac55878e34691e6fc048e75518043c9'
  const getBalance = async (addr) => {

    if (addr.toLowerCase() === expected) {
      return new BN(10000000000)
    } else {
      return new BN(0)
    }
  }

  const guesser = new Guesser({ phrase: input, getBalance })

  guesser.on('found', (result) => {
    t.equal(result, phrase, 'found the correct phrase')
  })

  guesser.on('gave-up', () => {
    t.fail('gave up')
  })

  guesser.guess()
  .catch((reason) => {
    t.ifError(reason)
  })
})

