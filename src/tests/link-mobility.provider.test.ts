import {
  LinkMobilityGateDestinationInputs,
  LinkMobilityGateDestinationProvider,
  LinkMobilityGateDestinationProviderInputs,
} from '../link-mobility.provider';
import { LinkMobilityGateService } from '../link-mobility.service';

describe('Test suite for Link Mobility Provider', () => {
  let linkMobilityProvider: LinkMobilityGateDestinationProvider;

  beforeEach(async () => {
    jest.resetModules();
    linkMobilityProvider = new LinkMobilityGateDestinationProvider({
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

  it.each([
    'http://some.long-url.com/ending-with/',
    'not-a-url-lol',
    'almost-a-url.com',
    'htpt://some-url.com',
    'https://',
    'www.',
    'ftp://some-legit-url.com',
  ])('should throw an error if the URL is invalid', (url) => {
    // Arrange
    const ctorInput: LinkMobilityGateDestinationProviderInputs = {
      partner: 'partner',
      username: 'username',
      password: 'password',
      platform: 'platform',
      url: url,
    };

    // Act & Assert
    expect(() => {
      new LinkMobilityGateDestinationProvider(ctorInput);
    }).toThrowError(
      `Invalid Link Mobility URL. URL must follow the following pattern: ^(https?|http)://(w{3}.)?([a-zA-Z0-9-.]+)(:[0-9]{2,4})?(/[a-zA-Z0-9-]+)*$. Received: "${url}"`
    );
  });

  it.each([
    'http://some.long-url.with-subtomains.com',
    'https://some.long-url.with-subtomains.com/with-path',
    'http://localhost:3000',
    'http://localhost:3000/with-path',
    'https://www.something-fancy.righthere.com',
  ])('should create a destination when providing one', async (url) => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: url,
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    const spy = jest
      .spyOn(LinkMobilityGateService.prototype, 'createOrUpdateDestination')
      .mockImplementation();

    // Act
    const result = await linkMobilityProvider.create(input);

    // Assert
    expect(result.id).toBe(url);
    expect(spy).toBeCalledWith(
      'partnerGateId',
      {
        url: url,
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
      false
    );
    expect(result.outs).toEqual({
      partnerGateId: 'partnerGateId',
      destination: {
        url: url,
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    });
  });

  it('should update a destination when providing one', async () => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username-new',
        password: 'password-new',
      },
    };

    const oldInput: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };
    const spy = jest
      .spyOn(LinkMobilityGateService.prototype, 'createOrUpdateDestination')
      .mockImplementation();

    // Act
    const result = await linkMobilityProvider.update(input.destination.url, oldInput, input);

    // Assert
    expect(result.outs?.destination).toEqual({
      url: 'http://some-url.com',
      contentType: 'application/json',
      username: 'username-new',
      password: 'password-new',
    });
    expect(spy).toBeCalledWith(
      'partnerGateId',
      {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username-new',
        password: 'password-new',
      },
      true
    );
    expect(result.outs?.partnerGateId).toBe('partnerGateId');
  });

  it('should delete destination', async () => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    const spy = jest
      .spyOn(LinkMobilityGateService.prototype, 'deleteDestination')
      .mockImplementation();

    // Act
    await linkMobilityProvider.delete(input.destination.url, input);

    // Assert
    expect(spy).toBeCalledWith('partnerGateId', {
      url: 'http://some-url.com',
      contentType: 'application/json',
      username: 'username',
      password: 'password',
    });
  });

  it('should generate a diff when there are non-url changes to the destination', async () => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    const oldInput: LinkMobilityGateDestinationInputs = {
      destination: {
        contentType: 'application/json',
        password: 'password-old',
        username: 'username-old',
        url: 'http://some-url.com',
      },
      partnerGateId: 'partnerGateId',
    };

    // Act
    const result = await linkMobilityProvider.diff(input.destination.url, oldInput, input);

    // Assert
    expect(result).toEqual({
      changes: true,
      stables: ['http://some-url.com'],
    });
  });

  it('should generate a diff to replace when the url changes', async () => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-new-url.com',
        contentType: 'application/json',
        username: 'username-new',
        password: 'password-new',
      },
    };

    const oldInput: LinkMobilityGateDestinationInputs = {
      destination: {
        contentType: 'application/json',
        password: 'password-old',
        username: 'username-old',
        url: 'http://some-url.com',
      },
      partnerGateId: 'partnerGateId',
    };

    // Act
    const result = await linkMobilityProvider.diff('http://some-url.com', oldInput, input);

    // Assert
    expect(result).toEqual({
      changes: true,
      replaces: ['http://some-url.com'],
      deleteBeforeReplace: true,
    });
  });

  it('should generate a diff no changes when inputs are the same', async () => {
    // Arrange
    const input: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    const oldInput: LinkMobilityGateDestinationInputs = {
      partnerGateId: 'partnerGateId',
      destination: {
        url: 'http://some-url.com',
        contentType: 'application/json',
        username: 'username',
        password: 'password',
      },
    };

    // Act
    const result = await linkMobilityProvider.diff(input.destination.url, oldInput, input);

    // Assert
    expect(result.changes).toEqual(false);
  });
});
