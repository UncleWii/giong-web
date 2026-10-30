// Theo dõi Meta Pixel + Google Analytics 4 — MỘT module duy nhất, nạp một lần trong BaseLayout.
//
// - Mã chỉ gắn đúng: Meta Pixel 2234096230469629 và GA4 G-XJDS7W9MTZ (không dùng plugin / GTM).
// - Production (giong.cafe): bật bình thường.
// - Bản nháp / localhost / *.vercel.app: KHÔNG gửi gì, trừ khi URL có ?debug_tracking=1.
//   Khi đó GA4 gửi kèm debug_mode=true (xem ở DebugView) và mọi sự kiện được in ra console.
//   (?debug_tracking=0 để tắt lại; cờ được nhớ trong tab bằng sessionStorage để đi qua các trang.)
// - Mỗi lần xem trang: đúng 1 PageView (Pixel) + 1 page_view (GA4).
// - Không bao giờ gửi họ tên, số điện thoại, email của khách vào tham số sự kiện.

const env = import.meta.env;
const META_PIXEL_ID = String(env.PUBLIC_META_PIXEL_ID || "2234096230469629");
const GA4_ID = String(env.PUBLIC_GA4_ID || "G-XJDS7W9MTZ");
// Google Ads (tùy chọn): có mã AW-… thì nạp thẻ Google Ads (remarketing) và gửi chuyển đổi cho 4 hành động chính.
// Không đặt thì web hoạt động y như cũ. Nhãn chuyển đổi lấy ở Google Ads > Mục tiêu > Chuyển đổi > Thẻ Google.
const GADS_ID = String(env.PUBLIC_GOOGLE_ADS_ID || "");
const GADS_LABELS: Record<string, string | undefined> = {
  click_chi_duong: env.PUBLIC_GADS_LABEL_CHI_DUONG,
  click_goi_chi_nhanh: env.PUBLIC_GADS_LABEL_GOI,
  click_zalo: env.PUBLIC_GADS_LABEL_ZALO,
  click_mua_ngay: env.PUBLIC_GADS_LABEL_MUA_NGAY,
};
const TRACKING_ENABLED = String(env.PUBLIC_TRACKING_ENABLED ?? "true").toLowerCase() !== "false";
const PROD_HOSTS = ["giong.cafe", "www.giong.cafe"];
const DEBUG_KEY = "giong-debug-tracking";

type Params = Record<string, string | number | string[] | undefined>;

// Tên sự kiện GA4  →  sự kiện Meta Pixel (custom = trackCustom). ga:false = chỉ gửi Meta.
const EVENTS: Record<string, { meta: string; custom?: boolean; ga?: boolean }> = {
  click_zalo: { meta: "Contact" },
  click_mua_ngay: { meta: "AddToCart" },
  xem_chi_tiet_sp: { meta: "ViewContent" },
  view_item: { meta: "ViewContent" },
  click_chi_duong: { meta: "FindLocation" },
  click_goi_chi_nhanh: { meta: "Contact" },
  click_goi_van_phong: { meta: "Contact" },
  generate_lead: { meta: "Lead" },
  mo_form_si: { meta: "InitiateCheckout" },
  click_lien_he_si: { meta: "Contact" },
  loc_thanh_pho: { meta: "LocThanhPho", custom: true },
  xem_menu: { meta: "ViewContent" },
  xem_trang_quan: { meta: "ViewContent" },
  click_quan_khac: { meta: "ClickQuanKhac", custom: true },
  xem_anh_khong_gian: { meta: "XemAnhKhongGian", custom: true },
  xem_danh_gia: { meta: "ViewContent" },
  xem_tren_30s: { meta: "XemTren30s", custom: true },
  // Trang Câu chuyện / Farm / Thiên Lý / Kiến thức: GA4 đã có page_view tự động → chỉ gửi ViewContent cho Meta.
  xem_trang_noi_dung: { meta: "ViewContent", ga: false },
};

const w = window as unknown as Record<string, any>;

function readDebug(): boolean {
  const q = new URLSearchParams(location.search).get("debug_tracking");
  try {
    if (q === "1") sessionStorage.setItem(DEBUG_KEY, "1");
    if (q === "0") sessionStorage.removeItem(DEBUG_KEY);
    return sessionStorage.getItem(DEBUG_KEY) === "1";
  } catch {
    return q === "1";
  }
}

const isProduction = PROD_HOSTS.includes(location.hostname);
const debug = readDebug();
const active = TRACKING_ENABLED && (isProduction || debug);

const clean = (p: Params): Params =>
  Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== ""));

// Tên tham số và giá trị tự đặt: chữ thường, không dấu, gạch dưới (chi_nhanh giữ nguyên HangThung, 57NguyenDu…).
const slug = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
const SLUG_KEYS = ["vi_tri", "ngon_ngu", "thanh_pho", "kenh", "loai", "khu_vuc", "nhu_cau", "dong_san_pham", "content_category"];
const normalize = (p: Params): Params => {
  const out: Params = { ...p };
  for (const k of SLUG_KEYS) if (typeof out[k] === "string") out[k] = slug(out[k] as string);
  return out;
};

// Vùng khách điền ở form sỉ là chữ tự do (có thể lẫn tên, địa chỉ): KHÔNG gửi nguyên văn, chỉ gửi nhóm khu vực.
const REGIONS: [string, RegExp][] = [
  ["ho_chi_minh", /\b(ho chi minh|hcm|tphcm|sai gon|saigon)\b/],
  ["ha_noi", /\b(ha noi|hanoi)\b/],
  ["da_nang", /\b(da nang|danang|hoi an)\b/],
  ["khanh_hoa", /\b(khanh hoa|nha trang|cam ranh)\b/],
  ["lam_dong", /\b(lam dong|da lat|dalat)\b/],
];
const regionBucket = (raw: string) => {
  const s = slug(raw).replace(/_/g, " ");
  return REGIONS.find(([, re]) => re.test(s))?.[0] ?? "khac";
};

function loadMetaPixel() {
  if (w.fbq) return;
  const fbq: any = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  w.fbq = fbq;
  if (!w._fbq) w._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  // Tắt "sự kiện tự động" của Pixel (tự đo nút bấm, tự khớp dữ liệu form) để không trùng với sự kiện của mình
  // và để không bao giờ gửi thông tin khách điền trong form.
  w.fbq("set", "autoConfig", false, META_PIXEL_ID);
  w.fbq("init", META_PIXEL_ID);
}

function loadGoogleAnalytics() {
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(s);
  w.gtag("js", new Date());
  w.gtag("config", GA4_ID, { send_page_view: false, ...(debug ? { debug_mode: true } : {}) });
  if (GADS_ID) w.gtag("config", GADS_ID);
}

// Ngôn ngữ khách đang xem (chỉ trang quán): vi / en / ko. Lấy theo ?lang, mặc định vi.
const langParam = (): string => {
  const q = new URLSearchParams(location.search).get("lang")?.toLowerCase();
  return q === "en" || q === "ko" ? q : "vi";
};
const isStorePage = () => Boolean(document.querySelector("[data-view-store]"));

/** Gửi một sự kiện về cả Meta Pixel và GA4. Sự kiện không có trong bảng sẽ bị bỏ qua. */
export function track(event: string, params: Params = {}, done?: () => void) {
  const spec = EVENTS[event];
  if (!spec) return done?.();
  const data = clean(normalize(params));
  // Trang quán: MỌI sự kiện đều kèm ngon_ngu (sự kiện bấm nút đã có theo khối chứa nút; còn lại lấy theo ?lang).
  if (!data.ngon_ngu && isStorePage()) data.ngon_ngu = langParam();
  if (debug) console.info("[tracking]", event, "→ Meta:", spec.meta, "| GA4:", spec.ga === false ? "(không)" : event, JSON.stringify(data), "| URL:", location.href);
  if (!active) return done?.();

  // `done` chạy đúng 1 lần: khi GA4 báo đã gửi xong, hoặc sau tối đa 350ms (phòng GA bị chặn).
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    done?.();
  };
  if (done) window.setTimeout(finish, 350);

  if (spec.ga !== false && w.gtag) {
    const ga: Params = { ...data };
    if (Array.isArray(ga.content_ids)) ga.content_ids = ga.content_ids.join(",");
    w.gtag("event", event, { ...ga, ...(debug ? { debug_mode: true } : {}), ...(done ? { event_callback: finish, event_timeout: 350 } : {}) });
  }
  // Google Ads: chuyển đổi cho hành động chính (chỉ khi đã đặt mã + nhãn).
  const label = GADS_ID ? GADS_LABELS[event] : undefined;
  if (label && w.gtag) {
    const conv: Params = { send_to: `${GADS_ID}/${label}` };
    if (event === "click_mua_ngay" && data.value) Object.assign(conv, { value: data.value, currency: "VND" });
    if (debug) console.info("[tracking] Google Ads conversion", JSON.stringify(conv));
    w.gtag("event", "conversion", conv);
  }
  if (w.fbq) w.fbq(spec.custom ? "trackCustom" : "track", spec.meta, data);
}

// ---- vị trí của nút (vi_tri) ----
// Ưu tiên: data-vi-tri của phần tử hoặc khối chứa nó (trang quán đặt ở từng khối) → chân trang → theo đường dẫn trang.
function viTriOf(el: HTMLElement): string {
  const own = el.closest<HTMLElement>("[data-vi-tri]")?.dataset.viTri;
  if (own) return own;
  if (el.closest("footer")) return "footer";
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return "trang_chu";
  if (path === "/san-pham") return "san_pham_danh_sach";
  if (path.startsWith("/san-pham/")) return "san_pham_chi_tiet";
  if (path === "/cua-hang") return "cua_hang_danh_sach";
  if (path === "/ngua-o") return "ngua_o";
  return slug(path.split("/")[1] ?? "");
}

const storeId = () => document.querySelector<HTMLElement>("[data-view-store]")?.dataset.chiNhanh;

// ---- tham số từ data-* của phần tử được bấm (vi_tri, page_path, chi_nhanh trang quán thêm ở bộ lắng nghe chung) ----
function paramsFromElement(event: string, el: HTMLElement): Params {
  const d = el.dataset;
  switch (event) {
    case "click_zalo":
      return { kenh: "zalo", loai: d.loai };
    case "click_mua_ngay":
      return {
        content_name: d.productName,
        content_ids: d.productId ? [d.productId] : undefined,
        content_category: d.category,
        value: d.price ? Number(d.price) : undefined,
        currency: "VND",
        content_type: "product",
        dong_san_pham: d.dongSanPham,
      };
    case "xem_chi_tiet_sp":
      return { content_ids: d.productId ? [d.productId] : undefined };
    case "click_chi_duong":
      return { chi_nhanh: d.chiNhanh };
    case "click_goi_chi_nhanh":
      return { chi_nhanh: d.chiNhanh, kenh: "phone" };
    case "click_goi_van_phong":
      return { kenh: "phone", loai: "van_phong" };
    case "click_lien_he_si":
      return { kenh: d.kenh, loai: "si" };
    case "loc_thanh_pho":
      return { thanh_pho: d.thanhPho };
    case "xem_menu":
      return { content_category: "menu", chi_nhanh: d.chiNhanh };
    case "xem_danh_gia":
      return { content_category: "danh_gia", chi_nhanh: d.chiNhanh };
    case "click_quan_khac":
      // chi_nhanh = quán đang xem, den_chi_nhanh = quán khách bấm sang.
      return { chi_nhanh: d.chiNhanh, den_chi_nhanh: d.denChiNhanh };
    default:
      return {};
  }
}

function init() {
  if (w.__giongTracking) return;
  w.__giongTracking = true;

  if (debug) console.info("[tracking] debug bật —", active ? "ĐANG gửi sự kiện" : "chưa gửi (tracking tắt)", { isProduction, META_PIXEL_ID, GA4_ID });

  if (active) {
    loadMetaPixel();
    loadGoogleAnalytics();
    // 1 lần xem trang = 1 PageView + 1 page_view (trang quán kèm ngon_ngu).
    const pageLang = isStorePage() ? { ngon_ngu: langParam() } : undefined;
    if (debug) console.info("[tracking] PageView / page_view", pageLang ? JSON.stringify(pageLang) : "", "→ URL:", location.href);
    if (pageLang) w.fbq("track", "PageView", pageLang);
    else w.fbq("track", "PageView");
    w.gtag("event", "page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      ...pageLang,
      ...(debug ? { debug_mode: true } : {}),
    });
  }

  // Bấm các nút có data-track (một bộ lắng nghe chung, không gắn tay từng nút).
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el?.dataset.track) return;
      const params = paramsFromElement(el.dataset.track, el);
      // Mọi sự kiện bấm đều có vi_tri + page_path; trên trang quán luôn có chi_nhanh của quán đó.
      const data: Params = {
        ...params,
        chi_nhanh: (params.chi_nhanh as string | undefined) ?? storeId(),
        vi_tri: viTriOf(el),
        page_path: location.pathname,
        // Theo khối chứa nút (vi / en / ko); nút ngoài mọi khối (Zalo nổi, chân trang...) lấy theo ?lang.
        ngon_ngu: isStorePage() ? el.closest<HTMLElement>("[data-ngon-ngu]")?.dataset.ngonNgu ?? langParam() : undefined,
      };

      // Link mở CÙNG TAB: trình duyệt có thể huỷ yêu cầu đo lường khi trang chuyển đi. Giữ lại chuyển trang
      // đến khi sự kiện đã gửi (tối đa 350ms) rồi mới đi tiếp. Link mở tab mới, tel:, mailto:, #… không bị ảnh hưởng.
      const link = el instanceof HTMLAnchorElement ? el : null;
      const me = e as MouseEvent;
      const sameTab =
        active &&
        link &&
        !e.defaultPrevented &&
        me.button === 0 &&
        !(me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) &&
        (!link.target || link.target === "_self") &&
        !link.hasAttribute("download") &&
        /^https?:$/.test(link.protocol) &&
        link.href.split("#")[0] !== location.href.split("#")[0];
      if (sameTab) {
        e.preventDefault();
        track(el.dataset.track, data, () => location.assign(link.href));
      } else {
        track(el.dataset.track, data);
      }
    },
    true
  );

  // Xem trang sản phẩm riêng.
  const item = document.querySelector<HTMLElement>("[data-view-item]");
  if (item) {
    const d = item.dataset;
    track("view_item", {
      content_name: d.productName,
      content_ids: d.productId ? [d.productId] : undefined,
      content_category: d.category,
      value: d.price ? Number(d.price) : undefined,
      currency: "VND",
      content_type: "product",
      dong_san_pham: d.dongSanPham,
    });
  }

  // Trang riêng của từng quán (/cua-hang/<quán>): đúng 1 xem_trang_quan, ngoài PageView.
  const store = document.querySelector<HTMLElement>("[data-view-store]");
  if (store) track("xem_trang_quan", { chi_nhanh: store.dataset.chiNhanh, content_category: "trang_quan" });

  // Trang Câu chuyện / Farm / Kiến thức (BaseLayout gắn data-page-category).
  const category = document.body.dataset.pageCategory;
  if (category) track("xem_trang_noi_dung", { content_category: category });

  // Gửi form sỉ THÀNH CÔNG (trang Ngựa Ô phát sự kiện này chỉ khi dịch vụ gửi mail báo thành công).
  window.addEventListener("giong:lead-success", (e) => {
    const detail = (e as CustomEvent<{ khu_vuc?: string; nhu_cau?: string }>).detail ?? {};
    track("generate_lead", { khu_vuc: regionBucket(detail.khu_vuc ?? ""), nhu_cau: detail.nhu_cau });
  });

  // Ở lại trang quá 30 giây (chỉ tính lúc tab đang hiện).
  let visibleSeconds = 0;
  let sent = false;
  window.setInterval(() => {
    if (document.visibilityState !== "visible" || sent) return;
    visibleSeconds += 1;
    if (visibleSeconds >= 30) {
      sent = true;
      track("xem_tren_30s", { page_path: location.pathname, chi_nhanh: storeId() });
    }
  }, 1000);
}

init();
