import {
  LinkMobilityPartnerGateService,
  LinkMobilityPartnerGateServiceInputs,
} from '../link-mobility.service';

describe('Test suite for link mobility partner gate service', () => {
  let linkMobilityService: LinkMobilityPartnerGateService;
  const mockFetch = jest.fn();

  beforeEach(async () => {
    jest.resetModules();
    global.fetch = mockFetch;
    linkMobilityService = new LinkMobilityPartnerGateService({
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
    const ctorInput: LinkMobilityPartnerGateServiceInputs = {
      username: 'username',
      password: 'password',
      url: 'invalid-url',
      platform: 'platform',
      partner: 'partner',
    };

    // Act & Assert
    expect(() => {
      new LinkMobilityPartnerGateService(ctorInput);
    }).toThrowError();
  });
});

it('should initialise if url is valid', async () => {
  // Arrange
  const ctorInput: LinkMobilityPartnerGateServiceInputs = {
    username: 'username',
    password: 'password',
    url: 'http://some-url.com',
    platform: 'platform',
    partner: 'partner',
  };

  // Act
  const service = new LinkMobilityPartnerGateService(ctorInput);

  // Assert
  expect(service).toBeDefined();
});
