import {
  LinkMobilityPartnerGateDestination,
  LinkMobilityPartnerGateDestinationProvider,
} from '@lego/pulumi-link-mobility-provider';
import 'dotenv/config';

const provider = new LinkMobilityPartnerGateDestinationProvider({
  username: process.env.USERNAME!,
  password: process.env.PASSWORD!,
  url: 'https://XX.linkmobility.io',
  partner: '0000',
  platform: 'XXXX',
});

new LinkMobilityPartnerGateDestination('link-mobility-foo-bar-destination', {
  provider: provider,
  partnerGateId: 'xxxxx',
  destination: {
    url: 'https://foo.bar',
    contentType: 'application/json',
    customParameters: {
      'http.header1': 'x-my-secret-header:placeholders',
    },
  },
});
