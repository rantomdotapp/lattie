import AaveV1PoolAbi from '../../configs/abi/aave/LendingPoolV1.json';
import AaveV2PoolAbi from '../../configs/abi/aave/LendingPoolV2.json';
import AaveV3PoolAbi from '../../configs/abi/aave/LendingPoolV3.json';
import { normalizeAddress } from '../../lib/utils';
import { Web3Service } from '../../services/web3';
import { Token } from '../../types/configs';
import { LendingMarketConstant } from './types';

const LendingPoolV1 = '0x398ec7346dcd622edc5ae82352f02be94c62d119';

const LendingPoolV2: Array<string> = [
  'aavev2:ethereum:0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9:11362579',
  'aavev2:polygon:0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf:12687245',
  'aavev2:avalanche:0x4f01aed16d97e3ab5ab2b501154dc9bb0f1a5a2c:4607005',
];

const LendingPoolV3: Array<string> = [
  'aavev2:ethereum:0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2:16291127',
  'aavev2:polygon:0x794a61358d6845594f94dc1db02a252b5b4814ad:25826028',
  'aavev2:avalanche:0x794a61358d6845594f94dc1db02a252b5b4814ad:11970506',
  'aavev2:arbitrum:0x794a61358d6845594f94dc1db02a252b5b4814ad:7742429',
  'aavev2:optimism:0x794a61358d6845594f94dc1db02a252b5b4814ad:4365693',
  'aavev2:base:0xa238dd80c259a72e81d7e4664a9801593f98d1c5:2357134',
];

const BlacklistTokens: Array<string> = [
  '0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5', // renFIL
  '0xa693b19d2931d498c5b318df961919bb4aee87a5', // UST
];

export async function getAaveReserves(): Promise<Array<LendingMarketConstant>> {
  const web3Service = new Web3Service();

  let reserves: Array<LendingMarketConstant> = [];
  const reserveListV1: Array<string> = await web3Service.singlecall({
    chain: 'ethereum',
    address: LendingPoolV1,
    abi: AaveV1PoolAbi,
    method: 'getReserves',
    params: [],
  });

  for (const reserveAddress of reserveListV1) {
    const token: Token | null = await web3Service.getTokenErc20Info('ethereum', reserveAddress);
    if (token) {
      if (BlacklistTokens.indexOf(token.address) !== -1) {
        continue;
      }

      console.log(`Got aavev1 market ${token.chain}:${token.symbol}:${token.address}`);

      reserves.push({
        protocol: 'aavev1',
        chain: 'ethereum',
        address: normalizeAddress(LendingPoolV1),
        token: token,
        birthBlock: 9241022,
      });
    }
  }

  for (const poolV2 of LendingPoolV2) {
    const [protocol, chain, pool, birthBlock] = poolV2.split(':');

    const reservesListV2: Array<string> = await web3Service.singlecall({
      chain: chain,
      address: pool,
      abi: AaveV2PoolAbi,
      method: 'getReservesList',
      params: [],
    });

    for (const reserveAddress of reservesListV2) {
      const token: Token | null = await web3Service.getTokenErc20Info(chain, reserveAddress);
      if (token) {
        if (BlacklistTokens.indexOf(token.address) !== -1) {
          continue;
        }

        console.log(`Got aavev2 market ${token.chain}:${token.symbol}:${token.address}`);

        reserves.push({
          protocol: protocol,
          chain: chain,
          address: normalizeAddress(pool),
          token: token,
          birthBlock: Number(birthBlock),
        });
      }
    }
  }

  for (const poolV3 of LendingPoolV3) {
    const [protocol, chain, pool, birthBlock] = poolV3.split(':');

    const reservesListV3: Array<string> = await web3Service.singlecall({
      chain: chain,
      address: pool,
      abi: AaveV3PoolAbi,
      method: 'getReservesList',
      params: [],
    });

    for (const reserveAddress of reservesListV3) {
      const token: Token | null = await web3Service.getTokenErc20Info(chain, reserveAddress);
      if (token) {
        if (BlacklistTokens.indexOf(token.address) !== -1) {
          continue;
        }

        console.log(`Got aavev3 market ${token.chain}:${token.symbol}:${token.address}`);

        reserves.push({
          protocol: protocol,
          chain: chain,
          address: normalizeAddress(pool),
          token: token,
          birthBlock: Number(birthBlock),
        });
      }
    }
  }

  return reserves;
}
