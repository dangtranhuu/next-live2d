# 📦 Lịch sử cập nhật – next-live2d

Toàn bộ các thay đổi quan trọng trong dự án sẽ được ghi chú tại đây.

---

## [2.0.5] - 31/07/2026

### 🐛 Sửa lỗi
- Gia cố cleanup DOM trong vòng đời widget để giảm lỗi race `removeChild` khi chuyển trạng thái.

### 🧪 Ứng dụng test
- Tách runtime Live2D của demo khỏi luồng cập nhật UI của App Router để tránh ảnh hưởng điều hướng.
- Khôi phục tương tác đổi model và theo dõi chuột trong chế độ widget cô lập.
- Tăng kích thước khung hiển thị widget cô lập để giảm tình trạng model cao bị cắt.

---

## [2.0.4] - 27/07/2026

### 🐛 Sửa lỗi
- Sửa lỗi đổi model nhưng vẫn giữ model đầu tiên sau khi người dùng chọn model khác.
- Reset config runtime của Live2D trước mỗi lần khởi tạo lại để `jsonPath` cập nhật đúng.
- Cập nhật luồng tải script dùng đủ cặp `L2Dwidget.min.js` và `L2Dwidget.0.min.js`, tránh trạng thái khởi tạo thiếu.

---

## [2.0.3] - 27/07/2026

### 🐛 Sửa lỗi
- Sửa lỗi bind context (`this`) khi khởi tạo Live2D để tránh lỗi runtime kiểu `Cannot read properties of undefined (reading 'emit')`.
- Thêm bước kiểm tra `model.json` trước khi init widget để báo lỗi rõ ràng hơn khi dữ liệu model không hợp lệ.

### ⚙️ Trải nghiệm phát triển
- Thêm script `dev:test:clean` và `dev:clean` cho app test để dọn `.next`, giảm lỗi lệch chunk khi làm việc với package local link.

---

## [2.0.2] - 27/07/2026

### 🔧 Thay đổi
- Cập nhật URL host model mặc định sang GitHub username mới `2hjaito`.
- Cập nhật link metadata package (`repository`, `bugs`) sang profile GitHub mới.

### 📚 Tài liệu
- Cập nhật badge/link GitHub trong README theo username mới.
- Cập nhật link GitHub ở trang demo để đồng bộ.

---

## [2.0.1] - 27/07/2026

### 🐛 Sửa lỗi
- Gia cố quy trình tải script Live2D để tránh inject lặp trong React StrictMode.
- Cải thiện luồng khởi tạo nhằm giảm race condition khi dùng trong Next.js App Router.
- Thêm timeout khi chờ `#live2d-widget` để tránh vòng lặp chờ kéo dài gây đơ giao diện.
- Cải thiện cleanup khi unmount/remount để giảm khả năng treo hiệu ứng khi chuyển trang.
- Bổ sung xử lý Promise an toàn hơn quanh bước init để hạn chế lỗi runtime không bắt được.

### 🔧 Thay đổi
- Đánh dấu entry root của package là client module để import ổn định hơn trong Next.js.
- Tinh chỉnh vòng đời chọn model cho chế độ random và cập nhật theo props.

### 📚 Tài liệu
- Bổ sung hướng dẫn tích hợp ổn định cho Next.js trong README.
- Bổ sung mục cập nhật mới nhất và liên kết changelog trong README.
- Cập nhật trang demo với timeline release và phần nhấn mạnh độ ổn định.

---

## [2.0.0] - 07/03/2026

### 🚀 Bản phát hành lớn

### ✨ Tính năng mới
- Thêm `baseUrl` để tự host model.
- Thêm `position` (`left` hoặc `right`) để điều khiển vị trí widget.
- Thêm `width` và `height` để điều chỉnh kích thước.
- Thêm `opacity` và `hoverOpacity` để điều chỉnh độ trong suốt.
- Thêm `showOnMobile` để bật/tắt hiển thị trên mobile.
- Thêm chế độ `random` để chọn model ngẫu nhiên.
- Thêm `fallback` cho trạng thái loading.
- Thêm callback `onLoad`, `onError`, `onClick`.
- Export đầy đủ type: `Live2DWidgetProps`, `ModelName`, `BUILT_IN_MODELS`, `getRandomModel()`.

### 🔧 Thay đổi
- Tương thích React 19 với peer dependency `react >= 18`.
- Tối ưu giá trị mặc định cho các props.
- Tăng độ an toàn của cleanup khi component unmount.

### 📚 Tài liệu
- Viết lại README đầy đủ cho toàn bộ tính năng.
- Bổ sung ví dụ TypeScript.
- Cập nhật bảng mô tả props.

---

## [1.4.1] - 24/06/2025

### 🐛 Sửa lỗi
- Tránh sử dụng `delete window.L2Dwidget` gây crash ở chế độ strict
- Cải thiện việc dọn dẹp Live2D khi unmount component

### 🧹 Dọn dẹp
- Tăng phiên bản và cập nhật metadata cho npm
- Chuẩn bị quy trình release tự động

---

## [1.4.0] - 16/06/2025

### ✨ Tính năng mới
- Thêm props `style` và `className` cho `<Live2DWidget />`
- Hỗ trợ tuỳ chỉnh vị trí và giao diện Live2D bằng Tailwind hoặc CSS

### ♻️ Tái cấu trúc
- Ngăn widget bị khởi tạo nhiều lần bằng `__live2d_initialized`
- Dọn sạch DOM widget khi component bị huỷ

---

## [1.3.2] - 14/06/2025

### 🎨 Cải thiện giao diện
- Xoá thuộc tính `bottom` dư thừa trong style nội bộ

---

## [1.3.1] - 12/06/2025

### 🧱 Bảo trì
- Nâng cấp `devDependencies` lên React 18

---

## [1.3.0] - 11/06/2025

### ✨ Thêm mới
- Cho phép truyền props `style` và `className` tùy ý
- Bỏ dùng `scrollIntoView`, xử lý hiển thị tốt hơn

---

## [1.2.x] - 09–10/06/2025

### 🛠 Quản lý model & sửa lỗi
- Đổi tên hàng loạt `*.model.json` / `index.json` thành `model.json`
- Cập nhật chính xác tên model: `senko`, `z16`, `hibiki`, `rem`, `haruto`, v.v.
- Fix lỗi hiển thị trên thiết bị di động
- Cải thiện vị trí và hành vi widget

---

## [1.2.0] - 05/06/2025

### ✨ Thêm mới
- Tích hợp `react-syntax-highlighter` hiển thị code demo có màu
- Cập nhật giao diện trang demo trực quan hơn

### 🐛 Sửa lỗi
- Khai báo kiểu cho `react-syntax-highlighter` giúp build trên Vercel thành công

---

## [1.1.0] - 04/06/2025

### ♻️ Tái cấu trúc
- Chuẩn hoá tất cả model về `model.json`
- Loại bỏ logic PixiJS không cần thiết
- Sử dụng thư viện CDN `live2d-widget` đơn giản hơn

---

## [1.0.0] - 03/06/2025

### 🐣 Phiên bản đầu tiên
- Component React: `<Live2DWidget modelName="..." />`
- Tự động inject widget từ CDN
- Hỗ trợ 20+ Live2D model mặc định
