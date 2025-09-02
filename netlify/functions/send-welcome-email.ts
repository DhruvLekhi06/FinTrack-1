import type { Handler } from "@netlify/functions";

// This is a placeholder for a real email sending service library
// e.g., import sgMail from '@sendgrid/mail';

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST' || !event.body) {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    /*
    // --- To make this function live ---
    // 1. Install your email provider's library: npm install @sendgrid/mail
    // 2. Get an API Key from your provider (e.g., SendGrid).
    // 3. Add the key to your Netlify environment variables:
    //    Go to your site's settings > Build & deploy > Environment > Environment variables
    //    Variable name: SENDGRID_API_KEY
    //    Value: Your_SendGrid_API_Key
    // 4. Uncomment the code below.
    
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
        console.error("SendGrid API key is not configured.");
        // We don't want to block the user's signup, so we'll just log the error
        // and return a success response to the client.
        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: "Signup successful, but welcome email could not be sent (server configuration error)." }) 
        };
    }
    sgMail.setApiKey(sendgridApiKey);
    */

    try {
        const { name, email } = JSON.parse(event.body);

        const welcomeEmailHtml = `
            <div style="font-family: sans-serif; color: #333;">
                <h1 style="color: #6D28D9;">Welcome to FinTrack, ${name}!</h1>
                <p>We're thrilled to have you join the FinTrack family. You've just taken the first and most important step towards mastering your finances.</p>
                <p>With FinTrack, you can:</p>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li>Track all your income and expenses in one place.</li>
                    <li>Set and crush your financial goals.</li>
                    <li>Monitor your investments and watch your wealth grow.</li>
                    <li>Get personalized insights from our AI Advisor.</li>
                </ul>
                <p>To get started, we recommend logging in and linking your first account or adding a few recent transactions.</p>
                <p style="font-weight: bold; text-align: center; margin-top: 20px;">Happy tracking!</p>
                <p style="text-align: center; font-size: 12px; color: #999;">The FinTrack Team</p>
            </div>
        `;
        
        /*
        // --- This is the object you would send to your email provider ---
        const msg = {
            to: email,
            from: 'welcome@yourdomain.com', // This must be a verified sender in your email provider account
            subject: 'Welcome to FinTrack!',
            html: welcomeEmailHtml,
        };

        await sgMail.send(msg); // This is the actual call you would make
        */

        // For now, we'll just log to the console that the email was "sent".
        console.log(`Simulating sending welcome email to ${email} for user ${name}.`);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Welcome email processed successfully." }),
        };
    } catch (error: any) {
        console.error("Error in send-welcome-email function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An internal error occurred while processing the welcome email." }),
        };
    }
};

export { handler };