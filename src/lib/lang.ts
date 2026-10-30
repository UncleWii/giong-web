// Ngôn ngữ của web: vi (mặc định) / en / ko. Hiện chỉ trang quán Nha Trang có đủ 3 bản.
export type Lang = "vi" | "en" | "ko";
export type Alternates = Partial<Record<Lang, string>>;

export const LANGS: Lang[] = ["vi", "en", "ko"];

/** Đường dẫn các bản ngôn ngữ của từng quán (khoá = slug trang tiếng Việt). Quán chưa có thì không có mục. */
export const storeLangPaths: Record<string, Record<Lang, string>> = {
  "nha-trang-tran-hung-dao": {
    vi: "/cua-hang/nha-trang-tran-hung-dao/",
    en: "/en/cua-hang/nha-trang/",
    ko: "/ko/cua-hang/nha-trang/",
  },
};
