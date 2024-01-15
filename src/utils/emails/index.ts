interface Props {
	senderName: string
	recipientName: string
}

interface ForgotPasswordProps extends Props {
	otpCode: string
}

export const welcomeEmail = ({ senderName, recipientName }: Props) => {
	return `<body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">

  <div style="max-width: 600px; margin: 0 auto;">

    <div style="background-color: #f9f9f9; padding: 20px; text-align: center;">
      <h1 style="color: #333;">Welcome to Open-Fashion!</h1>
    </div>

    <div style="padding: 20px;">

      <p>Hi ${recipientName},</p>

      <p>Welcome to Open-Fashion, where every click brings you closer to a world of endless style possibilities! 🎉</p>

      <p>At Open-Fashion, we believe that fashion is more than just clothing; it's a statement, an expression, and an extension of your unique personality. As a valued member of our fashion-forward family, you're not just shopping; you're embracing a lifestyle where creativity knows no bounds.</p>

      <p>Get ready to embark on a journey through the latest trends, curated collections, and exclusive deals tailored just for you. From head-turning outfits to those perfect accessories that complete your look, Open-Fashion is your go-to destination for staying ahead in the style game.</p>

      <p>But it's not just about the clothes; it's about the experience. Expect seamless shopping, speedy deliveries, and a customer support team ready to assist you at every step. We're here to make your Open-Fashion experience unforgettable!</p>

      <p>As a token of our appreciation for joining us on this style adventure, here's a special discount code to use on your first purchase: <strong>WELCOME20OF</strong>. Simply enter it at checkout and let the fashion magic begin!</p>

      <p>Feel free to explore our website <a href="https://www.openfashion.com" target="_blank">www.openfashion.com</a> and discover the latest trends waiting just for you. And don't forget to follow us on social media for daily inspiration, style tips, and exclusive sneak peeks into upcoming collections.</p>

      <p>Thank you for choosing Open-Fashion. Your style journey starts now!</p>

      <p>Cheers to fabulous fashion moments!</p>

      <p>Warm regards,</p>
      <p>${senderName}<br>Open-Fashion Team</p>

      <p><strong>P.S. Stay tuned for more exciting updates and surprises! 🌟</strong></p>

    </div>

  </div>

</body>`
}

export const ForgotPasswordEmail = ({
	senderName,
	recipientName,
	otpCode
}: ForgotPasswordProps) => {
	return `
  <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center;">
        <h1 style="color: #333;">Change Password Request</h1>
      </div>
    </div>

    <div style="padding: 20px;">
      <p>Hi ${recipientName},</p>
      <p>We received your request to change your password. To proceed, please use the following OTP code:</p>

      <strong>OTP Code: ${otpCode}</strong>

      <p>If you didn't initiate this request, please ignore this message. Your account security is important to us.</p>

      <p>Best regards,<br>${senderName}</p>
    </div>
  </body>
  `
}
