import {
  LinkMobilityPartnerGateDestinationProvider,
  LinkMobilityPartnerGateDestinationProviderInputs,
} from '../link-mobility.provider';
import { LinkMobilityPartnerGateService } from '../link-mobility.service';

describe('Test suite for Link Mobility Provider', () => {
  let linkMobilityProvider: LinkMobilityPartnerGateDestinationProvider;

  beforeEach(async () => {
    jest.resetModules();
    linkMobilityProvider = new LinkMobilityPartnerGateDestinationProvider({
      partner: 'partner',
      username: 'username',
      password: 'password',
      platform: 'platform',
      url: 'http://some-url.com',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if the URL is invalid', () => {
    // Arrange
    const ctorInput: LinkMobilityPartnerGateDestinationProviderInputs = {
      partner: 'partner',
      username: 'username',
      password: 'password',
      platform: 'platform',
      url: 'invalid-url',
    };

    // Act & Assert
    expect(() => {
      new LinkMobilityPartnerGateDestinationProvider(ctorInput);
    }).toThrowError(
      'Invalid Link Mobility URL. URL must follow the following pattern: ^(https?|http)://[a-zA-Z0-9-.]+.[a-zA-Z]{2,}(:[0-9]{2,4})?'
    );
  });

  it('should create a destination when providing one', async () => {
    // Arrange
    const input = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    const spy = jest
      .spyOn(LinkMobilityPartnerGateService.prototype, 'createOrUpdateDestination')
      .mockImplementation(() => Promise.resolve());

    // Act
    const result = await linkMobilityProvider.create(input);

    // Assert
    expect(result.id).toBe(input.destination.url);
    expect(spy).toBeCalledWith(input.partnerGateId, input.destination, false);
    expect(result.outs).toEqual(input);
  });

  it('should move on when input is not what expected', async () => {
    // Arrange
    const input = {
      foo: 'bar',
      partnerGateId: 'partnerGateId',
    };

    const spy = jest
      .spyOn(LinkMobilityPartnerGateService.prototype, 'createOrUpdateDestination')
      .mockImplementation(() => Promise.resolve());

    // Act
    // @ts-expect-error This will only be relevant when the plugin will support creating more than Link Mobility Destinations.
    const result = await linkMobilityProvider.create(input);

    expect(spy).not.toBeCalled();
    expect(result.id).toBe('');
    expect(result.outs).toBeUndefined();
  });
});
