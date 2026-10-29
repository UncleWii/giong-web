// Dữ liệu quán dùng chung cho /cua-hang (danh sách) và /cua-hang/[slug] (trang riêng từng quán).
// Nội dung gốc nằm ở src/content/cua-hang.json.

import type { ImageMetadata } from "astro";
import data from "../content/cua-hang.json";

type RawStore = (typeof data.stores)[number];
export interface Store extends RawStore {
  /** Ưu đãi cho khách từ Google. Xoá trường này (hoặc đặt null) để ẩn cả khối. */
  offer?: { title: string; description: string; code: string } | null;
  /** Bản đồ nhúng chính thức (chỉ phần src của iframe). */
  embedUrl?: string;
}
export const stores = data.stores as Store[];

const storeFiles = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/Giong-caphe-cuahang-*.{jpg,png}",
  { eager: true }
);

export const storeImage = (file: string): ImageMetadata => storeFiles[`../assets/images/${file}`].default;

/** Link Google Maps của quán (dùng cho "Chỉ đường" và "Xem đánh giá trên Google"). */
export const mapsUrl = (s: Pick<Store, "address" | "mapUrl">) =>
  s.mapUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Gióng Cà phê, " + s.address)}`;

/**
 * Bản đồ nhúng. Mặc định ghim đúng toạ độ của quán. Muốn dùng mã nhúng chính thức của Google
 * (Google Maps → Chia sẻ → Nhúng bản đồ), thêm "embedUrl" (chỉ phần src của iframe) vào quán trong cua-hang.json.
 */
export const embedUrl = (s: Store) =>
  s.embedUrl || `https://www.google.com/maps?q=${s.lat},${s.lng}&z=17&hl=vi&output=embed`;

export const storePath = (s: Pick<Store, "slug">) => `/cua-hang/${s.slug}`;

export const hotlineOf = (s: Store) => s.hotline || data.hotlineFallback;
export const telHref = (s: Store) => `tel:${hotlineOf(s).replace(/[^+\d]/g, "")}`;

export const amenityLabel = (id: string) => data.amenities.find((a) => a.id === id)?.label ?? id;

const photoFiles = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/cua-hang/*/*.{webp,jpg,jpeg,png}",
  { eager: true }
);

/** Ảnh riêng của quán: src/assets/cua-hang/<slug>/<tên>.webp (hoặc jpg/png). Chưa có file → undefined. */
export const storePhoto = (slug: string, name: string): ImageMetadata | undefined => {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    const f = photoFiles[`../assets/cua-hang/${slug}/${name}.${ext}`];
    if (f) return f.default;
  }
};
