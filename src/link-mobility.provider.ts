import * as pulumi from '@pulumi/pulumi';
import { LinkMobilityGateService } from './link-mobility.service';
import { LinkMobilityGateDestination } from './models';

export type LinkMobilityGateDestinationProviderInputs = {
  username: string;
  password: string;
  url: string;
  partner: string;
  platform: string;
};

export type LinkMobilityGateDestinationInputs = {
  partnerGateId: string;
  destination: LinkMobilityGateDestination;
};

export class LinkMobilityGateDestinationProvider implements pulumi.dynamic.ResourceProvider {
  private username: string;
  private password: string;
  private partner: string;
  private platform: string;
  private url: string;
  private readonly linkMobilityService: LinkMobilityGateService;

  constructor(inputs: LinkMobilityGateDestinationProviderInputs) {
    this.username = inputs.username;
    this.password = inputs.password;
    this.partner = inputs.partner;
    this.platform = inputs.platform;
    this.url = inputs.url;

    this.linkMobilityService = new LinkMobilityGateService({
      username: this.username,
      password: this.password,
      url: this.url,
      partner: this.partner,
      platform: this.platform,
    });
  }

  async create(
    input: LinkMobilityGateDestinationInputs
  ): Promise<pulumi.dynamic.CreateResult<LinkMobilityGateDestinationInputs>> {
    await this.linkMobilityService.createOrUpdateDestination(
      input.partnerGateId,
      input.destination,
      false
    );

    return {
      id: input.destination.url,
      outs: {
        partnerGateId: input.partnerGateId,
        destination: input.destination,
      },
    };
  }

  async update(
    _id: string,
    _olds: LinkMobilityGateDestinationInputs,
    news: LinkMobilityGateDestinationInputs
  ): Promise<pulumi.dynamic.UpdateResult<LinkMobilityGateDestinationInputs>> {
    await this.linkMobilityService.createOrUpdateDestination(
      news.partnerGateId,
      news.destination,
      true
    );

    return {
      outs: {
        destination: news.destination,
        partnerGateId: news.partnerGateId,
      },
    };
  }

  async delete(_id: string, props: LinkMobilityGateDestinationInputs) {
    await this.linkMobilityService.deleteDestination(props.partnerGateId, props.destination);
  }

  async diff(
    id: string,
    old: LinkMobilityGateDestinationInputs,
    news: LinkMobilityGateDestinationInputs
  ): Promise<pulumi.dynamic.DiffResult> {
    const shouldReplace = old.destination.url !== news.destination.url;
    const hasChanges = JSON.stringify(old.destination) !== JSON.stringify(news.destination);
    const diffs: pulumi.dynamic.DiffResult = {
      changes: hasChanges,
      ...(shouldReplace
        ? {
            replaces: [id],
            deleteBeforeReplace: true,
          }
        : { stables: [id] }),
    };

    return diffs;
  }
}
