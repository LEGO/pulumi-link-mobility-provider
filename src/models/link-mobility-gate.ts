import { LinkMobilityGateDestination } from './link-mobility-gate-destination';

export type LinkMobilityGate = {
  type: string;
  id: string;
  refId: string;
  platformId: string;
  platformPartnerId: string;
  destinations: LinkMobilityGateDestination[];
  gateType: string;
  ttl: number;
  acknowledge: boolean;
  throttle?: number;
  customParameters?: Record<string, string>;
};
