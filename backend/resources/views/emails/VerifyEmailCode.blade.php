<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 32px 0;">
              <h1 style="margin:0;font-size:24px;color:#1a1a1a;">🐱 Cat House</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#666;">Verifikasi Alamat Email</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td align="center" style="padding:32px;">
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.5;">
                Halo,<br>
                Masukkan kode OTP di bawah ini untuk memverifikasi email kamu.
              </p>
              <div style="background:#f8f5f0;border-radius:12px;padding:24px;margin:0 0 24px;">
                <p style="margin:0 0 8px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Kode Verifikasi</p>
                <p style="margin:0;font-size:36px;font-weight:700;color:#9f420c;letter-spacing:8px;font-family:monospace;">{{ $code }}</p>
              </div>
              <p style="margin:0;font-size:13px;color:#999;">
                Kode ini berlaku selama <strong style="color:#666;">2 menit</strong>.
                Abaikan email ini jika kamu tidak melakukan pendaftaran.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:16px 32px;background:#fafafa;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#bbb;">&copy; {{ date('Y') }} Cat House. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
