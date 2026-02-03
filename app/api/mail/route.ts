import { NextResponse } from "next/server";
import { transporter, MAIL_FROM } from "@/lib/mail";

// ---- Simple in-memory rate limit (MVP safe) ----
const rateLimit = new Map<string, number>();
const RATE_LIMIT_TIME = 60_000; // 1 minute

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, giftUrl, honeypot } = body;

    // 🛑 Honeypot spam protection
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!email || !giftUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🛑 Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const lastRequest = rateLimit.get(ip);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_TIME) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    rateLimit.set(ip, Date.now());

    // ---- Pinterest-style pink email ----
    const userHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fdecef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(236,72,153,0.15);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#f472b6,#ec4899);padding:28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="56" valign="middle">
                    <div style="background:#ffffff;border-radius:14px;padding:8px;display:inline-block;">
                      <img
                        src="https://tohfaah.com/logo.png"
                        alt="Tohfaah"
                        width="32"
                        style="display:block;border-radius:8px;"
                      />
                    </div>
                  </td>
                  <td valign="middle" style="padding-left:12px;color:#ffffff;">
                    <div style="font-size:20px;font-weight:700;">Tohfaah</div>
                    <div style="font-size:13px;opacity:0.9;">
                      Gifts that speak feelings
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 24px;color:#333;font-size:16px;line-height:1.7;">
              Hi ${name || "Lovely Soul"} 💖
              <br /><br />
              Someone sent you a <strong>special gift</strong> on Tohfaah.
              <br />
              It’s filled with love, feelings, and a little magic ✨
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:8px 24px 32px;">
              <a
                href="${giftUrl}"
                style="
                  background:linear-gradient(135deg,#ec4899,#f472b6);
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:999px;
                  font-size:16px;
                  font-weight:600;
                  display:inline-block;
                  box-shadow:0 8px 20px rgba(236,72,153,0.35);
                "
              >
                Open Your Gift 🎁
              </a>
            </td>
          </tr>

          <!-- SOFT CARD -->
          <tr>
            <td style="padding:0 24px 32px;">
              <div style="background:#fff0f6;border-radius:16px;padding:16px;font-size:14px;color:#555;">
                💌 This gift was carefully created just for you.  
                Open it when you’re ready to feel something special.
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px;color:#777;font-size:14px;">
              With love,<br />
              <strong>Team Tohfaah</strong><br />
              <span style="color:#aaa;">
                Turning feelings into beautiful moments
              </span>
            </td>
          </tr>
        </table>

        <div style="max-width:520px;text-align:center;font-size:12px;color:#aaa;margin-top:16px;">
          © ${new Date().getFullYear()} Tohfaah · Made with 💗
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // ---- Send Email ----
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: "A special gift is waiting for you 💝",
      html: userHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMTP ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
