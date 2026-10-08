# Ảnh trang phục RE:SẮC STUDIO

Bốn mẫu bình dân mới được tạo ngày 08/10/2026. Mở trực tiếp các file trong thư mục Nam và Nữ:

| Mã | Tên mẫu | Ảnh gốc | Ảnh website dùng |
|---|---|---|---|
| BD01 | Ngũ thân nâu · Nam | [Nam/BD01.png](Nam/BD01.png) | `/catalog/BinhDan/BD01.png` |
| BD02 | Ngũ thân đen · Nữ | [Nữ/BD02.png](Nữ/BD02.png) | `/catalog/BinhDan/BD02.png` |
| BD03 | Ngũ thân chàm · Nam | [Nam/BD03.png](Nam/BD03.png) | `/catalog/BinhDan/BD03.png` |
| BD04 | Tứ thân nâu · Nữ | [Nữ/BD04.png](Nữ/BD04.png) | `/catalog/BinhDan/BD04.png` |

Ảnh PNG toàn thân 1024×1536, có alpha trong suốt. Đây là minh họa chibi tham khảo phom áo qua tư liệu, chưa phải phục dựng khảo chứng. Mỗi mẫu có một góc ảnh; không có mesh 3D đi kèm.

Chạy `npm run catalog:sync` sau khi thay ảnh gốc. `npm run dev` và `npm run build` cũng tự đồng bộ bốn ảnh này sang `public/catalog/BinhDan`.

Tên, loại áo, màu mặc định và nguồn tư liệu nằm trong `src/features/studio/data.ts` và `wardrobe.ts`. Chi tiết tạo ảnh: [docs/visual-assets.md](../docs/visual-assets.md).
