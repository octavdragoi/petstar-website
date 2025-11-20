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
        middlewares: [],
      },
    },
  ],
};
