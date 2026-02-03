import { NextResponse } from "next/server";
import { transporter, MAIL_FROM, ADMIN_EMAIL } from "@/lib/mail";

// ---- Simple in-memory rate limit ----
const rateLimit = new Map<string, number>();
const RATE_LIMIT_TIME = 60_000;

export async function POST(req: Request) {
  try {
    const { name, email, message, honeypot } = await req.json();

    // 🛑 Honeypot
    if (honeypot) return NextResponse.json({ success: true });

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🛑 Rate limit
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const last = rateLimit.get(ip);
    if (last && Date.now() - last < RATE_LIMIT_TIME) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }
    rateLimit.set(ip, Date.now());

    // ---- Admin Email ----
    const adminHtml = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#f7f7f7;padding:24px;">
  <div style="max-width:600px;background:#ffffff;border-radius:16px;padding:24px;">
    <h2>New Contact Message 💌</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <hr />
    <p style="white-space:pre-line;">${message}</p>
  </div>
</body>
</html>
`;

    // ---- User Premium Auto Reply ----
    const userHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fdecef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(236,72,153,.2);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#f472b6,#ec4899);padding:28px;">
              <div style="color:#fff;">
                <div style="font-size:22px;font-weight:700;">Tohfaah</div>
                <div style="font-size:13px;opacity:.9;">
                  Where feelings become experiences
                </div>
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 24px;font-size:16px;line-height:1.7;color:#333;">
              Hi ${name} 💗
              <br /><br />
              Thank you for reaching out to <strong>Tohfaah</strong>.
              <br /><br />
              We’ve received your message and our team will get back to you
              within <strong>24 hours</strong>.
            </td>
          </tr>

          <!-- MESSAGE PREVIEW -->
          <tr>
            <td style="padding:0 24px 24px;">
              <div style="background:#fff0f6;border-radius:16px;padding:16px;font-size:14px;color:#555;">
                <strong>Your message:</strong><br /><br />
                ${message}
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px;font-size:14px;color:#777;">
              With love,<br />
              <strong>Team Tohfaah</strong><br />
              <span style="color:#aaa;">Crafted with care 💗</span>
            </td>
          </tr>
        </table>

        <div style="max-width:520px;text-align:center;font-size:12px;color:#aaa;margin-top:16px;">
          © ${new Date().getFullYear()} Tohfaah
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // ---- Send emails ----
    await transporter.sendMail({
      from: MAIL_FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: "New Contact Message – Tohfaah",
      html: adminHtml,
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: "We’ve received your message 💗",
      html: userHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CONTACT MAIL ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
