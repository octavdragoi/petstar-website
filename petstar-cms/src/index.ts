import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('Bootstrap: Registering users-permissions lifecycle hooks');

    // Subscribe to lifecycle events for the users-permissions user model
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async afterCreate(event: any) {
        const { result } = event;

        console.log('afterCreate hook triggered for user:', result.email);

        try {
          // Send welcome email to the newly created user
          await strapi.plugin('email').service('email').send({
            to: result.email,
            from: process.env.EMAIL_FROM || 'noreply@petstar-dash.ro',
            subject: 'Welcome to PetStar CMS',
            text: `Hello ${result.username || 'there'},\n\nYour account has been created successfully on the PetStar CMS platform.\n\nUsername: ${result.username}\nEmail: ${result.email}\n\nYou can now log in to the platform.\n\nBest regards,\nThe PetStar Team`,
            html: `
              <h2>Welcome to PetStar CMS</h2>
              <p>Hello ${result.username || 'there'},</p>
              <p>Your account has been created successfully on the PetStar CMS platform.</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <strong>Username:</strong> ${result.username}<br>
                <strong>Email:</strong> ${result.email}
              </div>
              <p>You can now log in to the platform.</p>
              <p>Best regards,<br>The PetStar Team</p>
            `,
          });

          console.log(`Welcome email sent successfully to ${result.email}`);
          strapi.log.info(`Welcome email sent to ${result.email}`);
        } catch (error) {
          console.error('Error sending welcome email:', error);
          strapi.log.error('Error sending welcome email:', error);
          // Don't throw the error to prevent user creation from failing
          // if email sending fails
        }
      },
    });
  },
};
