// Central image registry. Content JSON files reference images by these slugs
// so editors can swap a photo later without touching page content.
// To replace a photo: drop the new file in src/assets/images (or badges),
// update the import path below — the slug used in content JSON stays the same.

import giong236 from "../assets/images/Gióng-236.jpg";
import giong197 from "../assets/images/Gióng-197.jpg";
import giong186 from "../assets/images/Gióng-186.jpg";
import giong150 from "../assets/images/Gióng-150.jpg";
import giong142 from "../assets/images/Gióng-142.jpg";
import giongfarm9 from "../assets/images/Giongfarm-9.jpg";
import giong238 from "../assets/images/Gióng-238.jpg";
import homeXuongRang from "../assets/images/Home-Xuong-Rang.jpg";
import homeIntroThuyen from "../assets/images/Home-intro-thuyen-goc.webp";
import homeIntroMobile from "../assets/images/Hinhdauweb.jpg";
import homeArtPhaCaPhe from "../assets/images/Home-artphacaphe.png";
import homeGiongGiaRobusta from "../assets/images/home-gionggiarobusta.jpg";
import dilinhNgay189 from "../assets/images/dilinhngay1-89.jpg";
import dilinhNgay138 from "../assets/images/dilinhngay1-38.jpg";
import dilinhNgay1_3 from "../assets/images/dilinh ngay 1-3.png";
import dilinhNgay2_10 from "../assets/images/dilinhngay2-10.jpg";
import dilinhNgay1118 from "../assets/images/dilinhngay1-118.jpg";
import dilinhNgay14 from "../assets/images/dilinhngay1-4.jpg";
import giongfarm217 from "../assets/images/Giongfarm-217.jpg";
import giongfarm231 from "../assets/images/Giongfarm-231 (1).jpg";
import giongfarm127 from "../assets/images/Giongfarm-127.jpg";
import productGiongGia from "../assets/images/7-GiongGia.png";
import productNangCan from "../assets/images/8-NangCan.png";
import bagFrontNangCan from "../assets/images/NangCan-front.webp";
import bagFrontGiongGia from "../assets/images/GiongGia-front.webp";
import bagSideCrop from "../assets/images/Bag-side-crop.webp";
import productNguaO from "../assets/images/NguaO-5.png";
import productNguaOTuiSi from "../assets/images/NguaO-tui-si-1kg-cutout.png";
import khungBestSeller from "../assets/images/khung 1.png";
import khungFarmToCup from "../assets/images/khung 2.png";
import giongFarm from "../assets/images/giong-farm.jpg";
import giongHoiAn from "../assets/images/Giong-hoian.jpg";
import giongNhaTrang from "../assets/images/giong-nhatrang.jpg";
import giong57 from "../assets/images/giong-57.jpg";
import caPheSiVanPhong from "../assets/images/Giong-caphesivanphong.png";
import caPheSi from "../assets/images/Giong-caphesi.png";
import caPheSi2 from "../assets/images/Giong-caphesi2.jpg";
import thienLyCamCo from "../assets/images/ThienLy-CamCo-trim.png";
import thienLyCaPhe from "../assets/images/Giong-caphe-ThienLy.jpg";

import coffeeWheel from "../assets/images/Giong-cafe-coffee-wheel.png";
import arabicaVsRobusta from "../assets/images/Giong-cafe-arabica-vs-robusta-web.png";
import badgeClassic from "../assets/badges/Classic Single Origin.png";
import badgeRobusta from "../assets/badges/Robusta Single Origin.png";
import badgeArabica from "../assets/badges/Arabica Symphony.png";
import badgeFda from "../assets/images/FDA.png";
import badgeIso from "../assets/badges/ISO.png";

import logo from "../assets/brand/logo-192.png";

export const images = {
  "giong-236": giong236,
  "giong-197": giong197,
  "giong-186": giong186,
  "giong-150": giong150,
  "giong-142": giong142,
  "giongfarm-9": giongfarm9,
  "giong-238": giong238,
  "home-xuong-rang": homeXuongRang,
  "home-art-pha-ca-phe": homeArtPhaCaPhe,
  "home-intro-thuyen": homeIntroThuyen,
  "home-intro-mobile": homeIntroMobile,
  "home-giong-gia-robusta": homeGiongGiaRobusta,
  "dilinh-ngay1-89": dilinhNgay189,
  "dilinh-ngay1-38": dilinhNgay138,
  "dilinh-ngay1-3": dilinhNgay1_3,
  "dilinh-ngay2-10": dilinhNgay2_10,
  "dilinh-ngay1-118": dilinhNgay1118,
  "dilinh-ngay1-4": dilinhNgay14,
  "giongfarm-217": giongfarm217,
  "giongfarm-231": giongfarm231,
  "giongfarm-127": giongfarm127,
  "product-giong-gia": productGiongGia,
  "product-nang-can": productNangCan,
  "bag-front-nang-can": bagFrontNangCan,
  "bag-front-giong-gia": bagFrontGiongGia,
  "bag-side": bagSideCrop,
  "product-ngua-o": productNguaO,
  "product-ngua-o-tui-si": productNguaOTuiSi,
  "khung-best-seller": khungBestSeller,
  "khung-farm-to-cup": khungFarmToCup,
  "giong-farm": giongFarm,
  "giong-hoian": giongHoiAn,
  "giong-nhatrang": giongNhaTrang,
  "giong-57": giong57,
  "giong-caphesi-vanphong": caPheSiVanPhong,
  "giong-caphesi": caPheSi,
  "giong-caphesi-2": caPheSi2,
  "thienly-camco": thienLyCamCo,
  "thienly-caphe": thienLyCaPhe,
  "coffee-wheel": coffeeWheel,
  "arabica-vs-robusta": arabicaVsRobusta,
  "badge-classic": badgeClassic,
  "badge-robusta": badgeRobusta,
  "badge-arabica": badgeArabica,
  "badge-fda": badgeFda,
  "badge-iso": badgeIso,
  logo,
} as const;

export type ImageSlug = keyof typeof images;
