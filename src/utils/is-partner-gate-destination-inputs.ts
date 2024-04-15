import { LinkMobilityPartnerGateDestinationInputs } from '../link-mobility.provider';

export function isLinkMobilityPartnerGateDestinationInputs(
  inputs: any
): inputs is LinkMobilityPartnerGateDestinationInputs {
  return (
    inputs && typeof inputs.partnerGateId === 'string' && typeof inputs.destination === 'object'
  );
}
