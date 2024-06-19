module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@/app': './src/app',
          '@src': './src',
          '@components': './src/components',
        },
      },
    ],
  ],
};