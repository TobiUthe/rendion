import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.stories.@(ts|tsx)",
    "../src/stories/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
};
export default config;