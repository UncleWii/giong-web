// Nhận form "Yêu cầu báo giá cà phê sỉ" (trang /ngua-o) và gửi email về hộp thư của Gióng.
// Chạy trên Vercel Functions (gói free), gửi email qua Resend (gói free: 100 thư/ngày).
//
// Biến môi trường (đặt ở Vercel > Settings > Environment Variables, KHÔNG ghi vào mã nguồn):
//   RESEND_API_KEY   khoá API lấy từ resend.com (bắt buộc)
//   LEAD_TO_EMAIL    hộp thư nhận yêu cầu, vd. quy.nn@ecogiong.com (bắt buộc)
//   LEAD_FROM_EMAIL  người gửi, mặc định "Gióng Web <onboarding@resend.dev>" (chỉ gửi được tới email chủ tài khoản Resend;
//                    xác minh tên miền giong.cafe trên Resend rồi đổi thành vd. "Gióng Web <web@giong.cafe>")
// Chưa đặt khoá → trả 503, trang web tự chuyển sang đường dự phòng (formsubmit.co).

const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?giong\.cafe$/, /^https:\/\/giong-web[a-z0-9-]*\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];
const NEED_LABELS = { bao_gia: "Nhận báo giá sỉ", mau_thu: "Đặt mẫu thử" };
const FIELDS = [
  ["name", "Họ tên", 100],
  ["phone", "Số điện thoại", 30],
  ["email", "Email", 120],
  ["company", "Đơn vị", 150],
  ["quantity", "Số lượng dự kiến", 100],
  ["region", "Khu vực", 120],
  ["need", "Nhu cầu", 40],
  ["use", "Loại hình sử dụng", 150],
];

// Giới hạn tạm thời theo IP (chỉ có tác dụng trong cùng một lần máy chủ đang chạy).
const hits = new Map();
const tooMany = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reply = (res, status, body) => res.status(status).setHeader("Cache-Control", "no-store").json(body);

export default async function handler(req, res) {
  if (req.method !== "POST") return reply(res, 405, { success: false, error: "method" });

  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.some((re) => re.test(origin))) return reply(res, 403, { success: false, error: "origin" });

  const body = typeof req.body === "object" && req.body ? req.body : {};
  // Ô ẩn dành cho robot: người thật không điền. Báo thành công giả để robot không thử lại.
  if (body._honey) return reply(res, 200, { success: true });

  const data = {};
  for (const [key, , max] of FIELDS) data[key] = String(body[key] ?? "").trim().slice(0, max);

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (data.name.length < 2 || phoneDigits.length < 8 || phoneDigits.length > 15 || !data.region) {
    return reply(res, 400, { success: false, error: "invalid" });
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return reply(res, 400, { success: false, error: "invalid_email" });

  const ip = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return reply(res, 429, { success: false, error: "rate" });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) return reply(res, 503, { success: false, error: "not_configured" });

  data.need = NEED_LABELS[data.need] ?? data.need;
  const rows = FIELDS.filter(([k]) => data[k]).map(([k, label]) => [label, data[k]]);
  const html = `<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif">${rows
    .map(([l, v]) => `<tr><td style="border:1px solid #ddd;background:#f6f1e4"><b>${esc(l)}</b></td><td style="border:1px solid #ddd">${esc(v)}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || "Gióng Web <onboarding@resend.dev>",
        to: [to],
        ...(data.email ? { reply_to: data.email } : {}),
        subject: "Yêu cầu báo giá cà phê sỉ — Ngựa Ô",
        html,
        text,
      }),
    });
    if (!r.ok) return reply(res, 502, { success: false, error: "send_failed" });
    return reply(res, 200, { success: true });
  } catch {
    return reply(res, 502, { success: false, error: "send_failed" });
  }
}
