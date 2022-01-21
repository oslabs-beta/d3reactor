/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  verbose: true,
};

export default config;