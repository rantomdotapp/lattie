import { ContextServices, ICollector } from '../../types/namespaces';
import { CollectorOptions } from '../../types/options';
import { Aavev1Collector } from './lending/aavev1';
import { CompoundCollector } from './lending/compound';

export function getCollectorWithConfig(services: ContextServices, options: CollectorOptions): ICollector | null {
  if (options.metric == 'lending') {
    if (options.config.version === 'compound') {
      return new CompoundCollector(services, options);
    } else if (options.config.version === 'aavev1') {
      return new Aavev1Collector(services, options);
    }
  }

  return null;
}
