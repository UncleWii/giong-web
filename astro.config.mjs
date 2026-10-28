// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Link ngắn cho mã QR (gắn UTM để đo khách quét mã). Trên Vercel các chuyển hướng này chạy bằng
// vercel.json (mã 302); khai báo ở đây để chạy thử được cả khi dev trên máy. Sửa cả hai nơi cùng lúc.
// Không bao giờ gắn UTM vào link nội bộ trong web — UTM chỉ nằm ở link QR / quảng cáo bên ngoài.
const qr = (path, utm) => [`/qr/${path}`, `${utm.page}?utm_source=qr&utm_medium=offline&utm_campaign=${utm.campaign}`];

// https://astro.build/config
export default defineConfig({
  site: "https://giong.cafe",
  integrations: [sitemap({ filter: (page) => !page.includes("/qr/") })],
  redirects: Object.fromEntries([
    qr("hoian", { page: "/cua-hang", campaign: "hoian_ban" }),
    qr("nhatrang", { page: "/cua-hang", campaign: "nhatrang_ban" }),
    qr("57nguyendu", { page: "/cua-hang", campaign: "57nguyendu_ban" }),
    qr("diamond", { page: "/cua-hang", campaign: "diamond_ban" }),
    qr("hangthung", { page: "/cua-hang", campaign: "hangthung_ban" }),
    qr("bao-bi", { page: "/san-pham", campaign: "bao_bi" }),
  ]),
});
