import type { ImageSlug } from "./images";

export interface BestSellerSlide {
  id: string;
  name: string;
  kind: string;
  desc: string;
  specs: string[];
  /** Mặt trước của gói (cắt sát mép, nền trong suốt). */
  front: ImageSlug;
  /** Mặt hông của gói (cắt sát mép, nền trong suốt) — dùng chung cho các gói. */
  side: ImageSlug;
  bg: string;
  blob: string;
  ink: string;
  href: string;
  cta: string;
}

export const bestSellerSlides: BestSellerSlide[] = [
  {
    id: "giong-gia",
    name: "GIÓNG GIẢ",
    kind: "House Blend · Robusta",
    desc: "Robusta blend từ vùng Tây Nguyên, rang vừa – đậm, sơ chế tự nhiên. Đậm đà, êm và đầy đặn với vị sô-cô-la.",
    specs: ["250 gram / túi", "Độ cao 800–1400m", "Sơ chế: Tự nhiên", "Vị: Sô-cô-la"],
    front: "bag-front-giong-gia",
    side: "bag-side",
    bg: "#f6ecc6",
    blob: "#e3c44f",
    ink: "#3a2b05",
    href: "/san-pham",
    cta: "Xem sản phẩm",
  },
  {
    id: "nang-can",
    name: "NĂNG CÁN",
    kind: "House Blend · Arabica",
    desc: "Arabica blend từ vùng Tây Nguyên, rang vừa – đậm, sơ chế tự nhiên. Nhẹ nhàng vị trái cây và caramel.",
    specs: ["250 gram / túi", "Độ cao 1400m", "Sơ chế: Tự nhiên", "Vị: Trái cây, caramel"],
    front: "bag-front-nang-can",
    side: "bag-side",
    bg: "#d9ece6",
    blob: "#7fb6a8",
    ink: "#12352e",
    href: "/san-pham",
    cta: "Xem sản phẩm",
  },
];
