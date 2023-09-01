import CErc20 from '../../configs/abi/compound/cErc20.json';
import { TokenNatives } from '../../configs/constants';
import { normalizeAddress } from '../../lib/utils';
import { Web3Service } from '../../services/web3';
import { Token } from '../../types/configs';
import { LendingMarketConstant } from './types';

const CompoundMarkets: Array<string> = [
  'compound:ethereum:0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5:7710758',
  'compound:ethereum:0xe65cdb6479bac1e22340e4e755fae7e509ecd06c:12848198',
  'compound:ethereum:0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e:7710735',
  'compound:ethereum:0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4:10960099',
  'compound:ethereum:0x5d3a536e4d6dbd6114cc1ead35777bab948e3643:8983575',
  'compound:ethereum:0x7713dd9ca933848f6819f38b8352d9a15ea73f67:13227624',
  'compound:ethereum:0xface851a4921ce59e912d19329929ce6da6eb0c7:12286030',
  'compound:ethereum:0x158079ee67fce2f58472a96584a73c7ab9ac95c1:7710755',
  'compound:ethereum:0xf5dce57282a584d2746faf1593d3121fcac444dc:7710752',
  'compound:ethereum:0x4b0181102a0112a2ef11abee5563bb4a3176c9d7:12848166',
  'compound:ethereum:0x12392f67bdf24fae0af363c24ac620a2f67dad86:11008385',
  'compound:ethereum:0x35a18000230da775cac24873d00ff85bccded550:10921410',
  'compound:ethereum:0x39aa39c021dfbae8fac545936693ac917d5e7563:7710760',
  'compound:ethereum:0x041171993284df560249b57358f931d9eb7b925d:13258119',
  'compound:ethereum:0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9:9879363',
  'compound:ethereum:0xc11b1268c1a384e55c48c2391d8d480264a3a7f4:8163813',
  'compound:ethereum:0xccf4429db6322d5c611ee964527d42e5d685dd6a:12038653',
  'compound:ethereum:0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946:12848198',
  'compound:ethereum:0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407:7710733',

  'ironbank:ethereum:0x41c84c0e2ee0b740cf0d31f63f3b6f627dc6b393:11385317',
  'ironbank:ethereum:0x8e595470ed749b85c6f7669de83eae304c2ec68f:11385419',
  'ironbank:ethereum:0xe7bff2da8a2f619c2586fb83938fa56ce803aa16:11671379',
  'ironbank:ethereum:0xfa3472f7319477c9bfecdd66e4b948569e7621b9:11671451',
  'ironbank:ethereum:0x12a9cc33a980daa74e00cc2d1a0e74c57a93d12c:11671473',
  'ironbank:ethereum:0x8fc8bfd80d6a9f17fb98a373023d72531792b431:11671483',
  'ironbank:ethereum:0x48759f220ed983db51fa7a8c0d2aab8f3ce4166a:11677491',
  'ironbank:ethereum:0x76eb2fe28b36b3ee97f3adae0c69606eedb2a37c:11677638',
  'ironbank:ethereum:0xa7c4054afd3dbbbf5bfe80f41862b89ea05c9806:11886879',
  'ironbank:ethereum:0xa8caea564811af0e92b1e044f3edd18fa9a73e4f:11677750',
  'ironbank:ethereum:0xca55f9c4e77f7b8524178583b0f7c798de17fd54:11677907',
  'ironbank:ethereum:0x7736ffb07104c0c400bb0cc9a7c228452a732992:11723979',
  'ironbank:ethereum:0xfeeb92386a055e2ef7c2b598c872a4047a7db59f:12412340',
  'ironbank:ethereum:0x226f3738238932ba0db2319a8117d9555446102f:12412332',
  'ironbank:ethereum:0xb8c5af54bbdcc61453144cf472a9276ae36109f9:13216527',
  'ironbank:ethereum:0x30190a3b52b5ab1daf70d46d72536f5171f22340:13216497',
  'ironbank:ethereum:0x9e8e207083ffd5bdc3d99a1f32d1e6250869c1a9:13484273',
  'ironbank:ethereum:0xe0b57feed45e7d908f2d0dacd26f113cf26715bf:14486266',
];

export async function getCompoundMarkets(): Promise<Array<LendingMarketConstant>> {
  const web3Service = new Web3Service();

  let markets: Array<LendingMarketConstant> = [];

  for (const config of CompoundMarkets) {
    const [protocol, chain, address, birthBlock] = config.split(':');

    let token: Token | null = null;

    if (address === '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5') {
      token = TokenNatives.ethereum;
    } else {
      const underlying = await web3Service.singlecall({
        chain,
        address,
        abi: CErc20,
        method: 'underlying',
        params: [],
      });
      token = await web3Service.getTokenErc20Info(chain, underlying.toString());
    }

    if (token) {
      markets.push({
        protocol: protocol,
        chain: chain,
        address: normalizeAddress(address),
        token: token,
        birthBlock: Number(birthBlock),
      });

      console.log(`Got ${protocol} market ${chain}:${token.symbol}:${token.address}`);
    }
  }

  return markets;
}
