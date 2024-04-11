import * as pulumi from '@pulumi/pulumi';
import { LinkMobilityPartnerGateService } from './link-mobility.service';
import { LinkMobilityGateDestination } from './models';

export type LinkMobilityPartnerGateDestinationProviderInputs = {
  username: string;
  password: string;
  url: string;
  partner: string;
  platform: string;
};

export type LinkMobilityPartnerGateDestinationInputs = {
  partnerGateId: string;
  destination: LinkMobilityGateDestination;
};

export class LinkMobilityPartnerGateDestinationProvider implements pulumi.dynamic.ResourceProvider {
  private username: string;
  private password: string;
  private partner: string;
  private platform: string;
  private url: string;
  private readonly linkMobilityService: LinkMobilityPartnerGateService;

  constructor(inputs: LinkMobilityPartnerGateDestinationProviderInputs) {
    this.username = inputs.username;
    this.password = inputs.password;
    this.partner = inputs.partner;
    this.platform = inputs.platform;
    this.url = inputs.url;
    this.linkMobilityService = new LinkMobilityPartnerGateService({
      username: this.username,
      password: this.password,
      url: this.url,
      partner: this.partner,
      platform: this.platform,
    });
  }

  async create(
    input: LinkMobilityPartnerGateDestinationInputs
  ): Promise<pulumi.dynamic.CreateResult<LinkMobilityPartnerGateDestinationInputs>> {
    await this.linkMobilityService.createOrUpdateDestination(
      input.partnerGateId,
      input.destination
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
    _olds: LinkMobilityPartnerGateDestinationInputs,
    news: LinkMobilityPartnerGateDestinationInputs
  ): Promise<pulumi.dynamic.UpdateResult<LinkMobilityPartnerGateDestinationInputs>> {
    await this.linkMobilityService.createOrUpdateDestination(news.partnerGateId, news.destination);

    return {
      outs: {
        destination: news.destination,
        partnerGateId: news.partnerGateId,
      },
    };
  }

  async delete(_id: string, props: LinkMobilityPartnerGateDestinationInputs) {
    await this.linkMobilityService.deleteDestination(props.partnerGateId, props.destination);
  }

  async diff(
    id: string,
    old: LinkMobilityPartnerGateDestinationInputs,
    news: LinkMobilityPartnerGateDestinationInputs
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
