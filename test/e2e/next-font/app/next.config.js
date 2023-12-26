module.exports = {
  experimental: {
    fontLoaders: [
      {
        loader: 'neer-font/google',
        options: { subsets: ['latin'] },
      },
      {
        loader: 'neer-font/local',
      },
    ],
  },
}
