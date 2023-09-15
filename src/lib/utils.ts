import { Token } from '../types/configs';

export function getTimestamp(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function getTodayUTCTimestamp(): number {
  const today = new Date().toISOString().split('T')[0];
  return Math.floor(new Date(today).getTime() / 1000);
}

export function getStartDayTimestamp(timestamp: number) {
  const theDay = new Date(timestamp * 1000).toISOString().split('T')[0];
  return Math.floor(new Date(theDay).getTime() / 1000);
}

export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

export function compareAddress(address1: string, address2: string): boolean {
  return normalizeAddress(address1) === normalizeAddress(address2);
}

export const shortenAddress = (address: string, chars = 6) => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

export function compareToken(token0: Token | null, token1: Token | null): boolean {
  if (token0 === null || token1 === null) {
    return false;
  }

  return compareAddress(token0.address, token1.address) && token0.chain === token1.chain;
}
