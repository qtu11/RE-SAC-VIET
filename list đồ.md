**Bảo tàng Lịch sử Quốc gia**, **Viện Sử học – VASS**, tư liệu về **Khâm định Đại Nam hội điển sự lệ**, hiện vật cung đình Huế và tư liệu về trang phục dân gian cuối thế kỷ XIX. Điểm quan trọng là không nên gom mọi thứ thành “cổ phục triều Nguyễn” rồi cho phối tự do: hệ thống y phục Nguyễn phân biệt rất chặt theo **người mặc, phẩm cấp, nghi lễ, mùa, màu sắc và hoa văn**. *Khâm định Đại Nam hội điển sự lệ* ghi các quy chế từ Gia Long 1802 đến Tự Đức 1851; phần *Tục biên* tiếp tục ghi giai đoạn 1852–1889. [Viện Sử học](https://viensuhoc.vass.gov.vn/cong-trinh-tieu-bieu/kham-dinh-dai-nam-hoi-dien-su-le-434959?utm_source=chatgpt.com)

Vì vậy, cho **RE:SẮC STUDIO – Triều Nguyễn • Thế kỷ XIX**, tôi đề xuất dùng catalog bên dưới làm **template dữ liệu gốc**. Nó không tự nhận là “100% mọi biến thể từng tồn tại”, vì chỉ riêng y phục hoàng gia và quan lại đã có rất nhiều biến thể theo niên hiệu và phẩm cấp; nhưng đây là bộ khung khá đầy đủ để làm app mà vẫn giữ được tính lịch sử.

### Template cho mỗi trang phục

| Field | Ví dụ |
|---|---|
| `id` | `nguyen_male_long_bao_dai_trieu` |
| `name` | Long bào Đại triều |
| `gender` | Nam |
| `period` | Triều Nguyễn, TK XIX |
| `reign_range` | Gia Long – Thành Thái |
| `social_class` | Hoàng đế |
| `category` | Đại triều phục |
| `occasion` | Thiết đại triều, đại lễ |
| `base_garment` | Bào cổ tròn |
| `headwear` | Mũ Cửu Long |
| `lower_garment` | Xiêm |
| `footwear` | Hia |
| `accessories` | Đai, hốt ngọc |
| `motifs` | Rồng 5 móng, mây, thủy ba |
| `historical_colors` | Theo điển chế |
| `historical_status` | `documented` |
| `remix_level` | 0–30% |
| `culture_warning` | Không dùng rồng 5 móng cho nhân vật thường dân |
| `source` | Khâm định Đại Nam hội điển sự lệ / BTLSQG |

Bảo tàng Lịch sử Quốc gia cho biết *Hội điển* có riêng các phần quy định áo mũ đế, hậu, hoàng tử, công chúa và quan lại; trang phục cung đình còn được chia thành **đại triều, thường triều, nghi lễ và thường phục**. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsuquocgia.vn/vi/Articles/3096/18303/trang-phuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com)

## Catalog NAM — Triều Nguyễn thế kỷ XIX

| ID | Tên nên hiện trên website | Người mặc / hoàn cảnh | Đặc trưng lịch sử |
|---|---|---|---|
| M01 | **Long bào Đại triều** | Hoàng đế | Dùng khi thiết đại triều; đi với **mũ Cửu Long, xiêm, đai, hốt ngọc, hia**. Áo mang biểu tượng rồng 5 móng. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M02 | **Hoàng bào Thường triều** | Hoàng đế | Dùng khi thường triều; Bảo tàng mô tả áo có **viên long**, đi cùng mũ Bình Thiên và hài. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M03 | **Long cổn / Cổn phục tế Giao** | Hoàng đế | Lễ tế Nam Giao và nghi lễ tế tự; áo tay thụng, có mô típ **lưỡng long triều nhật**. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M04 | **Long cổn tế Miếu** | Hoàng đế | Biến thể cổn phục dùng trong nghi lễ miếu; nên tách khỏi tế Giao trong app để không làm đồng nhất nghi lễ. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M05 | **Sa kép Tịch điền** | Hoàng đế | Trang phục dùng khi vua thực hiện lễ cày Tịch điền; nguồn bảo tàng mô tả màu gạch non và rồng nhỏ ẩn trong mây. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M06 | **Sa kép Hoàng thái tử** | Hoàng thái tử | Hiện vật và tư liệu bảo tàng xác nhận áo sa kép; mũ của Thái tử có quy chế riêng, phân biệt với vua. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M07 | **Mãng bào Hoàng tử** | Hoàng tử / tôn thất | Dùng trong đại triều; **mãng** thuộc cấp biểu tượng thấp hơn rồng của Hoàng đế. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M08 | **Mãng lan Hoàng tử** | Hoàng tử | Dùng trong những dịp lễ quan trọng. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| M09 | **Thường triều Thân vương** | Thân vương | Bảo tàng còn hiện vật áo thường triều màu hỏa hoàng, có mãng và bổ tử. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18741/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |
| M10 | **Mãng bào Đại triều Văn quan** | Quan văn cao cấp | Hệ thống đại triều phẩm phục phân cấp theo phẩm hàm, màu, mũ, đai và hoa văn. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3091/73223/che-djo-y-quan-trieu-nguyen.html?utm_source=chatgpt.com) |
| M11 | **Mãng bào Đại triều Võ quan** | Quan võ cao cấp | Có hệ đại triều riêng; quan văn và quan võ còn khác dạng mũ phốc đầu. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3091/73223/che-djo-y-quan-trieu-nguyen.html?utm_source=chatgpt.com) |
| M12 | **Bổ phục Văn quan** | Quan văn | Bổ tử dùng chim để phân phẩm. Ví dụ thời Thiệu Trị: nhất–nhị phẩm tiên hạc, tam phẩm cẩm kê, tứ phẩm khổng tước… [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3096/18573/bo-tu-tren-pham-phuc-quan-trieu-nguyen.html?utm_source=chatgpt.com) |
| M13 | **Bổ phục Võ quan** | Quan võ | Dùng thú để phân phẩm: kỳ lân, bạch trạch, sư tử, hổ… tùy phẩm. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3096/18573/bo-tu-tren-pham-phuc-quan-trieu-nguyen.html?utm_source=chatgpt.com) |
| M14 | **Áo tấc Nam** | Quan viên, sĩ phu và dân gian | Áo ngũ thân **tay rộng**, dùng cho quan–hôn–tang–tế, Tết và lễ trọng; không phải thường phục lao động hằng ngày. [Du Lịch Huế](https://huetourism.gov.vn/ao-tac-co-phuc-quy-dang-hoi-sinh/?pid=MjExMjB8Y3NkbGRs0\&utm_source=chatgpt.com) |
| M15 | **Ngũ thân tay chẽn Nam** | Nam giới nhiều tầng lớp | Loại thường phục tiêu biểu thời Nguyễn; ống tay gọn hơn áo tấc. Bảo tàng có hiện vật áo ngũ thân nam. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html?utm_source=chatgpt.com) |
| M16 | **Giao lĩnh lễ phục / Bổ phục** | Một số nghi lễ | Bảo tàng còn lưu áo lễ cổ giao lĩnh; nên ghi rõ đây **không phải lựa chọn thường phục mặc phố điển hình TK XIX**. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/2001/66867/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |
| M17 | **Áo dài đoạn kép Nam** | Tầng lớp khá giả / nghi lễ | Có hiện vật thời Nguyễn tại BTLSQG; phù hợp làm mục “hiện vật bảo tàng” hơn là mặc định cho mọi nam giới. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/2001/66867/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |

Một lưu ý rất đáng đưa vào logic app: **bổ tử không bất biến suốt thế kỷ XIX**. Bảo tàng ghi rõ đầu Gia Long có quy định, sang Minh Mạng có giai đoạn phẩm phục quan lại không dùng bổ tử, rồi Thiệu Trị lại có hệ quy định khác. Vì vậy đừng chỉ có dropdown “Quan nhất phẩm” mà nên có thêm `Niên hiệu`. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/VI/Articles/3096/18573/bo-tu-tren-pham-phuc-quan-trieu-nguyen.html?utm_source=chatgpt.com)

## Catalog NỮ — Triều Nguyễn thế kỷ XIX

| ID | Tên nên hiện trên website | Người mặc / hoàn cảnh | Đặc trưng lịch sử |
|---|---|---|---|
| P01 | **Phượng bào / Phụng bào Hoàng hậu** | Hoàng hậu | Trang phục cung đình cấp cao; hiện vật Phụng bào Hoàng hậu được Bảo tàng Lịch sử TP.HCM trưng bày. [Bảo Tàng Lịch Sử](https://www.baotanglichsutphcm.com.vn/en-US/chiem-ngung-nhung-bo-trang-phuc-vat-dung-cung-dinh-trieu-nguyen?utm_source=chatgpt.com) |
| P02 | **Đại triều phục Hoàng thái hậu** | Hoàng thái hậu | Có hiện vật và ảnh tư liệu cung đình; mũ và hoa văn phượng thể hiện cấp bậc rất cao. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| P03 | **Nhật Bình Hoàng hậu** | Hoàng hậu | Một trong các dạng y phục tiêu biểu của hậu cung; màu, chất liệu, hoa văn và đồ trang sức phụ thuộc quy chế. |
| P04 | **Nhật Bình Hoàng thái hậu** | Hoàng thái hậu | Nên tách riêng với Hoàng hậu vì phẩm trật và đồ án trang trí không nên dùng lẫn. |
| P05 | **Nhật Bình Công chúa – Đoàn Loan** | Công chúa | Bảo tàng xác nhận **áo đoàn loan Nhật Bình của công chúa**. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| P06 | **Nhật Bình Cung tần Nhất giai** | Hậu cung | Dùng hệ quy chế riêng theo phẩm trật; không nên áp màu/họa tiết của Hoàng hậu. |
| P07 | **Nhật Bình Cung tần Nhị giai** | Hậu cung | Tư liệu quy chế đầu Nguyễn phân biệt rõ vật liệu, màu và trang sức theo cấp. |
| P08 | **Nhật Bình Cung tần Tam giai** | Hậu cung | Có phân cấp riêng; app nên khóa hoa văn vượt cấp. |
| P09 | **Nhật Bình Cung tần Tứ giai** | Hậu cung | Cấp thấp hơn dùng hệ màu và đồ trang sức giản lược hơn. |
| P10 | **Nhật Bình tang phục cung đình** | Công chúa / phi tần | BTLSQG lưu một áo sa màu đen, cổ Nhật Bình, thêu phượng/loan, dùng trong thời có chế. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18741/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |
| P11 | **Sa kép Xuân–Hạ Hoàng thái hậu** | Hoàng thái hậu | Bảo tàng có mẫu được xác định rõ là áo sa kép Xuân–Hạ của Hoàng thái hậu. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| P12 | **Sa kép Xuân–Hạ Công chúa** | Công chúa | Hiện vật/tư liệu ảnh được BTLSQG công bố. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com) |
| P13 | **Nhật Bình Nhất phẩm phu nhân** | Mệnh phụ | Bảo tàng lưu áo sa nam của Nhất phẩm phu nhân với cổ Nhật Bình. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/2001/66867/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |
| P14 | **Áo lễ Nhất phẩm phu nhân** | Mệnh phụ | BTLSQG lưu áo màu thiên thanh may theo kiểu áo tấc/áo lễ. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/2001/66867/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com) |
| P15 | **Áo tấc Nữ** | Nữ giới nhiều tầng lớp | Dùng trong quan–hôn–tang–tế và lễ trọng; áo tấc lịch sử dành cho **cả nam và nữ**. [Du Lịch Huế](https://huetourism.gov.vn/ao-tac-co-phuc-quy-dang-hoi-sinh/?pid=MjExMjB8Y3NkbGRs0\&utm_source=chatgpt.com) |
| P16 | **Ngũ thân tay chẽn Nữ** | Nữ giới | Loại trang phục Nguyễn cho cả hai giới; nguồn Sở Văn hóa TP.HCM xác nhận cấu trúc nam và nữ đều có 5 thân/5 cúc, tay gọn hơn áo tấc. [Sở VHTT Hồ Chí Minh](https://svhtt.hochiminhcity.gov.vn/web/guest/tin-chi-tiet/-/chi-tiet/le-trao-tang-ao-dai-ngu-than-truyen-thong-nhan-ngay-di-san-van-hoa-23-thang-11-23561-1002.html?utm_source=chatgpt.com) |
| P17 | **Áo tứ thân Bắc Bộ cuối TK XIX** | Phụ nữ dân gian Bắc Bộ | Đây là **trang phục dân gian tồn tại dưới thời Nguyễn**, không phải cung phục Huế. Có ảnh phụ nữ Bắc Kỳ cuối thế kỷ XIX mặc tứ thân. [Hội Liên Hiệp Phụ Nữ Việt Nam](https://hoilhpn.org.vn/tin-chi-tiet/-/chi-tiet/ao-tu-than-trang-phuc-truyen-thong-cua-phu-nu-viet-25511-4513.html?utm_source=chatgpt.com) |
| P18 | **Tứ thân – Yếm – Váy – Thắt lưng** | Phụ nữ dân gian Bắc Bộ | Nên đưa thành một “full set” riêng nếu app mở rộng từ “cung đình Huế” sang “Việt Nam dưới triều Nguyễn”. |

### Đối với riêng concept **“Hắc Phong Tiểu Tự”**

Tôi sẽ **không** gắn cho nó nhãn “cổ phục nguyên bản”. Tốt nhất hiển thị:

> **HẮC PHONG TIỂU TỰ**  
> *Contemporary Remix based on Nguyễn-era Ngũ Thân*  
> **Nền lịch sử:** Áo ngũ thân tay chẽn – Triều Nguyễn, TK XIX  
> **Mức độ phục dựng:** 65% Historical / 35% Contemporary  
> **Biến tấu:** bảng màu đen–đỏ, footwear hiện đại, phụ kiện Gen Z  
> **Giữ nguyên:** cấu trúc ngũ thân, cổ đứng, hàng khuy, tỷ lệ tà áo và tinh thần trang phục  
> **Không sử dụng:** rồng 5 móng, mũ Cửu Long, hoa văn/phụ kiện dành riêng cho Hoàng đế hoặc phẩm cấp cao.

Điều này cực quan trọng với bài thi của nhóm, vì **rồng, phượng, mãng, loan, màu sắc và cả mũ không chỉ là trang trí đẹp** mà là dấu hiệu phẩm cấp. Bảo tàng ghi rõ rồng của vua khác biểu tượng của Thái tử, hoàng thân; hoa văn của Hoàng hậu khác Công chúa và cung giai. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18303/trangphuc-cung-djinh-trieu-nguyen.html?utm_source=chatgpt.com)

### Tôi đề xuất cấu trúc lựa chọn trên website

```text
TRIỀU NGUYỄN · THẾ KỶ XIX

[ NAM ] [ NỮ ]

LỌC THEO:
○ Hoàng gia
○ Quan lại
○ Sĩ phu / Mệnh phụ
○ Dân gian

DỊP SỬ DỤNG:
○ Đại triều
○ Thường triều
○ Tế lễ
○ Quan - Hôn - Tang - Tế
○ Tết / Lễ hội
○ Thường ngày

THỜI KỲ:
○ Gia Long        1802–1819
○ Minh Mạng       1820–1840
○ Thiệu Trị       1841–1847
○ Tự Đức          1848–1883
○ Kiến Phúc/Hàm Nghi/Đồng Khánh
○ Thành Thái      1889–1907

MỨC ĐỘ:
[ Phục dựng lịch sử ]
[ Phối hiện đại có kiểm soát ]
[ Remix Gen Z ]
```

Với app của nhóm, tôi còn khuyên **không cho AI phối trực tiếp khi chưa biết `niên hiệu + giới tính + thân phận + dịp`**. Ví dụ người dùng chọn “Sinh viên – chụp kỷ yếu – phong cách cool/ngầu” thì hệ thống nên ưu tiên **ngũ thân tay chẽn / áo tấc**, chứ không tự động cho mặc Long bào hay Nhật Bình Hoàng hậu chỉ vì đẹp.

Nguồn nền mà nhóm có thể đưa thẳng vào phần “Tư liệu lịch sử”: **Khâm định Đại Nam hội điển sự lệ** là bộ điển chương chính thức của nhà Nguyễn, hoàn thành năm 1851 và ghi các quy định từ 1802; phần *Tục biên* tiếp tục ghi các sắc dụ đến 1889. [Viện Sử học](https://viensuhoc.vass.gov.vn/cong-trinh-tieu-bieu/kham-dinh-dai-nam-hoi-dien-su-le-434959?utm_source=chatgpt.com) Bảo tàng Lịch sử Quốc gia hiện lưu nhiều hiện vật thật như mãng bào, bổ phục, áo tấc, Nhật Bình, sa kép và áo của các phẩm cấp khác nhau, rất phù hợp để làm nguồn kiểm chứng cho database. [Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/3096/18741/y-phuc-thoi-nguyen-tai-bao-tang-lich-su-quoc-gia.html?utm_source=chatgpt.com)

Nếu dùng bộ này cho **website Audition**, bước tiếp theo hợp lý nhất là biến nó thành một **dataset khoảng 30–40 outfit card**, mỗi card có `tên + nam/nữ + ảnh + thời vua + tầng lớp + dịp mặc + màu lịch sử + tóc + mũ + giày/hài + phụ kiện + ý nghĩa + cảnh báo phối sai + Heritage Score`. Như vậy phần “phối đồ” của RE:SẮC STUDIO sẽ vừa đẹp vừa có cơ chế bảo vệ tính chính xác lịch sử.