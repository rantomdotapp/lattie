import { ContextServices, ICollector } from '../../types/namespaces';
import { CollectorOptions } from '../../types/options';
import { Aavev1Collector } from './lending/aavev1';
import { Aavev2Collector } from './lending/aavev2';
import { Aavev3Collector } from './lending/aavev3';
import { CompoundCollector } from './lending/compound';
import { MasterChefCollector } from './masterchef/masterchef';

export function getCollectorWithConfig(services: ContextServices, options: CollectorOptions): ICollector | null {
  if (options.metric === 'lending') {
    if (options.config.version === 'compound') {
      return new CompoundCollector(services, options);
    } else if (options.config.version === 'aavev1') {
      return new Aavev1Collector(services, options);
    } else if (options.config.version === 'aavev2') {
      return new Aavev2Collector(services, options);
    } else if (options.config.version === 'aavev3') {
      return new Aavev3Collector(services, options);
    }
  } else if (options.metric === 'masterchef') {
    if (options.config.version === 'masterchef') {
      return new MasterChefCollector(services, options);
    }
  }

  return null;
}
