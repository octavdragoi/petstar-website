/**
 * Contact form controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async submit(ctx) {
    try {
      const { name, email, phone, subject, message } = ctx.request.body;

      // Validate required fields
      if (!name || !email || !phone || !message) {
        return ctx.badRequest('Missing required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest('Invalid email format');
      }

      // Map subject values to readable labels
      const subjectLabels = {
        preforms: 'PET Preforms Inquiry',
        recycling: 'Recycling Services',
        partnership: 'Partnership Opportunity',
        general: 'General Inquiry'
      };

      const subjectLabel = subject ? (subjectLabels[subject] || subject) : 'General Inquiry';

      // Prepare email template data
      const emailTemplate = {
        subject: `New Contact Form Submission - ${subjectLabel}`,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subjectLabel}

Message:
${message}

---
This email was sent from the PetStar website contact form.
        `,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #0075ff 0%, #004db3 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
    }
    .email-header p {
      margin: 10px 0 0 0;
      color: #e6f2ff;
      font-size: 14px;
    }
    .email-body {
      padding: 40px 30px;
    }
    .info-section {
      background-color: #f8f9fa;
      border-left: 4px solid #0075ff;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .info-row {
      margin-bottom: 15px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-weight: 600;
      color: #051229;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .info-value {
      color: #495057;
      font-size: 14px;
      line-height: 1.5;
    }
    .info-value a {
      color: #0075ff;
      text-decoration: none;
    }
    .message-section {
      margin-top: 30px;
    }
    .message-label {
      font-weight: 600;
      color: #051229;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .message-content {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
      color: #495057;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .email-footer {
      background-color: #051229;
      padding: 30px;
      text-align: center;
    }
    .email-footer p {
      margin: 0;
      color: #8b92a7;
      font-size: 12px;
      line-height: 1.5;
    }
    .email-footer .company-name {
      color: #ffffff;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .divider {
      height: 1px;
      background-color: #e9ecef;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px;
      }
      .email-header {
        padding: 30px 20px;
      }
      .email-body {
        padding: 30px 20px;
      }
      .email-footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>New Contact Form Submission</h1>
      <p>${subjectLabel}</p>
    </div>

    <div class="email-body">
      <div class="info-section">
        <div class="info-row">
          <div class="info-label">Name</div>
          <div class="info-value">${name}</div>
        </div>

        <div class="info-row">
          <div class="info-label">Email Address</div>
          <div class="info-value">
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label">Phone Number</div>
          <div class="info-value">
            <a href="tel:${phone}">${phone}</a>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label">Subject</div>
          <div class="info-value">${subjectLabel}</div>
        </div>
      </div>

      <div class="message-section">
        <div class="message-label">Message</div>
        <div class="message-content">${message}</div>
      </div>

      <div class="divider"></div>

      <p style="color: #6c757d; font-size: 13px; margin: 0;">
        This email was sent from the PetStar website contact form at ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
      </p>
    </div>

    <div class="email-footer">
      <p class="company-name">PetStar Holding</p>
      <p>DN 2A Km 64, 920051 Slobozia, Ialomița, Romania</p>
      <p style="margin-top: 10px;">
        <a href="https://www.petstar.ro" style="color: #0075ff; text-decoration: none;">www.petstar.ro</a> |
        <a href="tel:+40243232855" style="color: #0075ff; text-decoration: none;">+40 243 232 855</a>
      </p>
    </div>
  </div>
</body>
</html>
        `
      };

      // Send email to technical team
      await strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to: process.env.CONTACT_EMAIL || 'tehnic@petstar.ro',
          from: process.env.EMAIL_FROM || 'noreply@petstar-dash.ro',
          replyTo: email,
        },
        emailTemplate,
        {}
      );

      // Send confirmation email to user
      const confirmationTemplate = {
        subject: 'Thank you for contacting PetStar',
        text: `
Dear ${name},

Thank you for reaching out to PetStar. We have received your message and our team will get back to you as soon as possible.

Your inquiry details:
Subject: ${subjectLabel}

We appreciate your interest in PetStar and look forward to connecting with you.

Best regards,
The PetStar Team

---
PetStar Holding
DN 2A Km 64, 920051 Slobozia, Ialomița, Romania
Phone: +40 243 232 855
Website: www.petstar.ro
        `,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - PetStar</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #0075ff 0%, #004db3 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 600;
    }
    .email-body {
      padding: 40px 30px;
    }
    .email-body p {
      color: #495057;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 15px 0;
    }
    .email-body p:last-child {
      margin-bottom: 0;
    }
    .highlight-box {
      background-color: #f8f9fa;
      border-left: 4px solid #0075ff;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .highlight-box p {
      margin: 0;
      color: #051229;
      font-weight: 500;
    }
    .cta-button {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button a {
      display: inline-block;
      background-color: #0075ff;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
    }
    .email-footer {
      background-color: #051229;
      padding: 30px;
      text-align: center;
    }
    .email-footer p {
      margin: 0;
      color: #8b92a7;
      font-size: 12px;
      line-height: 1.5;
    }
    .email-footer .company-name {
      color: #ffffff;
      font-weight: 600;
      margin-bottom: 5px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px;
      }
      .email-header {
        padding: 30px 20px;
      }
      .email-body {
        padding: 30px 20px;
      }
      .email-footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Thank You!</h1>
    </div>

    <div class="email-body">
      <p>Dear ${name},</p>

      <p>Thank you for reaching out to PetStar. We have received your message and our team will get back to you as soon as possible.</p>

      <div class="highlight-box">
        <p>Your inquiry: ${subjectLabel}</p>
      </div>

      <p>We appreciate your interest in PetStar and look forward to connecting with you.</p>

      <div class="cta-button">
        <a href="https://www.petstar.ro">Visit Our Website</a>
      </div>

      <p style="margin-top: 30px;">Best regards,<br><strong>The PetStar Team</strong></p>
    </div>

    <div class="email-footer">
      <p class="company-name">PetStar Holding</p>
      <p>DN 2A Km 64, 920051 Slobozia, Ialomița, Romania</p>
      <p style="margin-top: 10px;">
        <a href="https://www.petstar.ro" style="color: #0075ff; text-decoration: none;">www.petstar.ro</a> |
        <a href="tel:+40243232855" style="color: #0075ff; text-decoration: none;">+40 243 232 855</a>
      </p>
    </div>
  </div>
</body>
</html>
        `
      };

      await strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to: email,
          from: process.env.EMAIL_FROM || 'noreply@petstar-dash.ro',
        },
        confirmationTemplate,
        {}
      );

      return ctx.send({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!'
      });

    } catch (error) {
      strapi.log.error('Contact form error:', error);
      return ctx.internalServerError('An error occurred while processing your request. Please try again later.');
    }
  },
}));
