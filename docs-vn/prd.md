# Product Requirements Document (PRD) for AI-Powered Trading Support System

## 1. Mục tiêu và Bối cảnh

### Mục tiêu

*   Thu hút 500 người dùng hoạt động hàng tuần trong vòng 3 tháng sau khi ra mắt MVP.
*   Đạt tỷ lệ chuyển đổi từ người dùng miễn phí sang trả phí là 5% trong vòng 6 tháng.
*   Thu thập hơn 2.000 Báo cáo Phân tích chất lượng cao trong vòng 6 tháng để huấn luyện AI.
*   Xây dựng thói quen cho người dùng, với 25% người dùng hàng đầu tạo ra hơn 3 báo cáo mỗi tuần.
*   Đạt tỷ lệ giữ chân người dùng 20% vào Tuần thứ 4.

### Bối cảnh

Các nhà giao dịch nhỏ lẻ hiện đang đối mặt với một thách thức lớn: họ có quyền truy cập vào một lượng dữ liệu khổng lồ nhưng lại thiếu một quy trình hiệu quả để chuyển thông tin đó thành việc cải thiện hiệu suất một cách nhất quán. Các phương pháp ghi nhật ký hiện tại thường là thủ công, rườm rà và không có sự liên kết với kết quả giao dịch, gây khó khăn cho việc học hỏi từ sai lầm hoặc xác định các mẫu thành công.

Sản phẩm này giải quyết vấn đề trên bằng cách cung cấp một Trợ lý Giao dịch Cá nhân hóa bằng AI. Cốt lõi của giải pháp là một nền tảng ghi nhật ký thông minh, ưu tiên hình ảnh, cho phép các nhà giao dịch dễ dàng và có hệ thống ghi lại các phân tích và quyết định giao dịch của họ. Về lâu dài, dữ liệu này sẽ được sử dụng để huấn luyện các mô hình AI nhằm cung cấp phản hồi và thông tin chi tiết được cá nhân hóa sâu sắc, phù hợp với phong cách và tâm lý giao dịch riêng của mỗi người dùng.

### Change Log

| Date       | Version | Description                       | Author    |
| :--------- | :------ | :-------------------------------- | :-------- |
| 2025-08-01 | 1.0     | Bản nháp đầu tiên từ Tóm tắt Dự án | John (PM) |

---

## 2. Yêu cầu

### Yêu cầu Chức năng (Functional Requirements)

**Nhóm 1: Nền tảng & Thiết lập ban đầu**
*   **FR1:** Hệ thống phải cung cấp chức năng xác thực người dùng (đăng ký, đăng nhập, đăng xuất).
*   **FR2:** Người dùng phải có khả năng quản lý (CRUD) danh sách các **tài sản giao dịch** (ví dụ: EUR/USD, BTC/USD) để sử dụng trong các báo cáo phân tích.
*   **FR3:** Người dùng phải có khả năng quản lý (CRUD) danh sách các **phương pháp giao dịch** của riêng họ (ví dụ: 'Supply and Demand', 'ICT') để gắn thẻ và phân loại các phân tích.

**Nhóm 2: Quy trình làm việc cốt lõi - Báo cáo Phân tích**
*   **FR4:** Người dùng phải có một **trang quản lý báo cáo** để xem, tạo, sửa và xóa (CRUD) các "Báo cáo Phân tích" của họ.
*   **FR5:** Phải có tính năng "Báo cáo Phân tích Tương tác" là trọng tâm của MVP.
*   **FR6:** Báo cáo phải hỗ trợ hệ thống "khối" (block) động, cho phép người dùng thêm nhiều khối để phân tích trên các khung thời gian khác nhau trong cùng một báo cáo.
*   **FR7:** Mỗi khối phân tích phải tích hợp một thư viện biểu đồ cho phép phân tích kỹ thuật trực quan.
*   **FR8:** Biểu đồ phải cung cấp các công cụ vẽ cơ bản, bao gồm **Đường xu hướng (Trendline)** và **Hình chữ nhật (Vùng hỗ trợ/kháng cự)**.
*   **FR9:** Mỗi khối phân tích phải có một khu vực riêng để người dùng nhập ghi chú văn bản.

**Nhóm 3: Tính năng Hỗ trợ & Lưu trữ**
*   **FR10:** Người dùng phải có khả năng tạo và sử dụng lại các "Mẫu Phân tích" để tăng tốc quá trình ghi nhật ký.
*   **FR11:** Hệ thống phải lưu trữ một cách đáng tin cậy tất cả nội dung do người dùng tạo (dữ liệu có cấu trúc, các đối tượng vẽ trên biểu đồ, ghi chú).

### Yêu cầu Phi chức năng (Non-Functional Requirements)

*   **NFR1:** Ứng dụng phải được xây dựng dưới dạng một ứng dụng web trên nền tảng Next.js hiện có.
*   **NFR2:** MVP sẽ sử dụng **Supabase** cho các hoạt động CRUD chính và xác thực người dùng để tăng tốc độ phát triển.
*   **NFR3:** Dữ liệu người dùng phải được lưu trữ trong cơ sở dữ liệu PostgreSQL của Supabase.
*   **NFR4:** Hệ thống phải tận dụng các tính năng bảo mật tích hợp của Supabase, bao gồm Row Level Security (Bảo mật Cấp độ Hàng), để đảm bảo dữ liệu của người dùng được cách ly và riêng tư tuyệt đối.
*   **NFR5:** Giao diện người dùng phải được thiết kế ưu tiên cho máy tính để bàn (desktop-first).
*   **NFR6:** MVP phải được hoàn thành trong khung thời gian từ 3-4 tháng.

---

## 3. Mục tiêu Thiết kế Giao diện Người dùng

### Tầm nhìn UX tổng thể
Trải nghiệm người dùng phải sạch sẽ, chuyên nghiệp và hiệu quả. Giao diện nên ưu tiên sự rõ ràng và tốc độ, cho phép các nhà giao dịch ghi lại phân tích của họ với ít sự cản trở nhất. Trọng tâm là một công cụ mạnh mẽ, không phải là một ứng dụng giải trí. Giao diện phải tạo cảm giác đáng tin cậy và chính xác.

### Các Mô hình Tương tác Chính
*   **Báo cáo Tương tác Dựa trên Khối (Block-based):** Người dùng sẽ xây dựng báo cáo của mình bằng cách thêm, xóa và sắp xếp các "khối" phân tích. Đây là mô hình tương tác cốt lõi.
*   **Thao tác Trực tiếp trên Biểu đồ:** Người dùng sẽ tương tác trực tiếp với biểu đồ để vẽ các đường xu hướng và các vùng, làm cho quá trình phân tích trở nên trực quan.
*   **Nhập liệu theo ngữ cảnh:** Các trường nhập liệu cho ghi chú và dữ liệu có cấu trúc sẽ được đặt ngay bên cạnh biểu đồ tương ứng, giữ cho ngữ cảnh không bị mất.
*   **Sử dụng Modal (Hộp thoại):** Các hành động CRUD cho các mục phụ (như Tài sản, Phương pháp) sẽ sử dụng các hộp thoại để người dùng không phải rời khỏi trang làm việc chính của họ.

### Các Màn hình và Chế độ xem Cốt lõi
*   **Trang Đăng nhập / Đăng ký:** Giao diện đơn giản để xác thực người dùng.
*   **Trang tổng quan (Dashboard):** Màn hình chính sau khi đăng nhập. Sẽ hiển thị các thông tin thống kê và trực quan hóa dữ liệu tổng hợp. (Phiên bản đầu tiên có thể đơn giản).
*   **Trang Quản lý Báo cáo Phân tích:** Một trang riêng biệt dành riêng cho việc quản lý (CRUD) các báo cáo phân tích. Đây sẽ là một mục menu chính.
*   **Trang Quản lý Tài sản:** Một trang riêng biệt cho phép người dùng thực hiện các thao tác CRUD trên danh sách tài sản giao dịch của họ. Trang này sẽ là một mục menu chính trong điều hướng.
*   **Trang Quản lý Phương pháp:** Một trang riêng biệt cho phép người dùng thực hiện các thao tác CRUD trên danh sách các phương pháp giao dịch của họ. Trang này cũng sẽ là một mục menu chính.
*   **Trình chỉnh sửa Báo cáo Phân tích:** Màn hình nơi người dùng xây dựng và chỉnh sửa báo cáo chi tiết.

### Khả năng Tiếp cận: WCAG AA
Chúng ta sẽ nhắm đến việc tuân thủ các Nguyên tắc Tiếp cận Nội dung Web (WCAG) cấp độ AA.

### Xây dựng thương hiệu
Giao diện sẽ tuân theo phong cách thẩm mỹ hiện đại, tối giản đã được thiết lập bởi **Shadcn-ui** và Tailwind CSS.

### Thiết bị và Nền tảng Mục tiêu: Web Responsive (Ưu tiên Máy tính để bàn)
Ứng dụng sẽ được xây dựng dưới dạng một ứng dụng web đáp ứng (responsive), nhưng trải nghiệm trên máy tính để bàn sẽ được ưu tiên và tối ưu hóa.

---

## 4. Các giả định kỹ thuật

### Cấu trúc Repository: Monorepo
Dự án sẽ được cấu trúc dưới dạng một monorepo.

### Kiến trúc Dịch vụ: BaaS-first, phát triển thành Hybrid
*   **MVP:** Kiến trúc ban đầu sẽ là **Backend-as-a-Service (BaaS)**, phụ thuộc nhiều vào **Supabase**.
*   **Tương lai:** Kiến trúc sẽ phát triển thành một mô hình hybrid với dịch vụ **Python (FastAPI)**.

### Yêu cầu về Kiểm thử: Unit + Integration
Dự án sẽ triển khai Kiểm thử Đơn vị và Kiểm thử Tích hợp.

### Các giả định và yêu cầu kỹ thuật bổ sung
*   **Framework:** Next.js 15 App Router.
*   **Ngôn ngữ:** TypeScript (strict mode).
*   **Thư viện Thành phần:** Shadcn-ui.
*   **Thay thế Xác thực:** Clerk sẽ được thay thế bằng Supabase Auth.
*   **Lớp API:** Một lớp trừu tượng API riêng biệt sẽ được tạo ra.

---

## 5. Danh sách Epic

*   **Epic 1: Nền tảng, Xác thực & Quản lý Dữ liệu Cơ bản**
    *   **Mục tiêu:** Thiết lập nền tảng kỹ thuật, thay thế Clerk bằng Supabase Auth, và xây dựng các trang quản lý (CRUD) cho **Tài sản** và **Phương pháp**.
*   **Epic 2: Chức năng Ghi nhật ký Cốt lõi & Quản lý Báo cáo**
    *   **Mục tiêu:** Xây dựng tính năng trung tâm của sản phẩm: **Trang Quản lý Báo cáo** và **Trình chỉnh sửa Báo cáo Tương tác**.
*   **Epic 3: Tối ưu hóa Quy trình & Hoàn thiện Giao diện**
    *   **Mục tiêu:** Giới thiệu tính năng **Mẫu Phân tích** và xây dựng giao diện ban đầu cho **Trang tổng quan (Dashboard)**.

---

## 6. Chi tiết Epic

### Epic 1: Nền tảng, Xác thực & Quản lý Dữ liệu Cơ bản
*   **Story 1.1: Di chuyển Xác thực từ Clerk sang Supabase Auth**
    *   **Là một** người dùng mới, **tôi muốn** có thể đăng ký và đăng nhập một cách an toàn bằng Supabase, **để** tài khoản và dữ liệu của tôi được bảo vệ.
    *   **Tiêu chí Chấp nhận:** Clerk được gỡ bỏ, Supabase Auth được tích hợp, middleware được cập nhật, người dùng có thể đăng ký/đăng nhập/đăng xuất.
*   **Story 1.2: Xây dựng Trang Quản lý Tài sản**
    *   **Là một** nhà giao dịch, **tôi muốn** có thể CRUD các tài sản giao dịch, **để** tôi có thể dễ dàng chọn chúng khi tạo báo cáo.
    *   **Tiêu chí Chấp nhận:** Có trang `/assets`, hiển thị bảng dữ liệu, có form thêm/sửa/xóa, kết nối với DB Supabase, có RLS.
*   **Story 1.3: Xây dựng Trang Quản lý Phương pháp**
    *   **Là một** nhà giao dịch, **tôi muốn** có thể CRUD các phương pháp giao dịch, **để** tôi có thể gắn thẻ các phân tích của mình.
    *   **Tiêu chí Chấp nhận:** Có trang `/methodologies`, hiển thị bảng dữ liệu, có form thêm/sửa/xóa, kết nối với DB Supabase, có RLS.

### Epic 2: Chức năng Ghi nhật ký Cốt lõi & Quản lý Báo cáo
*   **Story 2.1: Xây dựng Trang Quản lý Báo cáo**
    *   **Là một** nhà giao dịch, **tôi muốn** có một trang để xem tất cả các báo cáo, **để** tôi có thể theo dõi công việc của mình.
    *   **Tiêu chí Chấp nhận:** Có trang `/reports`, hiển thị danh sách báo cáo, có nút tạo mới, có tùy chọn sửa/xóa.
*   **Story 2.2: Thiết lập Trình chỉnh sửa Báo cáo Tương tác**
    *   **Là một** nhà giao dịch, **tôi muốn** có một trình chỉnh sửa dựa trên khối, **để** tôi có thể cấu trúc phân tích của mình.
    *   **Tiêu chí Chấp nhận:** Có trang chỉnh sửa `/reports/[reportId]`, cho phép thêm/xóa khối, nhập tiêu đề, chọn tài sản/phương pháp, có nút lưu.
*   **Story 2.3: Tích hợp Biểu đồ và Công cụ Vẽ**
    *   **Là một** nhà giao dịch, **tôi muốn** có biểu đồ tương tác với công cụ vẽ, **để** tôi có thể thực hiện phân tích kỹ thuật.
    *   **Tiêu chí Chấp nhận:** Tích hợp thư viện biểu đồ, hiển thị dữ liệu nến, có công cụ vẽ Trendline/Rectangle, các đối tượng vẽ được lưu lại.

### Epic 2.5: Xây dựng và Tích hợp Market Data API
*   **Mục tiêu:** Xây dựng, kiểm thử và triển khai một service FastAPI nội bộ để cung cấp dữ liệu nến cho các thành phần biểu đồ, bao gồm cả quy trình nhập dữ liệu.
*   **Story 2.5.1: Tạo Kịch bản Nhập Dữ liệu Thị trường**
    *   **Là một** nhà phát triển, **tôi muốn** có một kịch bản (script) có thể lấy dữ liệu nến lịch sử từ một API công khai (ví dụ: Finnhub.io) và lưu nó vào bảng `market_data` trong cơ sở dữ liệu PostgreSQL, **để** hệ thống có nguồn dữ liệu cho việc phân tích.
    *   **Tiêu chí Chấp nhận:** Một bảng `market_data` mới được tạo trong DB. Kịch bản có thể được chạy thủ công, nhận symbol và khoảng thời gian làm tham số. Dữ liệu được lưu trữ thành công. API key được quản lý an toàn qua biến môi trường.
*   **Story 2.5.2: Thiết kế và Khởi tạo FastAPI Service**
    *   **Là một** nhà phát triển, **tôi muốn** thiết lập một ứng dụng FastAPI mới trong thư mục `backend/` với các endpoint cơ bản, **để** tạo nền tảng cho service dữ liệu thị trường.
    *   **Tiêu chí Chấp nhận:** Thư mục `backend/` được tạo, FastAPI được cài đặt, có một endpoint `/health` hoạt động, cấu hình Docker để chạy local.
*   **Story 2.5.3: Xây dựng Endpoint Dữ liệu Nến**
    *   **Là một** nhà phát triển, **tôi muốn** tạo một endpoint `GET /api/v1/candles` nhận các tham số `symbol`, `resolution`, `from`, `to`, **để** nó có thể truy vấn và trả về dữ liệu nến từ bảng `market_data`.
    *   **Tiêu chí Chấp nhận:** Endpoint hoạt động, trả về dữ liệu theo định dạng mà thư viện biểu đồ yêu cầu, có xử lý lỗi khi không tìm thấy dữ liệu.
*   **Story 2.5.4: Triển khai và Bảo mật API Service**
    *   **Là một** nhà phát triển, **tôi muốn** triển khai service FastAPI lên một môi trường serverless (ví dụ: Vercel Functions) và bảo mật nó, **để** frontend có thể gọi nó một cách an toàn.
    *   **Tiêu chí Chấp nhận:** Service được triển khai, có URL công khai, chỉ có thể truy cập được từ domain của ứng dụng frontend, có CI/CD pipeline để tự động triển khai khi có thay đổi.

### Epic 3: Tối ưu hóa Quy trình & Hoàn thiện Giao diện
*   **Story 3.1: Xây dựng Chức năng Mẫu Phân tích**
    *   **Là một** nhà giao dịch, **tôi muốn** lưu cấu trúc báo cáo làm mẫu, **để** tôi có thể nhanh chóng bắt đầu phân tích mới.
    *   **Tiêu chí Chấp nhận:** Có nút "Lưu làm Mẫu", lưu cấu trúc vào DB, cho phép tạo báo cáo mới từ mẫu.
*   **Story 3.2: Thiết lập Trang tổng quan (Dashboard) ban đầu**
    *   **Là một** người dùng, **tôi muốn** có một trang tổng quan chào mừng, **để** tôi có một điểm khởi đầu tập trung.
    *   **Tiêu chí Chấp nhận:** Có trang `/dashboard`, hiển thị lời chào, có các lối tắt điều hướng, giao diện đơn giản.

---

## 7. Báo cáo Kết quả Checklist

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **1. Tổng quan & Mục tiêu** | | |
| 1.1. Vấn đề được xác định rõ ràng? | ✅ Pass | Vấn đề về việc thiếu công cụ ghi nhật ký hiệu quả được nêu rõ trong phần Bối cảnh. |
| 1.2. Mục tiêu có cụ thể, đo lường được (SMART)? | ✅ Pass | Các mục tiêu kinh doanh và người dùng đều có số liệu cụ thể. |
| 1.3. Người dùng mục tiêu được xác định? | ✅ Pass | PRD tham chiếu đến "Serious Learners" và "Part-time Pros". |
| **2. Yêu cầu & Phạm vi** | | |
| 2.1. Yêu cầu chức năng có rõ ràng không? | ✅ Pass | Các yêu cầu chức năng được chia thành các nhóm logic. |
| 2.2. Yêu cầu phi chức năng có được nêu không? | ✅ Pass | Các yêu cầu về kỹ thuật, bảo mật, hiệu suất đã được xác định. |
| 2.3. Phạm vi MVP có được xác định rõ ràng không? | ✅ Pass | PRD tập trung hoàn toàn vào Giai đoạn 1, AI nằm ngoài phạm vi. |
| **3. Chi tiết & Sự rõ ràng** | | |
| 3.1. Epics có logic và tuần tự không? | ✅ Pass | 3 Epics được cấu trúc theo một luồng phát triển hợp lý. |
| 3.2. User stories có rõ ràng không? | ✅ Pass | Mỗi story tuân theo định dạng "As a..., I want..., so that...". |
| 3.3. Tiêu chí chấp nhận có thể kiểm chứng được không? | ✅ Pass | Các tiêu chí chấp nhận đều cụ thể và có thể kiểm chứng. |
| **4. Sự liên kết** | | |
| 4.1. PRD có phù hợp với tài liệu nguồn không? | ✅ Pass | PRD liên kết chặt chẽ với các tài liệu nguồn. |
| 4.2. Các giả định kỹ thuật có được ghi lại không? | ✅ Pass | Phần "Các giả định kỹ thuật" ghi lại các quyết định quan trọng. |

---

## 8. Các bước tiếp theo

*   **Đối với Architect:** Bắt đầu quá trình "Tạo Kiến trúc" (Create Architecture), sử dụng PRD này để thiết kế kiến trúc kỹ thuật chi tiết.
*   **Đối với UX Expert:** Bắt đầu quá trình thiết kế wireframe/mockup chi tiết cho các màn hình chính.

---

## 9. Phụ lục

### Các câu hỏi mở
*   Cần xác định một thư viện biểu đồ cụ thể.
*   Cần làm rõ luồng xử lý dữ liệu nến cho biểu đồ.

### Ngoài phạm vi
*   Tất cả các tính năng liên quan đến AI/LLM.
*   Các trang tổng quan thống kê chi tiết.
*   Tích hợp với các nhà môi giới (broker).
*   Thông báo và cảnh báo.
*   Các tính năng cộng đồng.

### Tài liệu tham khảo
*   `docs/brief.md`
*   `docs/market-research.md`
*   `docs/brainstorming-session-results.md`
*   `docs/brownfield-architecture.md`