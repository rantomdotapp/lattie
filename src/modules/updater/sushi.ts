import MasterchefAbi from '../../configs/abi/sushi/masterchef.json';
import MasterchefV2Abi from '../../configs/abi/sushi/masterchefV2.json';
import UniswapV2Pair from '../../configs/abi/uniswap/UniswapV2Pair.json';
import { normalizeAddress, sleep } from '../../lib/utils';
import { Web3Service } from '../../services/web3';
import { MasterchefVersion } from '../../types/configs';
import { MasterchefPoolConstant } from './types';

const Chefs: Array<string> = [
  'sushi:masterchef:ethereum:0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
  'sushi:masterchefV2:ethereum:0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
];

export async function getSushiMasterchefPools(): Promise<Array<MasterchefPoolConstant>> {
  const pools: Array<MasterchefPoolConstant> = [];

  const web3Service = new Web3Service();

  for (const chef of Chefs) {
    const [protocol, version, chain, address] = chef.split(':');

    const poolLength = await web3Service.singlecall({
      chain,
      address,
      abi: MasterchefAbi,
      method: 'poolLength',
      params: [],
    });

    console.log(`Getting ${poolLength} pools from ${version} ${protocol} ${chain} ${address}`);

    for (let pid = 0; pid < Number(poolLength); pid++) {
      const pool: MasterchefPoolConstant = {
        chain,
        protocol,
        pid,
        version: version as MasterchefVersion,
        address: normalizeAddress(address),
        stakingToken: {
          address: '',
          token0: null,
          token1: null,
        },
      };

      if (version === 'masterchef') {
        let recall = true;
        while (recall) {
          try {
            const poolInfo = await web3Service.singlecall({
              chain,
              address,
              abi: MasterchefAbi,
              method: 'poolInfo',
              params: [pid],
            });
            try {
              const token0Address = await web3Service.singlecall({
                chain,
                address: poolInfo.lpToken,
                abi: UniswapV2Pair,
                method: 'token0',
                params: [],
              });
              const token1Address = await web3Service.singlecall({
                chain,
                address: poolInfo.lpToken,
                abi: UniswapV2Pair,
                method: 'token1',
                params: [],
              });
              pool.stakingToken.token0 = await web3Service.getTokenErc20Info(chain, token0Address);
              pool.stakingToken.token1 = await web3Service.getTokenErc20Info(chain, token1Address);
            } catch (e: any) {}

            pool.stakingToken.address = normalizeAddress(poolInfo.lpToken);

            recall = false;
          } catch (e: any) {
            await sleep(2);
          }
        }
      } else if (version === 'masterchefV2') {
        let recall = true;
        while (recall) {
          try {
            const lpToken = await web3Service.singlecall({
              chain,
              address,
              abi: MasterchefV2Abi,
              method: 'lpToken',
              params: [pid],
            });
            try {
              const token0Address = await web3Service.singlecall({
                chain,
                address: lpToken,
                abi: UniswapV2Pair,
                method: 'token0',
                params: [],
              });
              const token1Address = await web3Service.singlecall({
                chain,
                address: lpToken,
                abi: UniswapV2Pair,
                method: 'token1',
                params: [],
              });
              pool.stakingToken.token0 = await web3Service.getTokenErc20Info(chain, token0Address);
              pool.stakingToken.token1 = await web3Service.getTokenErc20Info(chain, token1Address);
            } catch (e: any) {}

            pool.stakingToken.address = normalizeAddress(lpToken);

            recall = false;
          } catch (e: any) {
            await sleep(2);
          }
        }
      }

      console.log(
        `Got ${version} pool ${protocol} ${chain} ${address} ${pid}-${pool.stakingToken.address} ${
          pool.stakingToken.token0 && pool.stakingToken.token1
            ? pool.stakingToken.token0.symbol + '-' + pool.stakingToken.token1.symbol
            : ''
        }`,
      );

      pools.push(pool);
    }
  }

  return pools;
}
