# HD Seed Phrase Guesser

A tool for attempting to recover Ethereum addresses from incorrectly input seed phrases.

- Attempts to compare an entered seed phrase against detected possible spelling errors.
- Generates accounts for each valid seed phrase variation up to a defined depth.
- Checks for accounts with any ethereum balance in that depth.
- If an account with a balance is found, the valid mnemonic is returned.
- The module is an event emitter for easy introspection into its attempt cycle.

