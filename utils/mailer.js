import nodemailer from "nodemailer"

export const sendEmail = async (email, emailSubject, emailBody) => {
  try {
    const body_html = `<!DOCTYPE>
        <html>
            <body>
                <p>Your activation code is: <b></b></p>
                <p>Click on this <a href="http://localhost:3000/?a=activate-account" target="_blank">link</a> to activate your account.</p>
                <p>The activation code will expire after 10 minutes.</p>
                <p>Thank you.</p>
            </body>
        </html>
        `

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
      from: "community.payment.infoapp@gmail.com",
      to: email,
      subject: emailSubject,
      html: emailBody
    }

    await transporter.sendMail(mailOptions, (err, data) => {
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
