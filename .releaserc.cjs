module.exports = {
  branches: [
    "main",

    {
      name: "next",
      channel: "next",
      prerelease: "next",
    },

    {
      name: "alpha",
      channel: "alpha",
      prerelease: "alpha",
    },

    {
      name: "+([0-9])?(.{+([0-9]),x}).x",
      range: "${name}",
      channel: "${name}",
    },
  ],

  tagFormat: "v${version}",

  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",

        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "refactor", release: "patch" },

          { type: "docs", release: false },
          { type: "style", release: false },
          { type: "test", release: false },
          { type: "build", release: false },
          { type: "ci", release: false },
          { type: "chore", release: false },
        ],

        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],

    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],

    "@semantic-release/changelog",

    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        tarballDir: "release",
      },
    ],

    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,

        releasedLabels: ["released"],

        assets: [
          {
            path: "release/*.tgz",
            label: "npm package",
          },
        ],
      },
    ],

    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "package.json",
          "package-lock.json",
        ],

        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};