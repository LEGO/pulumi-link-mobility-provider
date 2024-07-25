import { LinkMobilityGate, LinkMobilityGateDestination } from './models';

export type LinkMobilityGateServiceInputs = {
  username: string;
  password: string;
  url: string;
  platform: string;
  partner: string;
};

export class LinkMobilityGateService {
  private username: string;
  private password: string;
  private url: string;

  constructor(inputs: LinkMobilityGateServiceInputs) {
    this.username = inputs.username;
    this.password = inputs.password;

    // It should allow for any kind of URL as long as it starts w/ `http` or `https` and it doesn't end in a `/`.
    const regexString = '^(https?|http)://(w{3}.)?([a-zA-Z0-9-.]+)(:[0-9]{2,4})?(/[a-zA-Z0-9-]+)*$';
    const urlRegex = new RegExp(regexString);
    if (!urlRegex.test(inputs.url)) {
      throw new Error(
        `Invalid Link Mobility URL. URL must follow the following pattern: ${regexString}. Received: "${inputs.url}"`
      );
    }
    this.url = `${inputs.url}/gate/partnergate/platform/${inputs.platform}/partner/${inputs.partner}`;
  }

  private getAuth(): string {
    return `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
  }

  public async getGateById(id: string): Promise<LinkMobilityGate> {
    const response = await fetch(`${this.url}/id/${id}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuth(),
      },
    });

    return await response.json();
  }

  public async createOrUpdateDestination(
    gateId: string,
    destination: LinkMobilityGateDestination,
    overwrite: boolean
  ) {
    const gate: LinkMobilityGate = await this.getGateById(gateId);

    const destinationIndex = gate.destinations.findIndex((d) => d.url === destination.url);

    if (destinationIndex === -1) {
      gate.destinations.push(destination);
    } else {
      /**
       * It seems normal Pulumi behaviour to not create a resource if it already exists.
       * Unsure if we should keep this or just allow for input from the user to over-write the resource.
       * Will keep it like this for now.
       */
      if (!overwrite) {
        throw new Error('Can not create destination as it already exists.');
      }
      gate.destinations[destinationIndex] = destination;
    }

    await fetch(`${this.url}/id/${gateId}`, {
      method: 'PUT',
      headers: {
        Authorization: this.getAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gate),
    });
  }

  public async deleteDestination(gateId: string, destination: LinkMobilityGateDestination) {
    const gate: LinkMobilityGate = await this.getGateById(gateId);
    const destinationIndex = gate.destinations.findIndex((d) => d.url === destination.url);

    if (destinationIndex === -1) {
      return;
    }

    gate.destinations.splice(destinationIndex, 1);

    await fetch(`${this.url}/id/${gateId}`, {
      method: 'PUT',
      headers: {
        Authorization: this.getAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gate),
    });
  }
}
