import { ContextServices, IOracleUpdater } from '../../types/namespaces';

export class OracleUpdater implements IOracleUpdater {
  public readonly name: string = 'oracle.updater';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public async run(): Promise<void> {}
}
