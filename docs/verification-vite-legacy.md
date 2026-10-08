# Kiểm tra website RE:SẮC STUDIO

Ngày kiểm tra: 08/10/2026. Kiểm tra bản phát triển và bản build React + TypeScript + Vite trong trình duyệt Codex.

## Build và kiểm tra dữ liệu

- `npm test`: 8/8 bài kiểm tra đạt.
- `npm run build`: TypeScript và Vite hoàn thành, tạo thư mục `dist/`.
- Bản build được mở và kiểm tra tại `http://127.0.0.1:4173/`.
- Không ghi nhận lỗi hoặc cảnh báo console trong lần kiểm tra bản build cuối.

Các bài kiểm tra bao gồm: từ chối dữ liệu chia sẻ sai, chỉ nhận phụ kiện hợp lệ, chống lưu bản phối trùng sau khi phục hồi, xử lý dữ liệu lưu hỏng, ưu tiên lựa chọn từ liên kết chia sẻ, ID catalog duy nhất, tìm kiếm tiếng Việt có/không dấu và tọa độ ảnh nằm trong kích thước ảnh thực.

## Thao tác đã kiểm tra trong trình duyệt

- Mở trình phối đồ; chọn dịp Tết, màu Lam, thêm túi xách và phong cách hiện đại. Kết quả hiển thị đúng các lựa chọn.
- Lưu bản phối, tải lại trang và mở lại từ bộ sưu tập. Tên bản phối và lựa chọn được giữ lại.
- Lưu lại cùng bản phối không tạo bản ghi trùng.
- Tạo liên kết chia sẻ và mở liên kết để phục hồi toàn bộ lựa chọn.
- Tìm kiếm `nhat binh` trên mobile và lọc catalog nữ.
- Chọn mẫu P04 có kích thước ảnh khác catalog mặc định; hình ảnh hiển thị đúng vùng đã chọn.
- Điều hướng các tab phối đồ bằng phím mũi tên; trạng thái tab thay đổi đúng.
- Kiểm tra bố cục trang chủ, ảnh Look mẫu, toàn thân nhân vật trong trình phối đồ và thanh điều hướng mobile.

## Kích thước màn hình

Không có tràn ngang trên trang chủ ở các kích thước đã kiểm tra. Chênh lệch giữa viewport và chiều rộng nội dung khả dụng là thanh cuộn dọc của trình duyệt.

| Viewport (px) | Chiều rộng khả dụng (px) | Chiều rộng nội dung (px) |
| ---: | ---: | ---: |
| 320 | 315 | 315 |
| 390 | 385 | 385 |
| 768 | 763 | 763 |
| 1024 | 1019 | 1019 |
| 1280 | 1275 | 1275 |
| 1536 | 1531 | 1531 |

Ảnh kiểm tra: [desktop](screenshots/desktop.jpg), [trang chủ mobile](screenshots/mobile.jpg), [trình phối đồ mobile](screenshots/mobile-builder.jpg).

## Phạm vi và phần chưa xác minh

Hồ sơ, bộ sưu tập và yêu thích được lưu trên trình duyệt hiện tại. Chưa có xác thực tài khoản máy chủ, đồng bộ đa thiết bị, đăng bài cộng đồng, dựng trang phục 3D hoặc AR. Ảnh minh họa thể hiện concept; phụ kiện và màu được lưu thành lựa chọn, không phải mô phỏng thay đồ 3D.

Nút xuất JSON tạo nội dung tệp và kích hoạt tải xuống bằng Blob URL. Trình duyệt Codex chưa trả về sự kiện tải xuống hoàn tất, nên việc tệp được lưu thành công trên ổ đĩa chưa được xác minh. Các luồng lưu bộ sưu tập và mở lại bằng liên kết đã được kiểm tra riêng.

Website hiện chạy cục bộ. Chưa kiểm tra hosting công khai, tên miền hoặc backend vì các phần này chưa được triển khai.
