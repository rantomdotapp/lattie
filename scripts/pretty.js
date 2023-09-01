/* eslint-disable */
const fs = require('fs');

const chains = ['ethereum', 'avalanche', 'arbitrum', 'optimism', 'polygon', 'base'];

for (const item of chains) {
  const tokenList = require(`../src/configs/tokens/${item}.json`);

  for (const [key] of Object.entries(tokenList)) {
    tokenList[key].address = tokenList[key].address.toLowerCase();
  }

  let ordered = Object.keys(tokenList)
    .sort()
    .reduce((obj, key) => {
      obj[key] = tokenList[key];
      return obj;
    }, {});

  fs.writeFileSync(`./src/configs/tokens/${item}.json`, JSON.stringify(ordered).toString());
}
