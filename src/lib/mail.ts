import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'skilltree@mail.ru',
    pass: '5cECVNc3Dwk239xYsjNQ',
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: '"SkillTree" <skilltree@mail.ru>',
    to: email,
    subject: 'Подтверждение электронной почты',
    html: `
      <p>Здравствуйте!</p>
      <p>Пожалуйста, подтвердите свою электронную почту, перейдя по ссылке ниже:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Ссылка действительна в течение 15 минут.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Письмо отправлено на ${email}`);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    throw new Error('Не удалось отправить письмо с подтверждением.');
  }
}
