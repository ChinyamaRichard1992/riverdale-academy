const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your.email@gmail.com',     // Replace with your Gmail
        pass: 'your-app-password'         // Replace with your app password
    }
});

// Test the connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Server error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { studentName, email, grade, balance, dueDate } = req.body;

        // Email HTML template
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Riverdale Academy - Balance Notification</h2>
                
                <p>Dear ${studentName},</p>
                
                <p>This is a friendly reminder regarding your outstanding balance at Riverdale Academy.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Student Details:</h3>
                    <ul style="list-style: none; padding-left: 0;">
                        <li><strong>Name:</strong> ${studentName}</li>
                        <li><strong>Grade:</strong> ${grade}</li>
                        <li><strong>Outstanding Balance:</strong> K${balance}</li>
                        <li><strong>Due Date:</strong> ${dueDate}</li>
                    </ul>
                </div>
                
                <p>Please arrange for payment of the outstanding balance by the due date to ensure uninterrupted access to school services.</p>
                
                <p>If you have already made the payment, please disregard this notice and provide us with the payment details for our records.</p>
                
                <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #3498db;">
                    <p style="margin: 0;"><strong>Contact Information:</strong><br>
                    Phone: 0962299100, 0765099249</p>
                </div>
                
                <p>Thank you for your prompt attention to this matter.</p>
                
                <p>Best regards,<br>
                Riverdale Academy Administration</p>
            </div>
        `;

        const mailOptions = {
            from: 'Riverdale Academy <your.email@gmail.com>', // Replace with your Gmail
            to: email,
            subject: 'Outstanding Balance Notification - Riverdale Academy',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});