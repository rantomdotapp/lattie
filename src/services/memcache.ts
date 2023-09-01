import { IProvider } from '../types/namespaces';

export class Memcache implements IProvider {
  public readonly name: string = 'memcache';

  private readonly _storage: { [key: string]: any };

  constructor() {
    this._storage = {};
  }

  public get(key: string): any {
    return this._storage[key];
  }

  public set(key: string, value: any) {
    this._storage[key] = value;
  }
}
