/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type {Config} from '@jest/types';
const config: Config.InitialOptions = {
  roots: ['./src','./tests'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },
  globalSetup: "./tests/global-setup.js",
  
};

export default config;