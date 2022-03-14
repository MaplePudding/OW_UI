module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../packages/ow-ui/**/_story/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-viewport'
  ],
  framework: "@storybook/react",
};
