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
}

/** Gửi một sự kiện về cả Meta Pixel và GA4. Sự kiện không có trong bảng sẽ bị bỏ qua. */
export function track(event: string, params: Params = {}) {
  const spec = EVENTS[event];
  if (!spec) return;
  const data = clean(params);
  if (debug) console.info("[tracking]", event, "→ Meta:", spec.meta, "| GA4:", spec.ga === false ? "(không)" : event, JSON.stringify(data), "| URL:", location.href);
  if (!active) return;

  if (spec.ga !== false && w.gtag) {
    const ga: Params = { ...data };
    if (Array.isArray(ga.content_ids)) ga.content_ids = ga.content_ids.join(",");
    w.gtag("event", event, { ...ga, ...(debug ? { debug_mode: true } : {}) });
  }
  if (w.fbq) w.fbq(spec.custom ? "trackCustom" : "track", spec.meta, data);
}

// ---- tham số từ data-* của phần tử được bấm ----
function paramsFromElement(event: string, el: HTMLElement): Params {
  const d = el.dataset;
  const page_path = location.pathname;
  switch (event) {
    case "click_zalo":
      return {
        kenh: "zalo",
        loai: d.loai,
        vi_tri: d.viTri ?? "nut_noi",
        page_path,
        // Trang riêng của quán: gắn thêm chi_nhanh để biết khách nhắn Zalo từ quán nào.
        chi_nhanh: document.querySelector<HTMLElement>("[data-view-store]")?.dataset.chiNhanh,
      };
    case "click_mua_ngay":
      return {
        content_name: d.productName,
        content_ids: d.productId ? [d.productId] : undefined,
        content_category: d.category,
        value: d.price ? Number(d.price) : undefined,
        currency: "VND",
        content_type: "product",
        dong_san_pham: d.dongSanPham,
        // Chỉ có khi nút nằm trên trang quán (khối cà phê rang xay).
        chi_nhanh: d.chiNhanh,
        vi_tri: d.viTri,
      };
    case "xem_chi_tiet_sp":
      return { content_ids: d.productId ? [d.productId] : undefined, chi_nhanh: d.chiNhanh, vi_tri: d.viTri };
    case "click_chi_duong":
      return { chi_nhanh: d.chiNhanh, vi_tri: d.viTri };
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
    // 1 lần xem trang = 1 PageView + 1 page_view.
    if (debug) console.info("[tracking] PageView / page_view → URL:", location.href);
    w.fbq("track", "PageView");
    w.gtag("event", "page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      ...(debug ? { debug_mode: true } : {}),
    });
  }

  // Bấm các nút có data-track (một bộ lắng nghe chung, không gắn tay từng nút).
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el?.dataset.track) return;
      track(el.dataset.track, paramsFromElement(el.dataset.track, el));
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
    track("generate_lead", { khu_vuc: detail.khu_vuc, nhu_cau: detail.nhu_cau });
  });

  // Ở lại trang quá 30 giây (chỉ tính lúc tab đang hiện).
  let visibleSeconds = 0;
  let sent = false;
  window.setInterval(() => {
    if (document.visibilityState !== "visible" || sent) return;
    visibleSeconds += 1;
    if (visibleSeconds >= 30) {
      sent = true;
      track("xem_tren_30s", { page_path: location.pathname });
    }
  }, 1000);
}

init();
