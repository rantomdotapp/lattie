import { expect } from 'chai';
import { describe } from 'mocha';

import { OracleConfigs } from '../src/configs';
import { Token } from '../src/types/configs';
import { getAllTokens } from './utils';

const tokens: Array<Token> = getAllTokens();

describe('Get token prices', async function () {
  tokens.map((token: Token) =>
    it(`can get token price ${token.chain}:${token.symbol}:${token.address}`, async function () {
      expect(OracleConfigs[`${token.chain}:${token.address}`]).not.equal(undefined);
    }),
  );
});
