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

          <!-- Accent line -->
          <tr>
            <td style="background:#9f420c;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:32px;padding-right:10px;">🐱</td>
                  <td style="font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">Cat House</td>
                </tr>
              </table>
              <p style="margin:6px 0 0;font-size:14px;color:#9f420c;font-weight:500;">Atur Ulang Kata Sandi</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding:32px;">
              <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;font-weight:600;line-height:1.5;">
                Halo, {{ $name }}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun Cat House kamu.
                Klik tombol di bawah ini untuk melanjutkan.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td align="center" style="background:#9f420c;border-radius:12px;padding:14px 40px;">
                    <a href="{{ $resetLink }}" style="color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;display:inline-block;letter-spacing:0.3px;">
                      Atur Ulang Kata Sandi
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback text link -->
              <p style="margin:0 0 24px;font-size:12px;color:#aaa;line-height:1.5;word-break:break-all;">
                Jika tombol di atas tidak berfungsi, salin dan buka tautan berikut di browser:<br>
                <a href="{{ $resetLink }}" style="color:#9f420c;text-decoration:underline;">{{ $resetLink }}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 16px;background:#fff8f4;border-radius:8px;border:1px solid #f5e8de;">
                    <p style="margin:0;font-size:12px;color:#8a6e5a;line-height:1.5;">
                      <strong style="color:#9f420c;">&#9432; Peringatan Keamanan</strong><br>
                      Jangan bagikan tautan ini kepada siapa pun. Tautan ini hanya berlaku selama <strong>60 menit</strong> dan hanya bisa digunakan satu kali.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#999;line-height:1.5;">
                Jika kamu tidak meminta pengaturan ulang kata sandi, abaikan email ini. Akun kamu tetap aman.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;"><div style="border-top:1px solid #eee;"></div></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:16px 32px;background:#fafafa;">
              <p style="margin:0 0 4px;font-size:12px;color:#bbb;">
                &copy; {{ date('Y') }} Cat House. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;color:#ccc;">
                Jika ada kendala, hubungi kami di support@cathouse.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
