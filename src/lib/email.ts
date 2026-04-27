import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendWelcomeEmail({
  name,
  email,
  tempPassword,
  hubUrl,
}: {
  name: string;
  email: string;
  tempPassword: string;
  hubUrl: string;
}) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Medway Hub" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Seu acesso ao Medway Hub MKT",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#08091A;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#0D1024;border-radius:12px;border:1px solid #1e2340;overflow:hidden;">

    <div style="background:#00205B;padding:32px;text-align:center;">
      <h1 style="color:#01CFB5;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Medway Hub MKT</h1>
      <p style="color:#7a8bbd;margin:8px 0 0;font-size:13px;">Catálogo de projetos internos</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#e2e8f0;font-size:15px;margin:0 0 24px;">Olá, <strong>${name}</strong>!</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Seu acesso ao <strong style="color:#01CFB5;">Medway Hub MKT</strong> foi criado. Use as credenciais abaixo para entrar pela primeira vez.
      </p>

      <div style="background:#131629;border:1px solid #1e2340;border-radius:8px;padding:20px;margin:0 0 24px;">
        <p style="color:#7a8bbd;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">E-mail</p>
        <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0 0 16px;">${email}</p>
        <p style="color:#7a8bbd;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Senha temporária</p>
        <p style="color:#01CFB5;font-size:20px;font-weight:900;margin:0;letter-spacing:2px;">${tempPassword}</p>
      </div>

      <p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">
        ⚠️ Você será solicitado a criar uma nova senha no primeiro acesso.
      </p>

      <a href="${hubUrl}/login" style="display:block;text-align:center;background:#01CFB5;color:#00205B;font-weight:900;font-size:15px;padding:14px;border-radius:8px;text-decoration:none;">
        Acessar o Medway Hub MKT →
      </a>
    </div>

    <div style="padding:20px 32px;border-top:1px solid #1e2340;">
      <p style="color:#4a5568;font-size:12px;margin:0;text-align:center;">
        Este e-mail foi enviado automaticamente. Em caso de dúvidas, entre em contato com o administrador.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}

export function generateTempPassword(): string {
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "23456789";
  const special = "@#!";

  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

  const chars = [
    pick(upper), pick(upper),
    pick(lower), pick(lower), pick(lower),
    pick(nums), pick(nums),
    pick(special),
  ];

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}
