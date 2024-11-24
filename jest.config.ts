import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  "coveragePathIgnorePatterns": [
    ".entity.ts",
    ".mapper.ts",
    ".module.ts",
    "main.ts"
  ],
  testEnvironment: 'node',
};

export default config;
