const nodemailer = require("nodemailer");

exports.sendEmail = async (msg) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "fenamavani37@gmail.com",
        pass: "nnpbvgknrklkmqhv",      
      },
    });

    
    const info = await transporter.sendMail(msg);
    console.log("✔ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
