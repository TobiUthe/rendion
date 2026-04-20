import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color|fill|stroke)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '390px', height: '844px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
        wide: { name: 'Wide', styles: { width: '1536px', height: '900px' } },
      },
    },
    layout: 'centered',
    a11y: {
      test: 'todo',
    },
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: [
          'Design System', ['Colors', 'Typography', 'Shadows'],
          'Primitives',
          'Components',
          'Comprehensive Components', ['*', 'Charts'],
          'Pages', ['Marketing', 'Dashboard'],
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Light: 'light',
        Dark: 'dark',
      },
      defaultTheme: 'Light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;