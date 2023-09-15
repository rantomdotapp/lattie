import { ContextServices, ITerminal } from '../../types/namespaces';
import { CollectorOptions, TerminalOptions } from '../../types/options';
import { Masterchef } from './masterchef/masterchef';

export function getTerminalWithConfig(services: ContextServices, options: TerminalOptions): ITerminal | null {
  if (options.metric == 'masterchef') {
    if (options.config.version === 'masterchef') {
      return new Masterchef(services, options);
    }
  }

  return null;
}
