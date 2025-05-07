import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Подтверждение электронной почты',
    html: `<p>Пожалуйста, подтвердите свою электронную почту, перейдя по ссылке: <a href="${verificationUrl}">Подтвердить</a></p>`,
  });
};
