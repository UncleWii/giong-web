// Nguồn dữ liệu sản phẩm DUY NHẤT của web Gióng.
// Danh sách /san-pham, trang riêng /san-pham/[slug], khối Best Seller ở trang chủ, các thẻ gợi ý
// (Thiên Lý, Câu chuyện, Kiến thức…) và các nút "Mua trên Shopee" đều đọc từ file này.
// Sửa giá / link Shopee / hương vị ở đây là đủ.

import type { ImageMetadata } from "astro";

const productFiles = import.meta.glob<{ default: ImageMetadata }>("../assets/products/*.png", {
  eager: true,
});
const productImage = (slug: string) => productFiles[`../assets/products/${slug}.png`].default;

export type ProductSeries = "classic" | "robusta" | "arabica" | "blend" | "hoa-tan";
export type ProductCategory = "ca_phe_hat_bot" | "ca_phe_hoa_tan";

export interface Product {
  /** Dùng làm đường dẫn: /san-pham/<slug> và làm data-product-id. */
  slug: string;
  name: string;
  series: ProductSeries;
  seriesTitle: string;
  category: ProductCategory;
  story: string;
  /** Hạt / thành phần, đúng như đang hiển thị trên thẻ sản phẩm. */
  bean: string;
  /** Vùng trồng. */
  origin?: string;
  /** Độ cao vùng trồng, ghi đúng như trên nhãn gói. */
  altitude?: string;
  /** Các nốt hương vị, từng nốt một (để gắn biểu tượng). */
  notes: string[];
  /** Giá đã gồm VAT, đơn vị đồng. */
  price: number;
  shopeeUrl: string;
  image: ImageMetadata;
  /** Bộ lọc ở trang /san-pham. */
  filters: string[];
  /** Gói hạt/bột có nhãn ISO 22000 & FDA. */
  certified: boolean;
  /** Sản phẩm hữu cơ — hiện tem Vietnam Certified Organic (VCO). */
  organic: boolean;
}

const seriesTitle: Record<ProductSeries, string> = {
  classic: "Classic Series",
  robusta: "Robusta Series",
  arabica: "Arabica Series",
  blend: "Blend Series",
  "hoa-tan": "Cà phê hòa tan",
};

const make = (
  p: Omit<Product, "seriesTitle" | "image" | "category" | "certified" | "organic"> & { certified?: boolean; organic?: boolean }
): Product => ({
  ...p,
  seriesTitle: seriesTitle[p.series],
  category: p.series === "hoa-tan" ? "ca_phe_hoa_tan" : "ca_phe_hat_bot",
  certified: p.certified ?? p.series !== "hoa-tan",
  organic: p.organic ?? false,
  image: productImage(p.slug),
});

export const products: Product[] = [
  make({
    slug: "giong-gia",
    name: "Gióng Giả",
    series: "classic",
    story: "Khí chất kiên cường, vững chãi; cấu trúc mạnh mẽ, hậu vị sâu và đầy đặn.",
    bean: "Robusta blend từ vùng Tây Nguyên",
    origin: "Tây Nguyên",
    altitude: "800m",
    notes: ["Sô-cô-la"],
    price: 195000,
    shopeeUrl: "https://s.shopee.vn/8V9BQGCf7D",
    filters: ["robusta"],
  }),
  make({
    slug: "nang-can",
    name: "Năng Cán",
    series: "classic",
    story: "Biểu tượng của sự chăm chỉ, cần cù; mộc mạc, đậm đà năng lượng khởi đầu ngày mới.",
    bean: "Arabica blend từ vùng Tây Nguyên",
    origin: "Tây Nguyên",
    altitude: "1400m",
    notes: ["Trái cây", "caramel"],
    price: 225000,
    shopeeUrl: "https://s.shopee.vn/3VkVT6lwCk",
    filters: ["arabica"],
  }),
  make({
    slug: "thien-ly",
    name: "Thiên Lý",
    series: "classic",
    story: "Bền bỉ, dẻo dai; hài hòa, thanh thoát, kết nối mọi khoảng cách.",
    bean: "Arabica blend từ vùng Tây Nguyên",
    origin: "Tây Nguyên",
    altitude: "1400m",
    notes: ["Chanh", "chanh dây", "bạc hà"],
    price: 265000,
    shopeeUrl: "https://s.shopee.vn/1qcHU48n3G",
    filters: ["arabica"],
  }),
  make({
    slug: "thien",
    name: "Thiên",
    series: "robusta",
    story: "Đón trọn nắng gió cao nguyên; đậm vị, hậu ngọt dịu, cân bằng tự nhiên.",
    bean: "Robusta – Kontum",
    origin: "Kon Tum",
    altitude: "800m",
    notes: ["Cacao", "sữa dừa"],
    price: 280000,
    shopeeUrl: "https://s.shopee.vn/5fp038LlxD",
    filters: ["robusta"],
  }),
  make({
    slug: "dia",
    name: "Địa",
    series: "robusta",
    story: "Đất đỏ bazan, canh tác thuận tự nhiên; thân dày, thanh mát, hậu vị sâu lắng.",
    bean: "Robusta – Đắk Nông",
    origin: "Đắk Nông",
    altitude: "880m",
    notes: ["Trái cam", "trái tắc"],
    price: 280000,
    shopeeUrl: "https://s.shopee.vn/4Vd2f0KW64",
    filters: ["robusta"],
  }),
  make({
    slug: "nhan",
    name: "Nhân",
    series: "robusta",
    story: "Bàn tay tận tâm cùng hạt nhân xanh chọn lọc; êm mượt, tròn vị.",
    bean: "Robusta – Di Linh",
    origin: "Di Linh",
    altitude: "900m",
    notes: ["Mật mía", "đào"],
    price: 315000,
    shopeeUrl: "https://s.shopee.vn/9fL8oVsC5Y",
    filters: ["robusta", "organic"],
    organic: true,
  }),
  make({
    slug: "ho",
    name: "Hò",
    series: "arabica",
    story: "Lời ca mở màn trong trẻo; chua dịu, hương thơm tinh khiết, sảng khoái.",
    bean: "Arabica – Măng Đen",
    origin: "Măng Đen",
    altitude: "1200m",
    notes: ["Quế", "cam thảo"],
    price: 300000,
    shopeeUrl: "https://s.shopee.vn/9V2HKFRkRZ",
    filters: ["arabica"],
  }),
  make({
    slug: "cheo",
    name: "Chèo",
    series: "arabica",
    story: "Dung dị, lắng đọng dư vị; chua thanh tao, mơ rừng thoảng nhẹ.",
    bean: "Arabica – Điện Biên",
    origin: "Điện Biên",
    altitude: "1200m",
    notes: ["Hạt điều", "mơ rừng"],
    price: 300000,
    shopeeUrl: "https://s.shopee.vn/1VzR5YhWLB",
    filters: ["arabica"],
  }),
  make({
    slug: "tuong",
    name: "Tuồng",
    series: "arabica",
    story: "Cao trào bùng nổ, đậm kịch tính; hương mít độc bản, nho chín mọng.",
    bean: "Arabica – Cầu Đất",
    origin: "Cầu Đất",
    altitude: "1500m",
    notes: ["Trái nho", "trái mít"],
    price: 300000,
    shopeeUrl: "https://s.shopee.vn/AKapboA6jI",
    filters: ["arabica"],
  }),
  make({
    slug: "quyet-tien",
    name: "Quyết Tiến",
    series: "blend",
    story: "Mừng 50 năm thống nhất đất nước; biểu tượng của một Việt Nam thống nhất.",
    bean: "Blend Robusta Di Linh & Arabica Cầu Đất",
    origin: "Di Linh & Cầu Đất",
    altitude: "900m & 1400m",
    notes: ["Mít", "cam"],
    price: 295000,
    shopeeUrl: "https://s.shopee.vn/3B7f4ekCMm",
    filters: ["blend"],
  }),
  make({
    slug: "hoa-tan-3in1",
    name: "Cà phê hòa tan 3in1",
    series: "hoa-tan",
    story: "Nhanh - nhưng không vội, tiện - nhưng không tạm. Trọn vẹn hương vị đậm đà trong 1 phút 30 giây.",
    bean: "",
    notes: [],
    price: 85000,
    shopeeUrl: "https://s.shopee.vn/7KxE2L7ONt",
    filters: [],
  }),
];

export const getProduct = (slug: string): Product => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`Không có sản phẩm "${slug}" trong src/lib/products.ts`);
  return p;
};

export const productUrl = (p: Product | string) => `/san-pham/${typeof p === "string" ? p : p.slug}`;

/** Giá trị tham số đo lường dong_san_pham: classic / robusta / arabica / blend / hoa_tan. */
export const dongSanPham = (p: Product) => p.series.replace("-", "_");

/** 195000 → "195.000đ" */
export const formatPrice = (vnd: number) => `${new Intl.NumberFormat("vi-VN").format(vnd)}đ`;

/** Biểu tượng cho từng nốt hương vị (emoji, dễ nhận ra trên mọi thiết bị). */
const NOTE_ICONS: [RegExp, string][] = [
  [/sô-cô-la|cacao|chocolate/i, "🍫"],
  [/caramel|mật mía/i, "🍯"],
  [/chanh dây/i, "🥭"],
  [/chanh/i, "🍋"],
  [/cam thảo|bạc hà/i, "🌿"],
  [/quế/i, "🪵"],
  [/cam|tắc|quýt/i, "🍊"],
  [/nho/i, "🍇"],
  [/đào|mơ/i, "🍑"],
  [/mít/i, "🍈"],
  [/sữa dừa|dừa/i, "🥥"],
  [/hạt điều|hạt/i, "🥜"],
  [/trái cây/i, "🍓"],
];
export const noteIcon = (note: string): string => NOTE_ICONS.find(([re]) => re.test(note))?.[1] ?? "☕";
