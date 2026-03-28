const TYPES = [
  'feat',
  'fix',
  'refactor',
  'perf',
  'style',
  'test',
  'docs',
  'build',
  'ops',
  'chore',
];

const HEADER_PATTERN =
  /^(feat|fix|refactor|perf|style|test|docs|build|ops|chore)\(([^()]+)\): (.+) \[([A-Z]+-\d+(?:-\d+)*)\]$/;

const config = {
  parserPreset: {
    parserOpts: {
      headerPattern: HEADER_PATTERN,
      headerCorrespondence: ['type', 'scope', 'subject', 'ticket'],
    },
  },
  plugins: [
    {
      rules: {
        'jira-ticket-format': ({ header }) => {
          const valid = HEADER_PATTERN.test(header ?? '');

          return [
            valid,
            'commit message must match type(scope): description [JIRA-123-45]',
          ];
        },
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', TYPES],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'jira-ticket-format': [2, 'always'],
  },
  helpUrl:
    'Expected format: type(scope): description [JIRA-123-45]. Example: build(release): bump version to 1.0.0 [JEMS-28-03]',
};

export default config;
