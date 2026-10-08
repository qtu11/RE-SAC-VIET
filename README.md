# RE-SAC-VIET - RE:SẮC STUDIO

Hệ thống số hóa trang phục truyền thống Việt Nam và không gian thử đồ di sản (Next.js 16.4.0 App Router, React 19, TypeScript). Giao diện tủ đồ mang phong vị sắc giấy, đỏ son và xanh Việt; kết hợp cơ chế minh họa chuyển động 2.5D và không gian 3D thử nghiệm.

## Chạy dự án

Yêu cầu Node.js từ 22.18.

```powershell
cd 'D:\RESắc STUDIO'
npm ci
npm run dev
```

Bản phát triển: http://127.0.0.1:3000.

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run start
```

Bản production: http://127.0.0.1:4173. `npm run preview` là alias của `npm run start`. Đây là máy chủ cục bộ.

Dự án dùng App Router, không dùng Vite. Đầu ra Next.js nằm trong `.next/`; bản build Vite cũ được giữ tại `.legacy-vite-dist/` và không được phục vụ. Hosting cần hỗ trợ Next.js/Node.js; không tải `.next/` lên hosting chỉ hỗ trợ HTML tĩnh.

## Cấu trúc source

- `src/app/`: server layout/page, metadata, global CSS, trang lỗi và 404.
- `src/app/vietnam.css`: diện mạo tủ đồ Việt và các bố cục đáp ứng.
- `src/app/api/catalog/route.ts`: API GET catalog và thông tin khả năng của trình xem.
- `src/features/studio/`: lựa chọn bản phối, kiểm tra dữ liệu, thư viện trang phục.
- `src/features/studio/components/HeritageHome.tsx`: trang chủ, tủ đồ, bản phối trực tiếp và tiến độ từ những bộ thực sự đã lưu.
- `src/features/studio/components/GarmentProvenance.tsx`: bối cảnh và nguồn tư liệu cho các mẫu bình dân.
- `src/features/studio/components/OutfitComparison.tsx`: đối chiếu hai bản phối đã lưu.
- `src/features/studio/components/CharacterStage.tsx`: minh họa theo mẫu có chuyển động 2.5D; mặc định.
- `src/features/studio/reference.ts` và `segmentation.ts`: góc ảnh có thật, màu minh họa và loại mảnh ảnh/chữ ngoài nhân vật.
- `src/features/studio/components/ExperimentalStage.tsx` và `three/`: mô hình 3D dựng bằng hình học, chỉ ở chế độ thử nghiệm.
- `src/components/`: thành phần giao diện dùng chung.
- `public/`: ảnh và font được phục vụ từ dự án.
- `tests/`: kiểm tra dữ liệu, bản phối, renderer và vùng cắt catalog.

Client Components xử lý tương tác và bộ nhớ trình duyệt; các khung đồ họa dùng `next/dynamic` với `ssr: false`. Trang được prerender với dữ liệu mặc định ổn định trước khi phục hồi lựa chọn đã lưu, tránh lỗi hydration và ghi đè dữ liệu cũ.

## Các thao tác đã triển khai

Tìm tên trang phục có/không dấu, lọc giới tính và danh mục, 24 mục trang phục, 5 bước phối đồ, đổi bảng màu, chọn dịp/phụ kiện/phong cách. Trang chủ ưu tiên nhóm Bình dân. Bản phối ở trang chủ và trong trình phối dùng cùng trạng thái. Chọn trang phục mới chọn luôn bảng màu gốc tương ứng. Với mẫu bình dân, lựa chọn bắt đầu bằng phong cách Cổ điển, khăn và giày; người dùng có thể tiếp tục thay đổi bản phối.

Lưu bản phối với ảnh tương ứng trang phục/màu/góc đã chọn, mở lại, chống lưu trùng, yêu thích look, tạo liên kết `?look=...`, xuất thông tin JSON. Chọn hai bản đã lưu để so sánh ảnh, màu, dịp mặc, phụ kiện và phong cách. Tiến độ tủ đồ tính từ dữ liệu lưu thực tế. Hồ sơ bằng tên, bộ sưu tập, yêu thích và giao diện được lưu bằng `localStorage` trên trình duyệt hiện tại. Nút Hồ sơ không phải xác thực tài khoản máy chủ. Chưa có OAuth, đồng bộ đa thiết bị hoặc đăng bài cộng đồng.

## Các mẫu bình dân mới

| Mã | Trang phục | Ảnh gốc |
|---|---|---|
| BD01 | Ngũ thân nâu · Nam | `asset/Nam/BD01.png` |
| BD02 | Ngũ thân đen · Nữ | `asset/Nữ/BD02.png` |
| BD03 | Ngũ thân chàm · Nam | `asset/Nam/BD03.png` |
| BD04 | Tứ thân nâu · Nữ | `asset/Nữ/BD04.png` |

Ảnh toàn thân có nền trong suốt, mặc định dùng phom và màu gốc. Mỗi mẫu có vùng miền, thời kỳ, ghi chú phom áo và liên kết tư liệu Huế trong trình phối/kết quả. Phom tham khảo tư liệu, còn màu vải và chi tiết tạo hình là minh họa sáng tạo. Tứ thân được phân biệt là trang phục dân gian Bắc Bộ tồn tại trong thời Nguyễn.

Đổi ảnh trong `asset`, rồi chạy `npm run catalog:sync`. Các lệnh dev/build tự thực hiện bước này. Website dùng bản sao ở `public/catalog/BinhDan`.

## Nhân vật và giới hạn hiện tại

Người dùng xác nhận chỉ có ảnh, chưa có file mesh/rig 3D của nhân vật mẫu.

**Minh họa theo mẫu (mặc định):** dùng bốn mẫu bình dân mới và các ảnh catalog, chuyển động thở/tà áo, nghiêng ảnh có giới hạn, phóng to/thu nhỏ, tạm dừng, đối chiếu màu gốc và chụp PNG. Mẫu cung đình có các nút trước/nghiêng/sau lấy từ ảnh thật trong catalog. Đây là 2.5D từ ảnh, không phải xoay 360° một nhân vật 3D. Tô màu là xử lý pixel minh họa, không mô phỏng vật liệu. Những phụ kiện đã nằm sẵn trong ảnh không thể tháo rời; lựa chọn phụ kiện được lưu trong bản phối.

**3D thử nghiệm:** có mesh, điều khiển xoay 360°, zoom, đứng/chào/bước, nháy mắt và các phụ kiện gắn vào thân/đầu/tay/chân. Màu, phụ kiện và phong cách cập nhật geometry/material thực. Tạo hình này chưa giống ảnh mẫu và không được coi là mô hình hoàn thiện.

Để hoàn thành nhân vật 3D đúng tạo hình và thay đồ thật, còn phải dựng/sửa mesh, texture, rig và từng trang phục/phụ kiện từ ảnh tham chiếu; các file đó chưa có trong dự án. Chưa có AR hoặc mô phỏng vải.

Vùng cắt ảnh theo từng bố cục, kết hợp giữ vùng nhân vật liên thông để tránh lấy chữ và các mảnh của góc bên cạnh. `asset/` và `list đồ.md` được giữ nguyên. P02 và P06 có tên/nội dung ảnh khác tài liệu catalog; giao diện dùng tên trong ảnh và ghi rõ khác biệt ở phần mô tả, không gắn concept thời Lý thành trang phục Nguyễn.

Nguồn ảnh, font và prompt của các minh họa tạo bằng công cụ imagegen: [docs/visual-assets.md](docs/visual-assets.md). Báo cáo xác minh và các giới hạn: [docs/verification.md](docs/verification.md).
