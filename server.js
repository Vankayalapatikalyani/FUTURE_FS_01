require("dotenv").config({ path: __dirname + "/.env" });

console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER || "Not Found");
console.log("Loaded EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Found");
console.log("Loaded EMAIL_RECEIVER:", process.env.EMAIL_RECEIVER || "Not Found");
console.log("Loaded PORT:", process.env.PORT || "Not Found");
require("dotenv").config(); 

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to send emails.");
    }
});

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: `Failed to send message: ${error.message}` });
    }
    
});
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
