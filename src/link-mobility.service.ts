import { LinkMobilityGate, LinkMobilityGateDestination } from './models';

export type LinkMobilityPartnerGateServiceInputs = {
  username: string;
  password: string;
  url: string;
  platform: string;
  partner: string;
};

export class LinkMobilityPartnerGateService {
  private username: string;
  private password: string;
  private url: string;

  constructor(inputs: LinkMobilityPartnerGateServiceInputs) {
    this.username = inputs.username;
    this.password = inputs.password;
    this.url = `${inputs.url}/gate/partnergate/platform/${inputs.platform}/partner/${inputs.partner}`;
  }

  private getAuth(): string {
    return `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
  }

  public async getAll(): Promise<LinkMobilityGate[]> {
    const response = await fetch(this.url, {
      method: 'GET',
      headers: {
        Authorization: this.getAuth(),
      },
    });

    return await response.json();
  }

  public async getById(id: string): Promise<LinkMobilityGate> {
    const response = await fetch(`${this.url}/id/${id}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuth(),
      },
    });

    return await response.json();
  }

  public async createOrUpdateDestination(gateId: string, destination: LinkMobilityGateDestination) {
    const gate: LinkMobilityGate = await this.getById(gateId);

    const destinationIndex = gate.destinations.findIndex((d) => d.url === destination.url);

    if (destinationIndex === -1) {
      gate.destinations.push(destination);
    } else {
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
    const gate: LinkMobilityGate = await this.getById(gateId);
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
