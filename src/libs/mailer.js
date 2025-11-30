import nodemailer from "nodemailer";
import 'dotenv/config';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "OTP Reset Password Cofeeder",
      text: `Kode OTP kamu adalah: ${otp}.\nKode ini berlaku selama 2 menit.`,
      html: `
        <h2 style="color:#333;">Reset Password Cofeeder</h2>
        <p>Kode OTP kamu:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>Kode ini berlaku selama <b>2 menit</b>.</p>
      `
    });
  } catch (err) {
    console.error("Gagal kirim email OTP:", err);
    throw new Error("Email gagal dikirim");
  }
}
