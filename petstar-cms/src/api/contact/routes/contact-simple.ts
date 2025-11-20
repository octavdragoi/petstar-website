/**
 * Contact form routes - Simple version without middleware for testing
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/contact/submit-test',
      handler: 'contact.submit',
      config: {
        auth: false, // Allow public access
        policies: [],
        middlewares: [],
      },
    },
  ],
};
