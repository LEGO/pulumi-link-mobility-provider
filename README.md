[![CI](https://github.com/LEGO/pulumi-link-mobility-provider/actions/workflows/ci.yml/badge.svg)](https://github.com/LEGO/pulumi-link-mobility-provider/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@lego%2Fpulumi-link-mobility-provider.svg)](https://www.npmjs.com/package/@lego/pulumi-link-mobility-provider)
[![License](https://img.shields.io/npm/l/@lego/pulumi-link-mobility-provider)](https://github.com/LEGO/pulumi-link-mobility-provider/blob/main/LICENSE)

# pulumi-link-mobility-provider

A pulumi custom provider that allows you to create, update and delete destinations in Link Mobility's partner gate.

## Installation

To use from JavaScript or TypeScript in Node.js, install using either `npm`:

```
npm install @lego/pulumi-link-mobility-provider
```

or `yarn`:

```
yarn add @lego/pulumi-link-mobility-provider
```

## Usage

```typescript
const provider = new LinkMobilityPartnerGateDestinationProvider({
  username: 'myGateUsername',
  password: 'myNotSoSecretPassword',
  url: 'https://n-eu.linkmobility.io',
  partner: 'myPartner',
  platform: 'myPlatform',
});

new LinkMobilityPartnerGateDestination('link-mobility-foo-bar-destination', {
  provider: provider,
  partnerGateId: 'myPartnerGateId',
  destination: {
    url: 'https://foo.bar',
    contentType: 'application/json',
    // Username & password
    username: 'fooBarUsername',
    password: 'myEvenWorsePassword',
    // Custom auth with API Key header
    customParameters: {
      'http.header1': `x-my-secret-header:myApiKey`,
    },
  },
});
```

> [!CAUTION]
> It is highly recommended you do _NOT_ leave your passwords/API-keys in clear text, but instead store them as secrets in your Pulumi project. For the sake of showing an example they have been left in clear text here.

## Contribution

This project welcomes contributions and suggestions.
Would you like to contribute to the project? Learn how to contribute [here](CONTRIBUTING.md).

## License

[Modified Apache 2.0 (Section 6)](LICENSE)

## Open Source Attribution

### Project Dependencies

- [@pulumi/pulumi](https://www.npmjs.com/package/@pulumi/pulumi): [Apache 2.0](https://github.com/pulumi/pulumi/blob/master/LICENSE)

### Dev Dependencies

- [@semantic-release/changelog](https://www.npmjs.com/package/@semantic-release/changelog) - [MIT](https://github.com/semantic-release/changelog/blob/master/LICENSE)
- [@semantic-release/git](https://www.npmjs.com/package/@semantic-release/git) - [MIT](https://github.com/semantic-release/git/blob/master/LICENSE)
- [@types/jest](https://www.npmjs.com/package/@types/jest): [MIT](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- [@types/node](https://www.npmjs.com/package/@types/node): [MIT](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE)
- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin): [BSD-2-Clause](https://github.com/typescript-eslint/typescript-eslint/blob/main/LICENSE)
- [@typescript-eslint/parser](https://www.npmjs.com/package): [BSD-2-Clause](https://github.com/typescript-eslint/typescript-eslint/blob/main/LICENSE)
- [semantic-release](https://www.npmjs.com/package/semantic-release): [MIT](https://github.com/semantic-release/semantic-release/blob/master/LICENSE)
- [eslint](https://www.npmjs.com/package/eslint): [MIT](https://github.com/eslint/eslint/blob/main/LICENSE)
- [husky](https://github.com/typicode/husky): [MIT](https://github.com/typicode/husky?tab=MIT-1-ov-file#readme)
- [jest](https://www.npmjs.com/package/jest): [MIT](https://github.com/facebook/jest/blob/main/LICENSE)
- [ts-jest](https://www.npmjs.com/package/ts-jest): [MIT](https://github.com/kulshekhar/ts-jest/blob/main/LICENSE.md)
- [typescript](https://www.npmjs.com/package/typescript): [Apache 2.0](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)
