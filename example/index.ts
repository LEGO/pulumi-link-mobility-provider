import {
  LinkMobilityPartnerGateDestination,
  LinkMobilityPartnerGateDestinationProvider,
} from '@lego/pulumi-link-mobility-provider';
import 'dotenv/config';

const provider = new LinkMobilityPartnerGateDestinationProvider({
  username: process.env.LINK_MOBILITY_USERNAME!,
  password: process.env.LINK_MOBILITY_PASSWORD!,
  url: process.env.LINK_MOBILITY_URL!,
  partner: process.env.LINK_MOBILITY_PARTNER!,
  platform: process.env.LINK_MOBILITY_PLATFORM!,
});

new LinkMobilityPartnerGateDestination('link-mobility-foo-bar-destination', {
  provider: provider,
  partnerGateId: process.env.FOOBAR_PARTNER_GATE_ID!,
  destination: {
    url: 'https://foo.bar',
    contentType: 'application/json',
    // Username & password
    username: process.env.FOOBAR_USERNAME!,
    password: process.env.FOOBAR_PASSWORD!,
    // Custom auth with API Key header
    customParameters: {
      'http.header1': `x-my-secret-header:${process.env.FOOBAR_HEADER_KEY}`,
    },
  },
});
