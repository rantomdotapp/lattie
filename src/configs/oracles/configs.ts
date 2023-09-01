import { OracleConfig } from '../../types/configs';
import { AddressZero } from '../constants';
import ArbitrumTokens from '../tokens/arbitrum.json';
import AvalancheTokens from '../tokens/avalanche.json';
import BaseTokens from '../tokens/base.json';
import EthereumTokens from '../tokens/ethereum.json';
import OptimismTokens from '../tokens/optimism.json';
import PolygonTokens from '../tokens/polygon.json';
import { OracleChainlinkConfigBases } from './chainlink';
import { OracleConfigPool2Bases } from './pool2';

// chain:address => OracleConfig
export const OracleConfigChainlinkSources: { [key: string]: OracleConfig } = {
  // USDC
  [`${EthereumTokens.USDC.chain}:${EthereumTokens.USDC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${ArbitrumTokens.USDC.chain}:${ArbitrumTokens.USDC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${PolygonTokens.USDC.chain}:${PolygonTokens.USDC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${ArbitrumTokens['USDC.e'].chain}:${ArbitrumTokens['USDC.e'].address}`]: OracleChainlinkConfigBases.USDC,
  [`${OptimismTokens.USDC.chain}:${OptimismTokens.USDC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${BaseTokens.USDbC.chain}:${BaseTokens.USDbC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${AvalancheTokens.USDC.chain}:${AvalancheTokens.USDC.address}`]: OracleChainlinkConfigBases.USDC,
  [`${AvalancheTokens['USDC.e'].chain}:${AvalancheTokens['USDC.e'].address}`]: OracleChainlinkConfigBases.USDC,

  // USDT
  [`${EthereumTokens.USDT.chain}:${EthereumTokens.USDT.address}`]: OracleChainlinkConfigBases.USDT,
  [`${ArbitrumTokens.USDT.chain}:${ArbitrumTokens.USDT.address}`]: OracleChainlinkConfigBases.USDT,
  [`${OptimismTokens.USDT.chain}:${OptimismTokens.USDT.address}`]: OracleChainlinkConfigBases.USDT,
  [`${PolygonTokens.USDT.chain}:${PolygonTokens.USDT.address}`]: OracleChainlinkConfigBases.USDT,
  [`${AvalancheTokens.USDT.chain}:${AvalancheTokens.USDT.address}`]: OracleChainlinkConfigBases.USDT,
  [`${AvalancheTokens['USDT.e'].chain}:${AvalancheTokens['USDT.e'].address}`]: OracleChainlinkConfigBases.USDT,
};

// chain:address => OracleConfig
export const OracleConfigSources: { [key: string]: OracleConfig } = {
  // ETH and WETH
  [`ethereum:${AddressZero}`]: OracleChainlinkConfigBases.ETH,
  [`${EthereumTokens.WETH.chain}:${EthereumTokens.WETH.address}`]: OracleChainlinkConfigBases.ETH,
  [`optimism:${AddressZero}`]: OracleChainlinkConfigBases.ETH,
  [`${OptimismTokens.WETH.chain}:${OptimismTokens.WETH.address}`]: OracleChainlinkConfigBases.ETH,
  [`${PolygonTokens.WETH.chain}:${PolygonTokens.WETH.address}`]: OracleChainlinkConfigBases.ETH,
  [`arbitrum:${AddressZero}`]: OracleChainlinkConfigBases.ETH,
  [`${ArbitrumTokens.WETH.chain}:${ArbitrumTokens.WETH.address}`]: OracleChainlinkConfigBases.ETH,
  [`${AvalancheTokens['WETH.e'].chain}:${AvalancheTokens['WETH.e'].address}`]: OracleChainlinkConfigBases.ETH,
  [`${BaseTokens.WETH.chain}:${BaseTokens.WETH.address}`]: OracleChainlinkConfigBases.ETH,

  // WBTC
  [`${EthereumTokens.WBTC.chain}:${EthereumTokens.WBTC.address}`]: OracleChainlinkConfigBases.WBTC,
  [`${OptimismTokens.WBTC.chain}:${OptimismTokens.WBTC.address}`]: OracleChainlinkConfigBases.WBTC,
  [`${PolygonTokens.WBTC.chain}:${PolygonTokens.WBTC.address}`]: OracleChainlinkConfigBases.WBTC,
  [`${ArbitrumTokens.WBTC.chain}:${ArbitrumTokens.WBTC.address}`]: OracleChainlinkConfigBases.WBTC,
  [`${AvalancheTokens['WBTC.e'].chain}:${AvalancheTokens['WBTC.e'].address}`]: OracleChainlinkConfigBases.WBTC,
  [`${AvalancheTokens['BTC.b'].chain}:${AvalancheTokens['BTC.b'].address}`]: OracleChainlinkConfigBases.WBTC,

  // LINK
  [`${EthereumTokens.LINK.chain}:${EthereumTokens.LINK.address}`]: OracleChainlinkConfigBases.LINK,
  [`${ArbitrumTokens.LINK.chain}:${ArbitrumTokens.LINK.address}`]: OracleChainlinkConfigBases.LINK,
  [`${OptimismTokens.LINK.chain}:${OptimismTokens.LINK.address}`]: OracleChainlinkConfigBases.LINK,
  [`${PolygonTokens.LINK.chain}:${PolygonTokens.LINK.address}`]: OracleChainlinkConfigBases.LINK,
  [`${AvalancheTokens['LINK.e'].chain}:${AvalancheTokens['LINK.e'].address}`]: OracleChainlinkConfigBases.LINK,

  // DAI
  [`${EthereumTokens.DAI.chain}:${EthereumTokens.DAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${EthereumTokens.DAI.chain}:${EthereumTokens.DAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${EthereumTokens.sDAI.chain}:${EthereumTokens.sDAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${ArbitrumTokens.DAI.chain}:${ArbitrumTokens.DAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${OptimismTokens.DAI.chain}:${OptimismTokens.DAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${PolygonTokens.DAI.chain}:${PolygonTokens.DAI.address}`]: OracleChainlinkConfigBases.DAI,
  [`${AvalancheTokens['DAI.e'].chain}:${AvalancheTokens['DAI.e'].address}`]: OracleChainlinkConfigBases.DAI,

  // EUR
  [`${EthereumTokens.sEUR.chain}:${EthereumTokens.sEUR.address}`]: OracleChainlinkConfigBases.EUR,
  [`${EthereumTokens.EURS.chain}:${EthereumTokens.EURS.address}`]: OracleChainlinkConfigBases.EUR,
  [`${PolygonTokens.EURS.chain}:${PolygonTokens.EURS.address}`]: OracleChainlinkConfigBases.EUR,
  [`${PolygonTokens.jEUR.chain}:${PolygonTokens.jEUR.address}`]: OracleChainlinkConfigBases.EUR,
  [`${PolygonTokens.agEUR.chain}:${PolygonTokens.agEUR.address}`]: OracleChainlinkConfigBases.EUR,
  [`${ArbitrumTokens.EURS.chain}:${ArbitrumTokens.EURS.address}`]: OracleChainlinkConfigBases.EUR,

  // USDP
  [`${EthereumTokens.USDP.chain}:${EthereumTokens.USDP.address}`]: OracleChainlinkConfigBases.USDP,

  // COMP
  [`${EthereumTokens.COMP.chain}:${EthereumTokens.COMP.address}`]: OracleConfigPool2Bases.COMP,

  // LDO
  [`${EthereumTokens.LDO.chain}:${EthereumTokens.LDO.address}`]: OracleConfigPool2Bases.LDO,

  // USDC
  [`${EthereumTokens.USDC.chain}:${EthereumTokens.USDC.address}`]: OracleConfigPool2Bases.USDC,
  [`${ArbitrumTokens.USDC.chain}:${ArbitrumTokens.USDC.address}`]: OracleConfigPool2Bases.USDC,
  [`${PolygonTokens.USDC.chain}:${PolygonTokens.USDC.address}`]: OracleConfigPool2Bases.USDC,
  [`${ArbitrumTokens['USDC.e'].chain}:${ArbitrumTokens['USDC.e'].address}`]: OracleConfigPool2Bases.USDC,
  [`${OptimismTokens.USDC.chain}:${OptimismTokens.USDC.address}`]: OracleConfigPool2Bases.USDC,
  [`${BaseTokens.USDbC.chain}:${BaseTokens.USDbC.address}`]: OracleConfigPool2Bases.USDC,
  [`${AvalancheTokens.USDC.chain}:${AvalancheTokens.USDC.address}`]: OracleConfigPool2Bases.USDC,
  [`${AvalancheTokens['USDC.e'].chain}:${AvalancheTokens['USDC.e'].address}`]: OracleConfigPool2Bases.USDC,

  // USDT
  [`${EthereumTokens.USDT.chain}:${EthereumTokens.USDT.address}`]: OracleConfigPool2Bases.USDT,
  [`${ArbitrumTokens.USDT.chain}:${ArbitrumTokens.USDT.address}`]: OracleConfigPool2Bases.USDT,
  [`${OptimismTokens.USDT.chain}:${OptimismTokens.USDT.address}`]: OracleConfigPool2Bases.USDT,
  [`${PolygonTokens.USDT.chain}:${PolygonTokens.USDT.address}`]: OracleConfigPool2Bases.USDT,
  [`${AvalancheTokens.USDT.chain}:${AvalancheTokens.USDT.address}`]: OracleConfigPool2Bases.USDT,
  [`${AvalancheTokens['USDT.e'].chain}:${AvalancheTokens['USDT.e'].address}`]: OracleConfigPool2Bases.USDT,

  // UNI
  [`${EthereumTokens.UNI.chain}:${EthereumTokens.UNI.address}`]: OracleConfigPool2Bases.UNI,

  // SUSHI
  [`${EthereumTokens.SUSHI.chain}:${EthereumTokens.SUSHI.address}`]: OracleConfigPool2Bases.SUSHI,
  [`${PolygonTokens.SUSHI.chain}:${PolygonTokens.SUSHI.address}`]: OracleConfigPool2Bases.SUSHI,

  // SAI
  [`${EthereumTokens.SAI.chain}:${EthereumTokens.SAI.address}`]: OracleConfigPool2Bases.SAI,

  // MANA
  [`${EthereumTokens.MANA.chain}:${EthereumTokens.MANA.address}`]: OracleConfigPool2Bases.MANA,

  // KNC
  [`${EthereumTokens.KNC.chain}:${EthereumTokens.KNC.address}`]: OracleConfigPool2Bases.KNC,

  // REP
  [`${EthereumTokens.REP.chain}:${EthereumTokens.REP.address}`]: OracleConfigPool2Bases.REP,
  // [`${EthereumTokens.REPv2.chain}:${EthereumTokens.REPv2.address}`]: OracleConfigPool2Bases.REPv2,

  // ZRX
  [`${EthereumTokens.ZRX.chain}:${EthereumTokens.ZRX.address}`]: OracleConfigPool2Bases.ZRX,

  // BAT
  [`${EthereumTokens.BAT.chain}:${EthereumTokens.BAT.address}`]: OracleConfigPool2Bases.BAT,

  // sUSD
  [`${EthereumTokens.sUSD.chain}:${EthereumTokens.sUSD.address}`]: OracleConfigPool2Bases.sUSD,
  [`${OptimismTokens.sUSD.chain}:${OptimismTokens.sUSD.address}`]: OracleConfigPool2Bases.sUSD,

  // LEND
  [`${EthereumTokens.LEND.chain}:${EthereumTokens.LEND.address}`]: OracleConfigPool2Bases.LEND,

  // MKR
  [`${EthereumTokens.MKR.chain}:${EthereumTokens.MKR.address}`]: OracleConfigPool2Bases.MKR,

  // SNX
  [`${EthereumTokens.SNX.chain}:${EthereumTokens.SNX.address}`]: OracleConfigPool2Bases.SNX,

  // TUSD
  [`${EthereumTokens.TUSD.chain}:${EthereumTokens.TUSD.address}`]: OracleConfigPool2Bases.TUSD,

  // MIM
  [`${EthereumTokens.MIM.chain}:${EthereumTokens.MIM.address}`]: OracleConfigPool2Bases.MIM,

  // BUSD
  [`${EthereumTokens.BUSD.chain}:${EthereumTokens.BUSD.address}`]: OracleConfigPool2Bases.BUSD,

  // ENJ
  [`${EthereumTokens.ENJ.chain}:${EthereumTokens.ENJ.address}`]: OracleConfigPool2Bases.ENJ,

  // REN
  [`${EthereumTokens.REN.chain}:${EthereumTokens.REN.address}`]: OracleConfigPool2Bases.REN,

  // YFI
  [`${EthereumTokens.YFI.chain}:${EthereumTokens.YFI.address}`]: OracleConfigPool2Bases.YFI,

  // AAVE
  [`${EthereumTokens.AAVE.chain}:${EthereumTokens.AAVE.address}`]: OracleConfigPool2Bases.AAVE,
  [`${PolygonTokens.AAVE.chain}:${PolygonTokens.AAVE.address}`]: OracleConfigPool2Bases.AAVE,
  [`${ArbitrumTokens.AAVE.chain}:${ArbitrumTokens.AAVE.address}`]: OracleConfigPool2Bases.AAVE,
  [`${OptimismTokens.AAVE.chain}:${OptimismTokens.AAVE.address}`]: OracleConfigPool2Bases.AAVE,
  [`${AvalancheTokens['AAVE.e'].chain}:${AvalancheTokens['AAVE.e'].address}`]: OracleConfigPool2Bases.AAVE,

  // CRV
  [`${EthereumTokens.CRV.chain}:${EthereumTokens.CRV.address}`]: OracleConfigPool2Bases.CRV,
  [`${PolygonTokens.CRV.chain}:${PolygonTokens.CRV.address}`]: OracleConfigPool2Bases.CRV,

  // GUSD
  [`${EthereumTokens.GUSD.chain}:${EthereumTokens.GUSD.address}`]: OracleConfigPool2Bases.GUSD,

  // BAL
  [`${EthereumTokens.BAL.chain}:${EthereumTokens.BAL.address}`]: OracleConfigPool2Bases.BAL,
  [`${PolygonTokens.BAL.chain}:${PolygonTokens.BAL.address}`]: OracleConfigPool2Bases.BAL,

  // xSUSHI
  [`${EthereumTokens.xSUSHI.chain}:${EthereumTokens.xSUSHI.address}`]: OracleConfigPool2Bases.xSUSHI,

  // RAI
  [`${EthereumTokens.RAI.chain}:${EthereumTokens.RAI.address}`]: OracleConfigPool2Bases.RAI,

  // AMPL
  [`${EthereumTokens.AMPL.chain}:${EthereumTokens.AMPL.address}`]: OracleConfigPool2Bases.AMPL,

  // DPI
  [`${EthereumTokens.DPI.chain}:${EthereumTokens.DPI.address}`]: OracleConfigPool2Bases.DPI,
  [`${PolygonTokens.DPI.chain}:${PolygonTokens.DPI.address}`]: OracleConfigPool2Bases.DPI,

  // FRAX
  [`${EthereumTokens.FRAX.chain}:${EthereumTokens.FRAX.address}`]: OracleConfigPool2Bases.FRAX,
  [`${ArbitrumTokens.FRAX.chain}:${ArbitrumTokens.FRAX.address}`]: OracleConfigPool2Bases.FRAX,
  [`${AvalancheTokens.FRAX.chain}:${AvalancheTokens.FRAX.address}`]: OracleConfigPool2Bases.FRAX,

  // FEI
  [`${EthereumTokens.FEI.chain}:${EthereumTokens.FEI.address}`]: OracleConfigPool2Bases.FEI,

  // stETH
  [`${EthereumTokens.stETH.chain}:${EthereumTokens.stETH.address}`]: OracleConfigPool2Bases.stETH,
  [`${EthereumTokens.wstETH.chain}:${EthereumTokens.wstETH.address}`]: OracleConfigPool2Bases.wstETH,
  [`${PolygonTokens.wstETH.chain}:${PolygonTokens.wstETH.address}`]: OracleConfigPool2Bases.wstETH,
  [`${ArbitrumTokens.wstETH.chain}:${ArbitrumTokens.wstETH.address}`]: OracleConfigPool2Bases.wstETH,
  [`${OptimismTokens.wstETH.chain}:${OptimismTokens.wstETH.address}`]: OracleConfigPool2Bases.wstETH,

  // ENS
  [`${EthereumTokens.ENS.chain}:${EthereumTokens.ENS.address}`]: OracleConfigPool2Bases.ENS,

  // GHO
  [`${EthereumTokens.GHO.chain}:${EthereumTokens.GHO.address}`]: OracleConfigPool2Bases.GHO,

  // 1INCH
  [`${EthereumTokens['1INCH'].chain}:${EthereumTokens['1INCH'].address}`]: OracleConfigPool2Bases['1INCH'],

  // CVX
  [`${EthereumTokens.CVX.chain}:${EthereumTokens.CVX.address}`]: OracleConfigPool2Bases.CVX,

  // LUSD
  [`${EthereumTokens.LUSD.chain}:${EthereumTokens.LUSD.address}`]: OracleConfigPool2Bases.LUSD,
  [`${ArbitrumTokens.LUSD.chain}:${ArbitrumTokens.LUSD.address}`]: OracleConfigPool2Bases.LUSD,
  [`${OptimismTokens.LUSD.chain}:${OptimismTokens.LUSD.address}`]: OracleConfigPool2Bases.LUSD,

  // rETH
  [`${EthereumTokens.rETH.chain}:${EthereumTokens.rETH.address}`]: OracleConfigPool2Bases.rETH,
  [`${ArbitrumTokens.rETH.chain}:${ArbitrumTokens.rETH.address}`]: OracleConfigPool2Bases.rETH,
  [`${OptimismTokens.rETH.chain}:${OptimismTokens.rETH.address}`]: OracleConfigPool2Bases.rETH,

  // RPL
  [`${EthereumTokens.RPL.chain}:${EthereumTokens.RPL.address}`]: OracleConfigPool2Bases.RPL,

  // cbETH
  [`${EthereumTokens.cbETH.chain}:${EthereumTokens.cbETH.address}`]: OracleConfigPool2Bases.cbETH,
  [`${BaseTokens.cbETH.chain}:${BaseTokens.cbETH.address}`]: OracleConfigPool2Bases.cbETH,

  // MATIC
  [`polygon:${AddressZero}`]: OracleChainlinkConfigBases.MATIC,
  [`${PolygonTokens.WMATIC.chain}:${PolygonTokens.WMATIC.address}`]: OracleChainlinkConfigBases.MATIC,

  // AVAX
  [`avalanche:${AddressZero}`]: OracleChainlinkConfigBases.AVAX,
  [`${AvalancheTokens.WAVAX.chain}:${AvalancheTokens.WAVAX.address}`]: OracleChainlinkConfigBases.AVAX,

  // sAVAX
  [`${AvalancheTokens.sAVAX.chain}:${AvalancheTokens.sAVAX.address}`]: OracleConfigPool2Bases.sAVAX,

  // GHST
  [`${PolygonTokens.GHST.chain}:${PolygonTokens.GHST.address}`]: OracleConfigPool2Bases.GHST,

  // miMATIC
  [`${PolygonTokens.miMATIC.chain}:${PolygonTokens.miMATIC.address}`]: OracleConfigPool2Bases.miMATIC,
  [`${ArbitrumTokens.MAI.chain}:${ArbitrumTokens.MAI.address}`]: OracleConfigPool2Bases.miMATIC,
  [`${OptimismTokens.MAI.chain}:${OptimismTokens.MAI.address}`]: OracleConfigPool2Bases.miMATIC,
  [`${AvalancheTokens.MAI.chain}:${AvalancheTokens.MAI.address}`]: OracleConfigPool2Bases.miMATIC,

  // stMATIC
  [`${PolygonTokens.stMATIC.chain}:${PolygonTokens.stMATIC.address}`]: OracleConfigPool2Bases.stMATIC,

  // MaticX
  [`${PolygonTokens.MaticX.chain}:${PolygonTokens.MaticX.address}`]: OracleConfigPool2Bases.MaticX,

  // ARB
  [`${ArbitrumTokens.ARB.chain}:${ArbitrumTokens.ARB.address}`]: OracleConfigPool2Bases.ARB,

  // OP
  [`${OptimismTokens.OP.chain}:${OptimismTokens.OP.address}`]: OracleConfigPool2Bases.OP,
};
