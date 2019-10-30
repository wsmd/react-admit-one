module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-react', { development: true }],
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
    },
  },
};
