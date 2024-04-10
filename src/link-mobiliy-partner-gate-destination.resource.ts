import * as pulumi from "@pulumi/pulumi";
import { LinkMobilityPartnerGateDestinationInputs, LinkMobilityPartnerGateDestinationProvider } from "./link-mobility.provider";

export interface LinkMobilityPartnerGateResourceInputs extends LinkMobilityPartnerGateDestinationInputs {
    provider: LinkMobilityPartnerGateDestinationProvider;
  }

export class LinkMobilityPartnerGateDestination extends pulumi.dynamic.Resource {
    constructor(
      name: string,
      inputs: LinkMobilityPartnerGateResourceInputs,
      opts?: pulumi.CustomResourceOptions
    ) {
      super(inputs.provider, `${name}-destination`, inputs, opts);
    }
  }