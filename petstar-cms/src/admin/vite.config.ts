import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
      host: true,
      hmr: {
        clientPort: 1337,
      },
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'api.petstar-dash.ro',
        'petstar-dash.ro',
      ],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
