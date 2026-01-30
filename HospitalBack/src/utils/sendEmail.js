import SibApiV3Sdk from "sib-api-v3-sdk";

// Send email using Brevo HTTP API
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    // Configure API key
    client.authentications["api-key"].apiKey =
      process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
    console.error("SEND EMAIL ERROR ", error);
    throw error;
  }
};
