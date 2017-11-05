# HD Seed Phrase Guesser [![CircleCI](https://circleci.com/gh/danfinlay/hd-seed-phrase-guesser.svg?style=svg)](https://circleci.com/gh/danfinlay/hd-seed-phrase-guesser)

[Live Web Interface Here](https://danfinlay.github.io/hd-seed-phrase-guesser/)

A tool for attempting to recover Ethereum addresses from incorrectly input seed phrases.

- Attempts to compare an entered seed phrase against detected possible spelling errors.
- Generates accounts for each valid seed phrase variation up to a defined depth.
- Checks for accounts with any ethereum balance in that depth.
- If an account with a balance is found, the valid mnemonic is returned.
- The module is an event emitter for easy introspection into its attempt cycle.

## Building the web interface

One detail: You'll have to remove the line of `node_modules/spell/spell.js` that references `readFileSync`, since that is not available in browser.

After you `npm install`, assuming you have browserify installed globally (`npm install browserify -g`) you should be able to build with `npm run build`.

