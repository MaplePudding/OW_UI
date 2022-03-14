const env = process.env.BABEL_ENV || process.env.NODE_ENV;

module.exports = {
  presets: [
    ['@babel/preset-env',{
      modules:'auto'
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],

  plugins: [
    [
        "@babel/plugin-transform-runtime", {
        "regenerator": true
      }
    ]
  ]

};
