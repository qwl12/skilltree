// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'skilltree@mail.ru',
    pass: process.env.EMAIL_PASS || '5cECVNc3Dwk239xYsjNQ',
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: `"SkillTree" <${process.env.SMTP_USER}>`,
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
    console.log(`Письмо подтверждения отправлено на ${email}`);
  } catch (error) {
    console.error('Ошибка при отправке письма подтверждения:', error);
    throw new Error('Не удалось отправить письмо с подтверждением.');
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"SkillTree" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Сброс пароля',
    html: `
      <p>Вы запросили сброс пароля.</p>
      <p>Чтобы установить новый пароль, перейдите по ссылке ниже:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ссылка активна в течение 1 часа.</p>
    `,
  };
console.log(`🔗 Ссылка на сброс пароля: ${resetUrl}`);
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Письмо для сброса пароля отправлено на ${email}`);
  } catch (error) {
    console.error('Ошибка при отправке письма для сброса пароля:', error);
    throw new Error('Не удалось отправить письмо со ссылкой для сброса пароля.');
  }
}
