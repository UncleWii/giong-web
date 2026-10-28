import type { ImageSlug } from "./images";
import { getProduct, productUrl } from "./products";

const specsOf = (slug: string) => {
  const p = getProduct(slug);
  return ["250 gram / túi", `Độ cao ${p.altitude}`, "Sơ chế: Tự nhiên", `Vị: ${p.notes.join(", ")}`];
};

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
    specs: specsOf("giong-gia"),
    front: "bag-front-giong-gia",
    side: "bag-side",
    bg: "#f6ecc6",
    blob: "#e3c44f",
    ink: "#3a2b05",
    href: productUrl("giong-gia"),
    cta: "Xem Gióng Giả",
  },
  {
    id: "nang-can",
    name: "NĂNG CÁN",
    kind: "House Blend · Arabica",
    desc: "Arabica blend từ vùng Tây Nguyên, rang vừa – đậm, sơ chế tự nhiên. Nhẹ nhàng vị trái cây và caramel.",
    specs: specsOf("nang-can"),
    front: "bag-front-nang-can",
    side: "bag-side",
    bg: "#d9ece6",
    blob: "#7fb6a8",
    ink: "#12352e",
    href: productUrl("nang-can"),
    cta: "Xem Năng Cán",
  },
];
