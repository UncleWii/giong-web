# Ảnh trang từng quán

Mỗi quán một thư mục (đúng tên đường dẫn trang). Chép ảnh vào với **đúng tên file** là trang tự hiện, không cần sửa code.
Chưa có file nào thì trang hiện khung trống (nền xám, viền nét đứt) ghi sẵn tên file cần chép.

| File | Kích thước gợi ý | Vị trí trên trang |
|---|---|---|
| `hero.webp` | 1600×1000 | Ảnh quán lớn (khối B) |
| `mon-1.webp` … `mon-4.webp` | 800×800 | 4 thẻ món đặc trưng — **dùng chung mọi quán**, nằm ở thư mục `_chung/` (quán nào có file riêng trong thư mục của mình thì dùng file riêng) |
| `khong-gian-1.webp` … `khong-gian-6.webp` | 1200×900 | Lưới "Không gian quán" |

Thư mục: `ha-noi-hang-thung`, `sai-gon-nguyen-du`, `sai-gon-diamond-plaza`, `hoi-an-nguyen-thai-hoc`, `nha-trang-tran-hung-dao`.

Cũng nhận đuôi `.jpg` / `.png`. Nên xuất webp, mỗi ảnh dưới ~250KB.
Quán đã có ít nhất 1 ảnh `khong-gian-N` thì lưới chỉ hiện các ô có ảnh; chưa có ảnh nào thì hiện đủ 6 khung trống.
Chữ: món đặc trưng (chung mọi quán) ở khóa `dishes` đầu `src/content/cua-hang.json`; câu vị trí và câu tiếng Anh điền theo từng quán trong file đó.
Ảnh gói cà phê nền trắng (khối "Cà phê rang xay nguyên chất"): `src/assets/products/nen-trang/<slug>-nen-trang.webp`.
