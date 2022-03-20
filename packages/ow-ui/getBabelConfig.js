module.exports = () => {
  return {
    presets: [
      '@babel/preset-react',
      "@babel/preset-typescript",
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: [
              "> 0.5%",
              "last 2 versions",
              "Firefox ESR",
              "not dead",
              "not IE 11"
            ]
          }
        },
      ],
    ],
    plugins: [

    ]
  };
};
