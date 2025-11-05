/**
 * Custom middleware to redirect root path to admin panel
 * Prevents redirect loops when accessing https://api.petstar-dash.ro/
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Only handle root path
    if (ctx.path === '/' && ctx.method === 'GET') {
      // Redirect to admin panel
      ctx.redirect('/admin');
      return;
    }

    // Continue to next middleware
    await next();
  };
};
