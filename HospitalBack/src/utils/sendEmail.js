import Brevo from "@getbrevo/brevo";

// Send email using Brevo HTTP API
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    // Set API key explicitly
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      String(process.env.EMAIL_PASS)
    );

    await apiInstance.sendTransacEmail({
      sender: {
        email: "junaidsk4901@gmail.com",
        name: "Hospitality App",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  } catch (error) {
    console.error(
      "SEND EMAIL ERROR 👉",
      error?.response?.body || error
    );
    throw error;
  }
};
