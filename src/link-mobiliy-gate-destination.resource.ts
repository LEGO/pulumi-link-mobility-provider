import * as pulumi from '@pulumi/pulumi';
import {
  LinkMobilityGateDestinationInputs,
  LinkMobilityGateDestinationProvider,
} from './link-mobility.provider';

export interface LinkMobilityGateResourceInputs extends LinkMobilityGateDestinationInputs {
  provider: LinkMobilityGateDestinationProvider;
}

export class LinkMobilityGateDestination extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    inputs: LinkMobilityGateResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(inputs.provider, `${name}-destination`, inputs, opts);
  }
}
