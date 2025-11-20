export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://petstar-dash.ro',
            'https://api.petstar-dash.ro',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://petstar-dash.ro',
            'https://api.petstar-dash.ro',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://petstar-dash.ro', 'https://www.petstar-dash.ro', 
               'https://petstar.ro', 'https://www.petstar.ro', 
               'http://localhost:8000','http://localhost:8081'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::redirect-root',
];
