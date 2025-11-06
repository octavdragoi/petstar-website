export default ({ env }) => {
  const config: any = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };

  // Only set URL if explicitly provided in env
  // This prevents malformed URLs in development
  const url = env('URL');
  if (url) {
    config.url = url;
  }

  return config;
};
