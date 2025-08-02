# AI-Powered Trading Support System UI/UX Specification

This document defines the user experience goals, information architecture, user flows, and visual design specifications for AI-Powered Trading Support System's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

## Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-02 | 1.0 | Initial Draft | Sally (UX Expert) |

## 1. Overall UX Goals & Principles

### Target User Personas

*   **The Serious Learner:** Các nhà giao dịch có dưới 2 năm kinh nghiệm, đang tích cực tìm kiếm một phương pháp nhất quán. Họ cần một khuôn khổ có cấu trúc để phân tích, ghi nhật ký và một cách để kiểm soát cảm xúc và xây dựng sự tự tin.
*   **The Part-time Pro:** Các nhà giao dịch có lợi nhuận nhưng không ổn định, giao dịch song song với công việc chính. Họ cần các công cụ tự động hóa tiết kiệm thời gian và giúp họ tìm ra và khắc phục những lỗ hổng nhỏ ảnh hưởng đến hiệu suất trong chiến lược của mình.

### Usability Goals

*   **Efficiency of Use:** Cho phép các nhà giao dịch ghi lại phân tích của họ với ít sự cản trở nhất, giúp họ nhanh chóng quay lại việc quan sát thị trường.
*   **Ease of Learning:** Người dùng mới có thể hoàn thành quy trình ghi nhật ký cốt lõi trong vòng chưa đầy 5 phút mà không cần hướng dẫn chi tiết.
*   **Habit Formation:** Giao diện phải đủ hấp dẫn và mang lại giá trị để khuyến khích người dùng tạo ít nhất 3 báo cáo mỗi tuần.
*   **Trust and Reliability:** Người dùng phải tin tưởng rằng dữ liệu của họ được an toàn, bảo mật và các phân tích được trình bày một cách chính xác.

### Design Principles

1.  **Clarity over Cleverness:** Ưu tiên giao tiếp rõ ràng và trình bày dữ liệu dễ hiểu hơn là các yếu tố thiết kế thẩm mỹ phức tạp. Giao diện phải chuyên nghiệp và tập trung.
2.  **Efficiency is Key:** Mỗi tương tác phải có mục đích và được tối ưu hóa cho tốc độ. Giảm thiểu số lần nhấp chuột và các bước không cần thiết.
3.  **Data-driven Confidence:** Thiết kế phải làm nổi bật dữ liệu và thông tin chi tiết, giúp người dùng đưa ra quyết định sáng suốt và cảm thấy kiểm soát được.
4.  **Progressive Disclosure:** Chỉ hiển thị những gì cần thiết vào đúng thời điểm. Tránh làm người dùng choáng ngợp bằng cách ẩn các tính năng hoặc thông tin nâng cao cho đến khi chúng được yêu cầu.

## 2. Information Architecture (IA)

### Site Map / Screen Inventory

```mermaid
graph TD
    subgraph (auth)
        A[Sign In]
        B[Sign Up]
    end

    subgraph (dashboard)
        C[Dashboard]
        D[Reports] --> D1[Report Editor: /reports/[reportId]]
        E[Assets]
        F[Methodologies]
        G[Account Settings]
    end

    A --> C
    B --> C
```

### Navigation Structure

*   **Primary Navigation (Main Sidebar):**
    *   Một thanh điều hướng dọc ở bên trái màn hình.
    *   Các mục bao gồm:
        *   Dashboard (Trang tổng quan)
        *   Reports (Quản lý Báo cáo)
        *   Assets (Quản lý Tài sản)
        *   Methodologies (Quản lý Phương pháp)

*   **User Navigation (Top-Right Header):**
    *   Một menu thả xuống (dropdown) được kích hoạt bằng avatar của người dùng.
    *   Tận dụng component `nav-user.tsx` có sẵn.
    *   Các mục bao gồm:
        *   Account Settings (Cài đặt tài khoản)
        *   Sign Out (Đăng xuất)

*   **Breadcrumb Strategy:**
    *   Breadcrumbs sẽ được hiển thị ở đầu khu vực nội dung chính trên tất cả các trang con.
    *   Ví dụ: `Home > Reports > Editing 'Analysis of EURUSD'`

## 3. User Flows

### User Flow: Create a New Analysis Report

*   **User Goal:** Để nhanh chóng và dễ dàng ghi lại một phân tích giao dịch hoàn chỉnh, bao gồm cả phân tích biểu đồ và ghi chú.
*   **Entry Points:** Nút "New Report" trên trang quản lý `Reports`.
*   **Success Criteria:** Một báo cáo phân tích mới được lưu thành công vào cơ sở dữ liệu với tất cả các thông tin đầu vào của người dùng.

#### Flow Diagram

```mermaid
graph TD
    A[User navigates to /reports] --> B{Clicks 'New Report'};
    B --> C[Modal appears: 'Create New Report'];
    C --> D[User enters Title, selects Asset & Methodology];
    D --> E{Clicks 'Create'};
    E --> F[Navigate to /reports/[newReportId]];
    F --> G[User adds analysis blocks];
    G --> H[For each block: User draws on chart & adds notes];
    H --> I{Clicks 'Save'};
    I --> J[Show success notification];
    J --> K[User returns to /reports page];

    E -- Validation Fails --> D;
    I -- Save Fails --> L[Show error notification];
```

#### Edge Cases & Error Handling:

*   **Validation Error:** Nếu người dùng không nhập tiêu đề, hệ thống sẽ hiển thị một thông báo lỗi và không cho phép tạo báo cáo.
*   **Save Error:** Nếu có lỗi khi lưu (ví dụ: mất kết nối mạng), hệ thống sẽ hiển thị một thông báo lỗi không gây gián đoạn (non-blocking) và cho phép người dùng thử lại. Trạng thái của báo cáo sẽ được giữ nguyên.
*   **Unsaved Changes:** Nếu người dùng cố gắng rời khỏi trang chỉnh sửa mà không lưu, một hộp thoại xác nhận sẽ xuất hiện để cảnh báo họ về những thay đổi chưa được lưu.

## 4. Wireframes & Mockups

*   **Primary Design Files:** Tất cả các wireframe và mockup chi tiết sẽ được tạo và duy trì trong **Figma**. Một liên kết đến dự án Figma sẽ được cung cấp ở đây khi nó được thiết lập.

### Key Screen Layouts

#### Screen: Reports Management Page (`/reports`)

*   **Purpose:** Cung cấp cho người dùng một cái nhìn tổng quan về tất cả các báo cáo phân tích của họ và cho phép họ quản lý chúng (tạo, xem, sửa, xóa).
*   **Key Elements:**
    *   **Header:** Tiêu đề trang "Analysis Reports".
    *   **Primary Action:** Nút "New Report" nổi bật.
    *   **Search/Filter:** Một thanh tìm kiếm để lọc báo cáo theo tiêu đề và các bộ lọc thả xuống để lọc theo tài sản hoặc phương pháp.
    *   **Data Table:** Một bảng hiển thị danh sách các báo cáo với các cột: `Title`, `Asset`, `Methodology`, `Last Modified`, và một cột `Actions` (Edit, Delete).
*   **Interaction Notes:** Người dùng có thể nhấp vào một hàng trong bảng để điều hướng đến trình chỉnh sửa báo cáo đó.

#### Screen: Report Editor (`/reports/[reportId]`)

*   **Purpose:** Cung cấp không gian làm việc chính để người dùng tạo và chỉnh sửa một báo cáo phân tích chi tiết.
*   **Key Elements:**
    *   **Header:** Hiển thị tiêu đề của báo cáo và breadcrumbs để điều hướng.
    *   **Main Action Buttons:** Các nút "Save", "Save as Template", và có thể là "Delete" được đặt ở vị trí dễ thấy.
    *   **Analysis Blocks Area:** Khu vực chính của trang, nơi người dùng có thể thêm, sắp xếp và xóa các khối phân tích.
    *   **Analysis Block:** Mỗi khối chứa:
        *   Một cửa sổ biểu đồ tương tác lớn.
        *   Các công cụ vẽ biểu đồ (Trendline, Rectangle).
        *   Một khu vực nhập văn bản cho ghi chú.
*   **Interaction Notes:** Các khối có thể được kéo và thả để sắp xếp lại.

#### Screen: Dashboard (`/dashboard`)

*   **Purpose:** Cung cấp một trang chủ chào mừng và một điểm khởi đầu tập trung cho người dùng sau khi đăng nhập.
*   **Key Elements (Initial Version):**
    *   **Welcome Message:** Một lời chào cá nhân hóa (ví dụ: "Welcome back, John!").
    *   **Quick Stats:** Các thẻ (cards) hiển thị các số liệu thống kê đơn giản (ví dụ: "Total Reports Created", "Most Used Asset").
    *   **Quick Actions / Shortcuts:** Các nút lớn, rõ ràng để điều hướng đến các hành động phổ biến nhất, chẳng hạn như "Create New Report" hoặc "View All Reports".
    *   **Recent Activity:** Một danh sách 5 báo cáo được chỉnh sửa gần đây nhất.
*   **Interaction Notes:** Trang tổng quan nên được thiết kế theo dạng module để dễ dàng thêm các widget mới trong tương lai.

#### Screen: Assets Management Page (`/assets`)

*   **Purpose:** Cho phép người dùng quản lý (CRUD) danh sách các tài sản giao dịch của họ (ví dụ: EUR/USD, BTC/USD, AAPL).
*   **Key Elements:**
    *   **Header:** Tiêu đề trang "Manage Assets".
    *   **Primary Action:** Nút "New Asset".
    *   **Data Table:** Một bảng hiển thị danh sách các tài sản với các cột: `Asset Name` (ví dụ: EUR/USD), `Description` (tùy chọn), và một cột `Actions` (Edit, Delete).
*   **Interaction Notes:** Việc tạo và chỉnh sửa tài sản sẽ sử dụng một hộp thoại (modal) để người dùng không phải rời khỏi trang.

#### Screen: Methodologies Management Page (`/methodologies`)

*   **Purpose:** Cho phép người dùng quản lý (CRUD) danh sách các phương pháp giao dịch của riêng họ (ví dụ: 'Supply and Demand', 'ICT', 'Wyckoff').
*   **Key Elements:**
    *   **Header:** Tiêu đề trang "Manage Methodologies".
    *   **Primary Action:** Nút "New Methodology".
    *   **Data Table:** Một bảng hiển thị danh sách các phương pháp với các cột: `Methodology Name`, `Description` (tùy chọn), và một cột `Actions` (Edit, Delete).
*   **Interaction Notes:** Tương tự như trang Assets, việc tạo và chỉnh sửa sẽ sử dụng hộp thoại (modal).

## 5. Component Library / Design System

*   **Design System Approach:** Chúng ta sẽ tuân thủ nghiêm ngặt và mở rộng hệ thống thiết kế hiện có được cung cấp bởi **Shadcn-ui** và **Tailwind CSS**. Tất cả các thành phần giao diện người dùng mới phải được xây dựng bằng cách kết hợp các nguyên mẫu (primitives) của Shadcn-ui hoặc tuân theo các nguyên tắc tạo kiểu của nó.

### Core Components

#### Component: Data Table

*   **Purpose:** Để hiển thị dữ liệu dạng bảng một cách có cấu trúc, hỗ trợ sắp xếp, lọc và phân trang.
*   **Variants:** Sẽ tạo một thành phần bao bọc (wrapper) có thể tái sử dụng xung quanh `Tanstack Table` để chuẩn hóa giao diện và hành vi trên các trang `Reports`, `Assets`, và `Methodologies`.
*   **States:** Loading, Empty, Error.

#### Component: Modal / Dialog

*   **Purpose:** Để hiển thị nội dung hoặc các form yêu cầu hành động trong một lớp phủ (overlay) mà không cần rời khỏi trang hiện tại.
*   **Usage Guidelines:** Sử dụng cho các form tạo/sửa nhanh (ví dụ: New Asset, New Methodology) và các hộp thoại xác nhận (ví dụ: "Are you sure you want to delete?").

#### Component: Button

*   **Purpose:** Kích hoạt một hành động hoặc sự kiện.
*   **Variants:**
    *   `Primary`: Cho hành động chính trên một trang (ví dụ: "New Report", "Save").
    *   `Secondary`: Cho các hành động phụ.
    *   `Destructive`: Cho các hành động có tính phá hủy (ví dụ: "Delete").
    *   `Link`: Cho các hành động điều hướng có giao diện giống như văn bản.
*   **States:** Default, Hover, Focused, Disabled.

#### Component: Form Controls (Input, Select, Textarea)

*   **Purpose:** Thu thập dữ liệu đầu vào từ người dùng.
*   **Usage Guidelines:** Luôn được liên kết với một `Label` rõ ràng. Sử dụng `Zod` và `React Hook Form` để xác thực.
*   **States:** Default, Focused, Disabled, Error.

#### Component: Card

*   **Purpose:** Nhóm các nội dung liên quan trong một vùng chứa trực quan.
*   **Usage Guidelines:** Sử dụng trên `Dashboard` để hiển thị các số liệu thống kê và các widget.

## 6. Branding & Style Guide

#### Visual Identity

*   **Brand Guidelines:** Giao diện sẽ tuân theo phong cách thẩm mỹ hiện đại, tối giản, chuyên nghiệp được thiết lập bởi **Shadcn-ui**. Trọng tâm là sự rõ ràng, chức năng và độ tin cậy.

#### Color Palette

*   Chúng ta sẽ sử dụng theme **"Slate"** mặc định của Shadcn-ui làm cơ sở.
*   **Primary/Accent:** `primary` (màu xanh dương mặc định của Shadcn) sẽ được sử dụng cho các nút hành động chính, các liên kết và các yếu tố cần sự chú ý.
*   **Destructive:** `destructive` (màu đỏ mặc định) sẽ được sử dụng cho các hành động xóa và thông báo lỗi.
*   **Neutral:** Các màu `background`, `foreground`, `card`, `border` từ theme "Slate" sẽ được sử dụng cho văn bản, đường viền và nền.

#### Typography

*   **Font Family:** **Inter**, như đã được định nghĩa trong `frontend/src/lib/font.ts`.
*   **Type Scale:**
    *   **H1 (Page Title):** 2.25rem (36px), Bold
    *   **H2 (Section Title):** 1.875rem (30px), Bold
    *   **H3 (Card Title):** 1.5rem (24px), Semi-Bold
    *   **Body:** 1rem (16px), Regular
    *   **Small/Caption:** 0.875rem (14px), Regular

#### Iconography

*   **Icon Library:** **Tabler Icons** (`@tabler/icons-react`), để đảm bảo tính nhất quán với các thành phần hiện có.
*   **Usage Guidelines:** Các biểu tượng nên được sử dụng một cách tiết kiệm để hỗ trợ việc hiểu nội dung, không phải để trang trí.

#### Spacing & Layout

*   **Grid System:** Bố cục sẽ dựa trên Flexbox và CSS Grid, được cung cấp bởi các lớp tiện ích của Tailwind CSS.
*   **Spacing Scale:** Tất cả các khoảng cách (margin, padding, gaps) phải tuân theo thang đo khoảng cách mặc định của Tailwind CSS (ví dụ: `p-4`, `m-8`, `gap-2`) để đảm bảo sự nhất quán về mặt hình ảnh.

## 7. Accessibility Requirements

*   **Compliance Target:** Mục tiêu là tuân thủ **Web Content Accessibility Guidelines (WCAG) 2.1 cấp độ AA**.

### Key Requirements

#### Visual

*   **Color Contrast:** Tất cả văn bản phải có tỷ lệ tương phản tối thiểu là **4.5:1** so với nền của nó.
*   **Focus Indicators:** Tất cả các yếu tố tương tác (liên kết, nút, trường nhập liệu) phải có một chỉ báo tiêu điểm rõ ràng và dễ thấy khi được điều hướng bằng bàn phím. Shadcn-ui cung cấp điều này theo mặc định.

#### Interaction

*   **Keyboard Navigation:** Tất cả các chức năng phải có thể truy cập và hoạt động chỉ bằng bàn phím. Thứ tự điều hướng phải logic và trực quan.
*   **Screen Reader Support:** Sử dụng các thuộc tính ARIA (Accessible Rich Internet Applications) khi cần thiết để cung cấp ngữ cảnh cho người dùng trình đọc màn hình, đặc biệt là đối với các thành phần động.

#### Content

*   **Semantic HTML:** Sử dụng các thẻ HTML có ngữ nghĩa một cách chính xác (ví dụ: `<nav>` cho điều hướng, `<main>` cho nội dung chính, `<h1>`-`<h6>` cho các tiêu đề) để tạo cấu trúc trang logic.
*   **Form Labels:** Tất cả các trường nhập liệu trong form phải được liên kết với một thẻ `<label>` rõ ràng.
*   **Alternative Text:** Tất cả các hình ảnh có ý nghĩa phải có thuộc tính `alt` mô tả nội dung của hình ảnh.

### Testing Strategy

*   Kiểm thử thủ công bằng cách chỉ sử dụng bàn phím để điều hướng.
*   Sử dụng các công cụ tự động như Lighthouse và axe DevTools để quét các vấn đề phổ biến.
*   Kiểm thử bằng trình đọc màn hình BrowserTools MCP.

## 8. Responsiveness Strategy

*   **Approach:** Thiết kế sẽ theo chiến lược **desktop-first**, tối ưu hóa cho màn hình lớn và sau đó điều chỉnh một cách hợp lý cho các màn hình nhỏ hơn như máy tính bảng và điện thoại di động.

### Breakpoints

*   Chúng ta sẽ sử dụng các điểm ngắt (breakpoints) mặc định của Tailwind CSS:
    *   `sm`: 640px
    *   `md`: 768px
    *   `lg`: 1024px
    *   `xl`: 1280px

### Adaptation Patterns

*   **Layout Changes:**
    *   Trên các màn hình nhỏ hơn (`< 1024px`), các bố cục dựa trên nhiều cột (ví dụ: trên Dashboard) sẽ chuyển thành một cột duy nhất.
    *   Các thành phần sẽ sử dụng `flex-wrap` để tự động xuống dòng khi không đủ không gian.

*   **Navigation Changes:**
    *   Trên các màn hình nhỏ hơn (`< 1024px`), sidebar điều hướng chính ở bên trái sẽ được ẩn theo mặc định và có thể được bật/tắt thông qua một nút "hamburger" ở header.

*   **Data Table Adaptation:**
    *   Trên các màn hình hẹp, các bảng dữ liệu (`Data Table`) sẽ cho phép cuộn ngang để xem tất cả các cột. Các cột quan trọng nhất sẽ được giữ lại ở bên trái.

*   **Interaction Changes:**
    *   Kích thước của các mục tiêu cảm ứng (touch targets) như nút và liên kết sẽ được đảm bảo đủ lớn để dễ dàng sử dụng trên các thiết bị cảm ứng.

## 9. Animation & Micro-interactions

*   **Motion Principles:** Chuyển động nên được sử dụng một cách có mục đích để cung cấp phản hồi và hướng dẫn người dùng, không phải để trang trí. Các hoạt ảnh phải nhanh, tinh tế và không gây cản trở.
*   **Key Animations:**
    *   **State Changes:** Sử dụng hiệu ứng mờ dần (fade) nhẹ khi các phần tử xuất hiện hoặc biến mất.
    *   **Button Clicks:** Cung cấp một hiệu ứng nhấn tinh tế để xác nhận tương tác.
    *   **Modal/Dialog:** Hộp thoại sẽ xuất hiện với hiệu ứng phóng to và mờ dần nhẹ.

## 10. Performance Considerations

*   **Page Load:** Tối ưu hóa hình ảnh và sử dụng các tính năng của Next.js như dynamic imports để giảm thời gian tải ban đầu.
*   **Interaction Response:** Đảm bảo các tương tác của người dùng có phản hồi ngay lập tức (<100ms). Sử dụng các trạng thái loading cho các hoạt động không đồng bộ.
*   **Design Strategies:** Tránh sử dụng các hình ảnh lớn, video hoặc các hoạt ảnh phức tạp có thể làm chậm hiệu suất.

## 11. Next Steps

1.  **Review:** Chia sẻ tài liệu này với các bên liên quan (PM, Architect, Devs) để thu thập phản hồi.
2.  **Visual Design:** Bắt đầu tạo các mockup chi tiết trong Figma dựa trên các wireframe và style guide đã được định nghĩa.
3.  **Handoff:** Chuẩn bị bàn giao các thiết kế và tài liệu này cho Kiến trúc sư Giao diện người dùng (Frontend Architect) để bắt đầu thiết kế kiến trúc kỹ thuật chi tiết.

## 12. Appendix

### Related Documents

*   [Product Requirements Document (PRD)](./prd.md)
*   [Project Brief](./brief.md)
*   [Market Research](./market-research.md)
*   [Brownfield Architecture](./template-architecture.md)