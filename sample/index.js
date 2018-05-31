require("babel-core/register");
require("babel-polyfill");

const Guesser = require('../')
const metamask = require('metamascara')
const Eth = require('ethjs')

window.addEventListener('load', function () {
  console.log('loaded page')

  render("Make sure you're connected to the network you lost funds on.")
  const ethereumProvider = metamask.createDefaultProvider()
  const eth = new Eth(ethereumProvider)

  tryButton.addEventListener('click', (event) => {
    console.log('detected click')
    const input = seedPhraseInput.value
    const getBalance = async (address) => {
      return eth.getBalance(address)
    }
    const guesser = new Guesser({ phrase: input, getBalance })

    guesser.on('found', (result) => {
      render('SUCCESS! Guesser found this phrase:<br>' + result)
    })

    guesser.on('gave-up', () => {
      render('Guesser gave up without finding your seed phrase.')
    })

    guesser.guess()
    .catch((reason) => {
      console.error(reason)
      render('Problem guessing: ' + reason.message)
    })
  })

})

function render (text) {
  output.innerHTML = text
}
