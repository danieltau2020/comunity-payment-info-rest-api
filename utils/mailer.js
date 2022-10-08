import nodemailer from "nodemailer"

export const sendEmail = async (email, emailSubject, emailBody) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: emailSubject,
      html: emailBody
    }

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error occured", err)
      } else {
        console.log("Email sent!")
      }
    })

    return { error: false }
  } catch (error) {
    console.error("send-mail-error", error)
    return {
      error: true,
      message: "Cannot send email"
    }
  }
}
