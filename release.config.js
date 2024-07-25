module.exports = {
    branches: "main",
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/npm',
      [
        '@semantic-release/github',
        {
          "successComment": "This PR is included in version ${nextRelease.version} 🎉🎉🎉",
        }
      ],
      '@semantic-release/git'
    ],
  };
  