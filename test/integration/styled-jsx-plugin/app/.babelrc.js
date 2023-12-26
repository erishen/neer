console.log('hello from babel!')

module.exports = {
  presets: [
    [
      'neer/babel',
      {
        'styled-jsx': {
          plugins: [require.resolve('styled-jsx-plugin-postcss')],
        },
      },
    ],
  ],
}
