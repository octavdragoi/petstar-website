module.exports = (plugin) => {
  // Add lifecycle hooks to the user content type
  plugin.contentTypes.user.lifecycles = {
    async afterCreate(event) {
      const { result } = event;

      try {
        // Send welcome email to the newly created user
        await strapi.plugins['email'].services.email.send({
          to: result.email,
          from: process.env.EMAIL_FROM || 'noreply@petstar.com',
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

        strapi.log.info(`Welcome email sent to ${result.email}`);
      } catch (error) {
        strapi.log.error('Error sending welcome email:', error);
        // Don't throw the error to prevent user creation from failing
        // if email sending fails
      }
    },
  };

  return plugin;
};
