# Kiểm tra RE:SẮC STUDIO — Next.js

Ngày: 08/10/2026. Bản hiện tại dùng Next.js 16.4.0 App Router. Báo cáo Vite trước khi chuyển đổi được giữ riêng trong `verification-vite-legacy.md`; những kết quả cũ không phải bằng chứng kiểm tra toàn bộ bản Next.js.

## Kiểm tra source/build

- `npm test`: 21/21 đạt.
- `npm run lint`: đạt với ESLint và cấu hình Next.js.
- `npm run typecheck`: đạt.
- `npm run build`: đạt; prerender `/` và trang 404, API động `/api/catalog`.
- Production `npm run start` chạy tại `http://127.0.0.1:4173`; bản phát triển tại `http://127.0.0.1:3000`.
- HTTP production: `/` trả 200 và có nội dung thương hiệu trong HTML server; `/api/catalog` trả 20 trang phục, 4 góc của M03 và `matching3dAsset: null`; URL không tồn tại trả 404.

Các kiểm thử bao gồm dữ liệu chia sẻ/bộ nhớ lỗi, tìm kiếm tiếng Việt, chống lưu trùng, ID và ảnh catalog, các wardrobe/mesh/phụ kiện/animation của chế độ 3D thử nghiệm, góc ảnh có thật, bảo vệ mặt/tóc/lót/hoa văn khi tô màu, giới hạn nghiêng ảnh, xử lý vùng nền và loại các mảnh/chữ ngoài nhân vật.

## Kiểm tra giao diện hiện tại

- Khung mặc định hiển thị minh họa Hắc Phong; chế độ 3D được ghi rõ là thử nghiệm và chưa giống ảnh mẫu.
- Chọn mẫu P05, đổi Lam – Vàng và xem mặt sau: tên, bảng màu, góc ảnh và bản xem trước cùng cập nhật.
- Chế độ 3D thử nghiệm: xoay thêm 30 độ, chọn động tác chào, thêm túi xách và bỏ quạt; trạng thái khung nhân vật cập nhật cùng lựa chọn. Kiểm thử mesh xác minh các nhóm phụ kiện xuất hiện/mất và gắn vào khớp đúng.
- Lỗi người dùng báo ở M03/nghiêng phải được tái hiện: vùng cắt cũ lấy caption và mảnh góc bên cạnh. Đã chỉnh riêng tọa độ M03, bổ sung xử lý vùng nhân vật liên thông và xác nhận bằng ảnh chụp: không còn caption hoặc mảnh rời.
- Đã kiểm tra bố cục trình phối ở viewport mặc định và 390×844, 320×568: không tràn ngang; nút Tiếp theo nằm trong màn hình; vùng chọn trang phục có thể cuộn. Khung xem trên màn hình thấp rút gọn thông tin để dành diện tích cho nhân vật.

Ảnh xác minh mới: [M03/nghiêng phải đã sửa](screenshots/catalog-crop-fixed.jpg). Các ảnh `desktop.jpg`, `mobile.jpg`, `mobile-builder.jpg` là ảnh bản Vite trước đó, không dùng để chứng minh giao diện Next.js hiện tại.

## Giới hạn chưa hoàn thành

Minh họa mặc định là chuyển động 2.5D từ ảnh. Mẫu cung đình đổi giữa ảnh trước/nghiêng/sau có sẵn; không dựng mặt khuất của một mesh. Palette là tô màu minh họa. Phụ kiện có sẵn trong ảnh không thể tháo rời; các lựa chọn phụ kiện được lưu, và có thể xem thử gắn/tháo ở chế độ 3D.

Mô hình 3D thử nghiệm có geometry, animation và tương tác thật nhưng tạo hình chưa giống mẫu. Chưa có file 3D/rig/texture đúng nhân vật tham chiếu, chưa có mô phỏng vải hoặc AR. Build và kiểm thử không được coi là đã đạt yêu cầu tạo hình 3D.

Hồ sơ, bộ sưu tập và yêu thích chỉ lưu trên trình duyệt hiện tại. Chưa triển khai xác thực máy chủ, đồng bộ đa thiết bị, đăng bài hoặc website công khai. Xuất JSON/PNG kích hoạt Blob download, nhưng việc tải hoàn tất và ghi file trên máy người dùng chưa được xác minh trong trình duyệt Codex.

P02/P06 trong bộ ảnh không trùng tên/nội dung với hai mục tương ứng trong `list đồ.md`. Giao diện ghi tên của ảnh hiện có và nêu khác biệt trong mô tả. Ảnh và tài liệu gốc được giữ nguyên.
