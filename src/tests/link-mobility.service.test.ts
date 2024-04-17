import { LinkMobilityGateService, LinkMobilityGateServiceInputs } from '../link-mobility.service';
import { LinkMobilityGate, LinkMobilityGateDestination } from '../models';

describe('Test suite for link mobility partner gate service', () => {
  let linkMobilityService: LinkMobilityGateService;
  const mockFetch = jest.fn();

  beforeEach(async () => {
    jest.resetModules();
    global.fetch = mockFetch;
    linkMobilityService = new LinkMobilityGateService({
      username: 'username',
      password: 'password',
      url: 'http://some-url.com',
      platform: 'platform',
      partner: 'partner',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fail to initialise if url is invalid', async () => {
    // Arrange
    const ctorInput: LinkMobilityGateServiceInputs = {
      username: 'username',
      password: 'password',
      url: 'invalid-url',
      platform: 'platform',
      partner: 'partner',
    };

    // Act & Assert
    expect(() => {
      new LinkMobilityGateService(ctorInput);
    }).toThrowError();
  });

  it('should initialise if url is valid', async () => {
    // Arrange
    const ctorInput: LinkMobilityGateServiceInputs = {
      username: 'username',
      password: 'password',
      url: 'http://some-url.com',
      platform: 'platform',
      partner: 'partner',
    };

    // Act
    const service = new LinkMobilityGateService(ctorInput);

    // Assert
    expect(service).toBeDefined();
  });

  it('should get auth', async () => {
    // Act
    // @ts-expect-error Testing a private method here - TypeScript will cry about it but JS will allow it
    const auth = linkMobilityService.getAuth();

    // Assert
    // Base64 encoding of 'username:password' is 'dXNlcm5hbWU6cGFzc3dvcmQ='
    expect(auth).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
  });

  it('should get by id', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    // Act
    const result = await linkMobilityService.getGateById('foo');

    // Assert
    expect(result).toEqual({
      id: 'foo',
      acknowledge: true,
      destinations: [],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    });
  });

  it('should create destination if not exists', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [
        {
          contentType: 'application/json',
          url: 'https://bar.foo',
          username: 'username',
          password: 'password',
        },
      ],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    const destination: LinkMobilityGateDestination = {
      contentType: 'application/json',
      url: 'https://foo.bar',
      username: 'username',
      password: 'password',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    jest.spyOn(linkMobilityService, 'getGateById').mockResolvedValue(response);

    // Act
    await linkMobilityService.createOrUpdateDestination('foo', destination, false);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      'http://some-url.com/gate/partnergate/platform/platform/partner/partner/id/foo',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'foo',
          acknowledge: true,
          destinations: [
            {
              contentType: 'application/json',
              url: 'https://bar.foo',
              username: 'username',
              password: 'password',
            },
            {
              contentType: 'application/json',
              url: 'https://foo.bar',
              username: 'username',
              password: 'password',
            },
          ],
          gateType: 'bar',
          platformId: 'platform',
          platformPartnerId: 'platformPartner',
          refId: 'ref',
          ttl: 1000,
          type: 'type',
        }),
      }
    );
  });

  it('should throw error if destination exists and overwrite is false', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [
        {
          contentType: 'application/json',
          url: 'https://foo.bar',
          username: 'username',
          password: 'password',
        },
      ],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    const destination: LinkMobilityGateDestination = {
      contentType: 'application/json',
      url: 'https://foo.bar',
      username: 'username',
      password: 'password',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    jest.spyOn(linkMobilityService, 'getGateById').mockResolvedValue(response);

    // Act & Assert
    await expect(
      linkMobilityService.createOrUpdateDestination('foo', destination, false)
    ).rejects.toThrowError('Can not create destination as it already exists.');
  });

  it('should update the destination if it exists', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [
        {
          contentType: 'application/json',
          url: 'https://foo.bar',
          username: 'username',
          password: 'password',
        },
      ],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    const destination: LinkMobilityGateDestination = {
      contentType: 'application/json',
      url: 'https://foo.bar',
      username: 'username-new',
      password: 'password-new',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    jest.spyOn(linkMobilityService, 'getGateById').mockResolvedValue(response);

    // Act
    await linkMobilityService.createOrUpdateDestination('foo', destination, true);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      'http://some-url.com/gate/partnergate/platform/platform/partner/partner/id/foo',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'foo',
          acknowledge: true,
          destinations: [
            {
              contentType: 'application/json',
              url: 'https://foo.bar',
              username: 'username-new',
              password: 'password-new',
            },
          ],
          gateType: 'bar',
          platformId: 'platform',
          platformPartnerId: 'platformPartner',
          refId: 'ref',
          ttl: 1000,
          type: 'type',
        }),
      }
    );
  });

  it('should delete destination', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [
        {
          contentType: 'application/json',
          url: 'https://foo.bar',
          username: 'username',
          password: 'password',
        },
        {
          contentType: 'application/json',
          url: 'https://bar.foo',
          username: 'username',
          password: 'password',
        },
      ],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    const destination: LinkMobilityGateDestination = {
      contentType: 'application/json',
      url: 'https://foo.bar',
      username: 'username',
      password: 'password',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    jest.spyOn(linkMobilityService, 'getGateById').mockResolvedValue(response);

    // Act
    await linkMobilityService.deleteDestination('foo', destination);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      'http://some-url.com/gate/partnergate/platform/platform/partner/partner/id/foo',
      {
        method: 'PUT',
        headers: {
          Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'foo',
          acknowledge: true,
          destinations: [
            {
              contentType: 'application/json',
              url: 'https://bar.foo',
              username: 'username',
              password: 'password',
            },
          ],
          gateType: 'bar',
          platformId: 'platform',
          platformPartnerId: 'platformPartner',
          refId: 'ref',
          ttl: 1000,
          type: 'type',
        }),
      }
    );
  });

  it('should do nothing if trying to delete destination that doesnt exist', async () => {
    // Arrange
    const response: LinkMobilityGate = {
      id: 'foo',
      acknowledge: true,
      destinations: [
        {
          contentType: 'application/json',
          url: 'https://bar.foo',
          username: 'username',
          password: 'password',
        },
      ],
      gateType: 'bar',
      platformId: 'platform',
      platformPartnerId: 'platformPartner',
      refId: 'ref',
      ttl: 1000,
      type: 'type',
    };
    const destination: LinkMobilityGateDestination = {
      contentType: 'application/json',
      url: 'https://foo.bar',
      username: 'username',
      password: 'password',
    };
    mockFetch.mockResolvedValue({ json: () => response });

    jest.spyOn(linkMobilityService, 'getGateById').mockResolvedValue(response);

    // Act
    await linkMobilityService.deleteDestination('foo', destination);

    // Assert
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
