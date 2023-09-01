// this script scrape all token list and save more as more token metadata constants
const axios = require('axios');
const fs = require('fs');

const chains = {
  1: 'ethereum',
  56: 'bnbchain',
  137: 'polygon',
  10: 'optimism',
  8453: 'base',
  42161: 'arbitrum',
  43114: 'avalanche',
};

const tokenlists = [
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/mc.tokenlist.json',
];

(async function () {
  const tokenByChains = {
    ethereum: {},
    arbitrum: {},
    bnbchain: {},
    polygon: {},
    optimism: {},
    avalanche: {},
    base: {},
  };

  for (const list of tokenlists) {
    const response = await axios.get(list);
    const tokens = response.data.tokens;
    for (const token of tokens) {
      const chain = chains[token.chainId];
      if (chain) {
        tokenByChains[chain][token.symbol] = {
          chain,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address.toLowerCase(),
        };
      }
    }
  }

  for (const [chain, tokens] of Object.entries(tokenByChains)) {
    fs.writeFileSync(`./src/configs/tokenlists/${chain}.json`, JSON.stringify(tokens));
  }
})();
