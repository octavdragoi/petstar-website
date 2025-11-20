/**
 * Contact form routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/contact/submit',
      handler: 'contact.submit',
      config: {
        auth: false, // Allow public access
        policies: [],
        middlewares: [
          {
            name: 'api::contact.rate-limit',
            config: {
              max: 5, // Maximum 5 requests
              windowMs: 15 * 60 * 1000, // Per 15 minutes
            },
          },
        ],
      },
    },
  ],
};
