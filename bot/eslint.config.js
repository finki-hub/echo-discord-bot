import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

const config = [
  { ignores: ['dist/'] },
  ...base,
  node,
  typescript,
  prettier,
  perfectionist,
];

export default config;
