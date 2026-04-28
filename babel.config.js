module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [
      // Allows clean imports like: import { Button } from '@/components/Button'
      // instead of: import { Button } from '../../components/Button'
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './' },
        },
      ],
    ],
  };
};
