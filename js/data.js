// Cơ sở dữ liệu mô phỏng của Thư viện số (LocalStorage Wrapper)

const DEFAULT_CATEGORIES = [
    { id: 'grade_10', name: 'Khối lớp 10', icon: 'ri-gradienter-line', color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { id: 'grade_11', name: 'Khối lớp 11', icon: 'ri-rocket-line', color: 'linear-gradient(135deg, #a855f7, #6b21a8)' },
    { id: 'grade_12', name: 'Khối lớp 12', icon: 'ri-medal-line', color: 'linear-gradient(135deg, #ec4899, #be185d)' }
];

const DEFAULT_SUBJECTS = [
    { id: 'math', name: 'Toán học' },
    { id: 'physics', name: 'Vật lí' },
    { id: 'chemistry', name: 'Hóa học' },
    { id: 'biology', name: 'Sinh học' },
    { id: 'informatics', name: 'Tin học' },
    { id: 'literature', name: 'Ngữ văn' },
    { id: 'history', name: 'Lịch sử' },
    { id: 'geography', name: 'Địa lí' },
    { id: 'law', name: 'Kinh tế pháp luật' }
];

const DEFAULT_TAGS = ['#Toán', '#VậtLý', '#HóaHọc', '#NgữVăn', '#LịchSử', '#SinhHọc', '#TinHọc', '#ĐịaLý', '#KinhTếPhápLuật', '#ĐạiSố', '#HìnhHọc', '#HữuCơ', '#CơHọc', '#DiTruyền', '#MạngMáyTính', '#PhápLuật', '#ĐạoHàm', '#TíchPhân', '#LiênKếtHóaHọc', '#TếBào', '#KhíQuyển', '#VănMinhCổĐại'];

const DEFAULT_BOOKS = [
    // ================= KHỐI 10 (9 CUỐN ĐẦY ĐỦ 9 MÔN HỌC) =================
    {
        id: 'book_10_math',
        title: 'Sách Giáo Khoa Toán 10 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu học tập chuẩn bộ môn Toán lớp 10 năm học mới. Bao gồm phần Đại số cơ bản, lượng giác, phương trình, hệ phương trình và Hình học tọa độ phẳng chi tiết.',
        category: 'grade_10',
        subject: 'math',
        tags: ['#Toán', '#ĐạiSố', '#HìnhHọc'],
        rating: 4.8,
        views: 1240,
        pagesCount: 4,
        coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        coverIcon: 'ri-calculator-line',
        pages: [
            "<h2>Chương I: Mệnh Đề Và Tập Hợp</h2><p>Mệnh đề toán học là một khẳng định đúng hoặc một khẳng định sai. Một khẳng định không thể vừa đúng vừa sai.</p><p>Ví dụ: 'Số 3 là một số nguyên tố' là một mệnh đề đúng. 'Hà Nội là thủ đô của Việt Nam' là một mệnh đề đúng. 'Hôm nay trời đẹp quá!' không phải là mệnh đề vì nó là câu cảm thán.</p>",
            "<h2>Tập Hợp và Các Phép Toán</h2><p>Tập hợp là một khái niệm cơ bản của toán học. Ta thường ký hiệu tập hợp bằng các chữ cái in hoa A, B, C...</p><p>Các phép toán trên tập hợp gồm:<br>1. <b>Giao của hai tập hợp (A ∩ B)</b>: gồm các phần tử vừa thuộc A vừa thuộc B.<br>2. <b>Hợp của hai tập hợp (A ∪ B)</b>: gồm các phần tử thuộc A hoặc thuộc B.<br>3. <b>Hiệu của hai tập hợp (A \\ B)</b>: gồm các phần tử thuộc A nhưng không thuộc B.</p>",
            "<h2>Chương II: Hàm Số Bậc Nhất Và Bậc Hai</h2><p>Hàm số bậc nhất có dạng y = ax + b (a ≠ 0). Tập xác định D = R. Đồ thị là một đường thẳng.</p><p>Hàm số bậc hai có dạng y = ax² + bx + c (a ≠ 0). Đồ thị là một Parabol có đỉnh I(-b/2a; -Δ/4a).</p>",
            "<h2>Bài Tập Tự Luyện Khối 10</h2><p><b>Bài 1:</b> Cho tam giác ABC có cạnh a = 8, b = 10 và góc C = 60 độ. Tính độ dài cạnh c và diện tích S của tam giác.</p><p><b>Bài 2:</b> Khảo sát sự biến thiên và vẽ đồ thị hàm số y = x² - 4x + 3.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_physics',
        title: 'Sách Giáo Khoa Vật Lí 10 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu học tập Vật lý lớp 10. Tìm hiểu thế giới vật lý vi mô và vĩ mô, các phép đo sai số cơ bản, động học chất điểm, chuyển động thẳng điều hòa, rơi tự do và ba định luật Niêu-tơn vĩ đại.',
        category: 'grade_10',
        subject: 'physics',
        tags: ['#VậtLý', '#CơHọc'],
        rating: 4.7,
        views: 1020,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        coverIcon: 'ri-radar-line',
        pages: [
            "<h2>Chương I: Động Học Chất Điểm</h2><p>Chất điểm là một vật có kích thước rất nhỏ so với phạm vi chuyển động của nó.</p><p>Chuyển động thẳng đều là chuyển động có quỹ đạo là đường thẳng và có tốc độ trung bình như nhau trên mọi quãng đường. Phương trình chuyển động: x = x₀ + v.t.</p>",
            "<h2>Chuyển Động Biến Đổi Đều & Rơi Tự Do</h2><p>Chuyển động thẳng biến đổi đều có gia tốc a không đổi theo thời gian. Phương trình li độ: x = x₀ + v₀.t + 1/2.a.t².</p><p><b>Sự rơi tự do:</b> là sự rơi của các vật chỉ dưới tác dụng của trọng lực. Chuyển động rơi tự do là chuyển động thẳng nhanh dần đều với vận tốc đầu v₀ = 0 và gia tốc g ≈ 9.8 m/s².</p>",
            "<h2>Ba Định Luật Newton</h2><p><b>1. Định luật I (Định luật quán tính)</b>: Một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không, thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.</p><p><b>2. Định luật II Newton:</b> Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Công thức: <b>F = m.a</b></p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_chemistry',
        title: 'Sách Giáo Khoa Hóa Học 10 - Chân Trời Sáng Tạo',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu hướng dẫn Hóa học lớp 10. Tìm hiểu cấu tạo hạt nhân nguyên tử, vỏ electron, bảng tuần hoàn các nguyên tố hóa học, liên kết hóa học, liên kết ion, cộng hóa trị và phản ứng oxi hóa khử.',
        category: 'grade_10',
        subject: 'chemistry',
        tags: ['#HóaHọc', '#LiênKếtHóaHọc'],
        rating: 4.8,
        views: 1150,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
        coverIcon: 'ri-bubble-chart-line',
        pages: [
            "<h2>Chương I: Cấu Tạo Nguyên Tử</h2><p>Nguyên tử là hạt vô cùng nhỏ bé và trung hòa về điện. Cấu tạo gồm:</p><p>1. **Nhân nguyên tử** ở tâm mang điện tích dương gồm các hạt **Proton** (p) và **Nơ-tron** (n). Khối lượng nguyên tử tập trung chủ yếu ở hạt nhân.<br>2. **Vỏ electron** gồm các hạt **Electron** (e) quay xung quanh nhân.</p>",
            "<h2>Vỏ Electron & Cấu Hình Electron</h2><p>Các electron chuyển động rất nhanh quanh nhân trong khu vực không gian gọi là Orbital nguyên tử (AO).</p><p>Quy tắc sắp xếp electron vào các phân lớp s, p, d, f theo thứ tự năng lượng tăng dần. Ví dụ: Natri (Na, Z=11) có cấu hình: 1s² 2s² 2p⁶ 3s¹.</p>",
            "<h2>Liên Kết Hóa Học</h2><p>Các nguyên tử liên kết với nhau để đạt được cấu hình electron bền vững của khí hiếm lớp ngoài cùng có 8 electron (Quy tắc Octet).</p><p>1. <b>Liên kết Ion:</b> hình thành bởi lực hút tĩnh điện giữa các ion mang điện tích ngược dấu.<br>2. <b>Liên kết Cộng hóa trị:</b> hình thành bằng các cặp electron dùng chung giữa hai nguyên tử.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_biology',
        title: 'Sách Giáo Khoa Sinh Học 10 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu Sinh học lớp 10 học phần Tế bào học. Khám phá các cấp độ tổ chức thế giới sống, thành phần hóa học của tế bào, cấu trúc màng tế bào nhân sơ và nhân thực, hô hấp và quang hợp.',
        category: 'grade_10',
        subject: 'biology',
        tags: ['#SinhHọc', '#TếBào'],
        rating: 4.6,
        views: 890,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
        coverIcon: 'ri-microscope-line',
        pages: [
            "<h2>Chương I: Các Cấp Độ Tổ Chức Sống</h2><p>Thế giới sống được tổ chức theo nguyên tắc thứ bậc chặt chẽ, cấp dưới làm nền tảng để xây dựng nên cấp trên.</p><p>Các cấp tổ chức cơ bản gồm:<br><b>Phân tử → Bào quan → Tế bào → Mô → Cơ quan → Hệ cơ quan → Cơ thể → Quần thể → Quần xã → Hệ sinh thái - Sinh quyển</b>.</p>",
            "<h2>Thành Phần Hóa Học Của Tế Bào</h2><p>Tế bào được cấu tạo từ các nguyên tố hóa học, trong đó C, H, O, N chiếm khoảng 96% khối lượng cơ thể sống.</p><p>Các đại phân tử hữu cơ sinh học cốt lõi gồm Cacbohidrat, Lipit, Protein và Axit Nucleic (ADN, ARN).</p>",
            "<h2>Cấu Trúc Tế Bào</h2><p>Tế bào được chia làm hai nhóm chính dựa vào cấu trúc nhân:</p><p>1. <b>Tế bào Nhân sơ (Prokaryote)</b>: Chưa có nhân hoàn chỉnh (chỉ có vùng nhân chứa ADN vòng đơn), không có hệ thống nội màng.<br>2. <b>Tế bào Nhân thực (Eukaryote)</b>: Đã có nhân hoàn chỉnh được bao bọc bởi màng nhân.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_informatics',
        title: 'Sách Giáo Khoa Tin Học 10 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu nghiên cứu khoa học máy tính lớp 10. Tìm hiểu cấu trúc máy tính cơ bản, mạng Internet toàn cầu và bước đầu lập trình cơ bản bằng ngôn ngữ Python.',
        category: 'grade_10',
        subject: 'informatics',
        tags: ['#TinHọc', '#MạngMáyTính'],
        rating: 4.8,
        views: 950,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
        coverIcon: 'ri-computer-line',
        pages: [
            "<h2>Chương I: Lập Trình Python Cơ Bản</h2><p>Python là một ngôn ngữ lập trình cấp cao, thông dịch, hướng đối tượng và cực kỳ dễ học đối với học sinh lớp 10.</p><p>Để xuất dữ liệu ra màn hình, ta dùng hàm `print()`. Ví dụ: <code>print('Hello World')</code>.</p>",
            "<h2>Cấu Trúc Lặp Trong Python</h2><p>Lặp là một trong những cấu trúc cơ bản nhất của mọi chương trình máy tính. Python hỗ trợ lặp bằng `for` và `while`.</p><p>Ví dụ lặp bằng `for` duyệt qua một dãy số:<br><code>for i in range(5):<br>    print('Lần lặp thứ', i)</code></p>",
            "<h2>Mạng Internet Và Xã Hội Số</h2><p>Mạng Internet là mạng kết nối toàn cầu của hàng triệu máy tính sử dụng bộ giao thức chuẩn TCP/IP.</p><p>Học sinh cần nắm vững quy tắc sử dụng mạng an toàn (Cybersecurity), bảo vệ thông tin mật khẩu cá nhân, phòng ngừa mạng độc hại.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_literature',
        title: 'Sách Ngữ Văn 10 - Tập 1 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tập hợp các tác phẩm văn học Việt Nam và thế giới đặc sắc trong chương trình lớp 10. Tìm hiểu sử thi cổ đại, truyện thần thoại, thơ Đường luật và nghệ thuật viết văn nghị luận.',
        category: 'grade_10',
        subject: 'literature',
        tags: ['#NgữVăn', '#VănHọc'],
        rating: 4.9,
        views: 1890,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
        coverIcon: 'ri-quill-pen-line',
        pages: [
            "<h2>Chương I: Thần Thoại Và Sử Thi Cổ Đại</h2><p>Thần thoại là một trong những thể loại tự sự dân gian ra đời sớm nhất của nhân loại. Nó phản ánh nhận thức hoang sơ của con người cổ đại về thế giới tự nhiên và nguồn gốc vũ trụ.</p>",
            "<h2>Vẻ Đẹp Sử Thi Đăm Săn</h2><p>Đoạn trích 'Chiến thắng Mtao Mxây' khắc họa trận đánh oanh liệt giữa tù trưởng Đăm Săn và kẻ thù cướp vợ Mtao Mxây để bảo vệ danh dự và buôn làng.</p><p>Nghệ thuật sử thi sử dụng biện pháp so sánh phóng đại phóng khoáng: 'Đăm Săn múa khiên, tiếng khiên kêu lạch xạch như tiếng gió bão gào rít...'.</p>",
            "<h2>Chương II: Thơ Đường Luật Trung Đại</h2><p>Thơ Đường luật là thể thơ cổ điển có quy luật niêm luật vô cùng nghiêm ngặt, phát triển rực rỡ nhất dưới triều đại nhà Đường (Trung Quốc) với các tên tuổi vĩ đại như Lý Bạch, Đỗ Phủ.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_history',
        title: 'Sách Giáo Khoa Lịch Sử 10 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu nghiên cứu Lịch sử lớp 10 học phần mở đầu. Khám phá các khái niệm sử học cơ bản, các nền văn minh cổ đại lớn trên thế giới (Ai Cập, Lưỡng Hà, Trung Hoa, Ấn Độ) và văn minh Đông Nam Á.',
        category: 'grade_10',
        subject: 'history',
        tags: ['#LịchSử', '#VănMinhCổĐại'],
        rating: 4.7,
        views: 790,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)',
        coverIcon: 'ri-ancient-gate-line',
        pages: [
            "<h2>Chương I: Sử Học Và Cuộc Sống</h2><p>Lịch sử là những gì đã diễn ra trong quá khứ của xã hội loài người. Sử học là khoa học nghiên cứu và khôi phục lại hiện thực lịch sử một cách chân thực nhất.</p>",
            "<h2>Chương II: Các Nền Văn Minh Cổ Đại Phương Đông</h2><p>Bình minh của văn minh nhân loại bắt nguồn từ các lưu vực sông lớn ở châu Á và Bắc Phi từ thiên niên kỷ thứ IV trước Công nguyên:</p><p>1. <b>Ai Cập</b>: Sông Nile, Kim Tự Tháp.<br>2. <b>Lưỡng Hà</b>: Chữ hình nêm, luật Hammurabi.<br>3. <b>Ấn Độ</b>: Phật giáo, chữ Phạn.<br>4. <b>Trung Hoa</b>: La bàn, thuốc súng, giấy viết.</p>",
            "<h2>Các Nền Văn Minh Hy Lạp - La Mã Cổ Đại</h2><p>Đặc trưng của văn minh Phương Tây cổ đại là kinh tế thương nghiệp đường biển phát triển mạnh mẽ và hình thành các đô thị bang dân chủ (Democracy) như Athens.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_geography',
        title: 'Sách Giáo Khoa Địa Lí 10 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu nghiên cứu Địa lý tự nhiên lớp 10. Tìm hiểu thạch quyển, kiến tạo mảng, khí quyển, các vành đai khí áp, hoàn lưu gió toàn cầu và quy luật phân bố dân cư.',
        category: 'grade_10',
        subject: 'geography',
        tags: ['#ĐịaLý', '#KhíQuyển'],
        rating: 4.6,
        views: 680,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1c1917 0%, #78716c 100%)',
        coverIcon: 'ri-global-line',
        pages: [
            "<h2>Chương I: Trái Đất Và Bản Đồ</h2><p>Trái Đất có dạng hình cầu hơi dẹt ở hai cực. Phép chiếu bản đồ là phương pháp biểu thị bề mặt cong của Trái Đất lên một mặt phẳng giấy.</p>",
            "<h2>Thạch Quyển & Kiến Tạo Mảng</h2><p>Thạch quyển gồm vỏ Trái Đất và phần trên cùng của manti. Bề mặt Trái Đất được chia thành các mảng kiến tạo khổng lồ di chuyển liên tục va chạm sinh ra động đất, núi lửa.</p>",
            "<h2>Khí Quyển Và Hoàn Lưu Gió</h2><p>Khí quyển là lớp không khí bao quanh Trái Đất. Các loại gió thổi thường xuyên gồm gió Tín phong, gió Tây ôn đới, gió Đông cực.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_10_law',
        title: 'Giáo Dục Kinh Tế Và Pháp Luật 10 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Khái niệm về nền kinh tế thị trường, cung cầu giá cả, ngân sách nhà nước và hệ thống pháp luật Việt Nam, hiến pháp và quyền tự do dân chủ của công dân.',
        category: 'grade_10',
        subject: 'law',
        tags: ['#KinhTếPhápLuật', '#PhápLuật'],
        rating: 4.5,
        views: 740,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
        coverIcon: 'ri-scales-3-line',
        pages: [
            "<h2>Chương I: Nền Kinh Tế Và Các Chủ Thể</h2><p>Nền kinh tế thị trường vận hành theo các quy luật cung cầu, giá cả thị trường và quy luật cạnh tranh tự do.</p><p>Các chủ thể tham gia gồm: sản xuất, tiêu dùng, trung gian và Nhà nước.</p>",
            "<h2>Thị Trường Và Cơ Chế Giá Cả</h2><p>Giá cả thị trường là số tiền phải trả cho một đơn vị hàng hóa. Khi cung lớn hơn cầu, giá cả có xu hướng giảm. Khi cầu lớn hơn cung, giá cả tăng.</p>",
            "<h2>Chương II: Hệ Thống Pháp Luật Việt Nam</h2><p>Pháp luật là hệ thống các quy tắc xử sự có tính bắt buộc chung do Nhà nước ban hành. Hiến pháp là luật cơ bản có hiệu lực pháp lý cao nhất.</p>"
        ],
        pdfUrl: ''
    },

    // ================= KHỐI 11 (9 CUỐN ĐẦY ĐỦ 9 MÔN HỌC) =================
    {
        id: 'book_11_math',
        title: 'Sách Giáo Khoa Toán 11 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Chương trình Toán học lớp 11 mới. Khám phá hàm số lượng lượng giác, dãy số cấp số cộng và cấp số nhân, giới hạn và đạo hàm căn bản.',
        category: 'grade_11',
        subject: 'math',
        tags: ['#Toán', '#ĐạiSố', '#ĐạoHàm'],
        rating: 4.8,
        views: 1540,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
        coverIcon: 'ri-calculator-fill',
        pages: [
            "<h2>Chương I: Lượng Giác & Hàm Số Lượng Giác</h2><p>Góc lượng giác biểu thị số đo quay của tia trong mặt phẳng Oxy. Các hàm số lượng giác gồm y = sin x, y = cos x, y = tan x, y = cot x.</p>",
            "<h2>Chương II: Giới Hạn & Đạo Hàm</h2><p>Giới hạn của dãy số và giới hạn của hàm số là cơ sở để định nghĩa đạo hàm. Đạo hàm biểu thị tốc độ thay đổi tức thời của đại lượng.</p>",
            "<h2>Cấp Số Cộng & Cấp Số Nhân</h2><p>Cấp số cộng có số hạng sau bằng số hạng trước cộng sai số d. Cấp số nhân nhân với công bội q.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_physics',
        title: 'Sách Giáo Khoa Vật Lí 11 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu học Vật lý 11. Dao động điều hòa của con lắc lò xo và con lắc đơn, sự lan truyền sóng cơ học và các tính chất cơ bản của sóng điện từ.',
        category: 'grade_11',
        subject: 'physics',
        tags: ['#VậtLý', '#CơHọc'],
        rating: 4.9,
        views: 1680,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1e293b 0%, #0f766e 100%)',
        coverIcon: 'ri-pulse-line',
        pages: [
            "<h2>Chương I: Dao Động Điều Hòa</h2><p>Phương trình li độ: x = A.cos(ωt + φ). Biên độ A, tần số góc ω, pha ban đầu φ. Chu kỳ T = 2π/ω.</p>",
            "<h2>Sóng Cơ Học & Sự Lan Truyền</h2><p>Sóng cơ là sự lan truyền dao động cơ trong môi trường vật chất theo thời gian. Sóng ngang vuông góc với phương truyền, sóng dọc trùng phương truyền.</p>",
            "<h2>Điện Trường & Cường Độ Điện Trường</h2><p>Điện trường là môi trường vật chất đặc biệt bao quanh các điện tích. Lực điện trường tuân theo định luật Coulomb.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_chemistry',
        title: 'Sách Giáo Khoa Hóa Học 11 - Chân Trời Sáng Tạo',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Cơ sở hóa học hữu cơ lớp 11. Giới thiệu cấu trúc phân tử hợp chất hữu cơ, hydrocacbon no, không no, thơm và dẫn xuất halogen, ancol, phenol.',
        category: 'grade_11',
        subject: 'chemistry',
        tags: ['#HóaHọc', '#HữuCơ'],
        rating: 4.7,
        views: 940,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #b45309 0%, #15803d 100%)',
        coverIcon: 'ri-test-tube-line',
        pages: [
            "<h2>Chương I: Cân Bằng Hóa Học</h2><p>Cân bằng hóa học là trạng thái của phản ứng thuận nghịch khi tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch.</p>",
            "<h2>Chương II: Hóa Học Hữu Cơ Căn Bản</h2><p>Hợp chất hữu cơ là hợp chất của Cacbon (trừ các oxit cacbon, muối cacbua, cacbonat...). Công thức cấu tạo cho biết liên kết nguyên tử.</p>",
            "<h2>Ancol Và Phenol</h2><p>Ancol có nhóm -OH liên kết trực tiếp cacbon no. Phenol có nhóm -OH liên kết trực tiếp vòng benzen.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_biology',
        title: 'Sách Giáo Khoa Sinh Học 11 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Trao đổi chất và chuyển hóa năng lượng ở thực vật và động vật. Tìm hiểu quang hợp, hô hấp, hệ tuần hoàn, hệ tiêu hóa và phản xạ thần kinh sinh học.',
        category: 'grade_11',
        subject: 'biology',
        tags: ['#SinhHọc'],
        rating: 4.6,
        views: 890,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #15803d 0%, #854d0e 100%)',
        coverIcon: 'ri-leaf-line',
        pages: [
            "<h2>Chương I: Trao Đổi Chất Ở Thực Vật</h2><p>Sự hấp thụ nước và muối khoáng ở rễ qua lông hút. Vận chuyển qua mạch gỗ (lên) và mạch rây (xuống).</p>",
            "<h2>Quang Hợp Ở Thực Vật</h2><p>Quang hợp chuyển đổi năng lượng mặt trời thành năng lượng hóa học: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ dưới tác dụng của chất diệp lục ánh sáng.</p>",
            "<h2>Hô Hấp Và Tuần Hoàn Ở Động Vật</h2><p>Hệ tuần hoàn vận chuyển oxi và dinh dưỡng nuôi tế bào. Gồm hệ tuần hoàn hở và hệ tuần hoàn kín.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_informatics',
        title: 'Sách Giáo Khoa Tin Học 11 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Khoa học máy tính lớp 11 mới. Giới thiệu cơ sở dữ liệu hệ quản trị CSDL quan hệ SQL, kiến trúc phần cứng mạng LAN và kỹ năng thiết kế web cơ bản.',
        category: 'grade_11',
        subject: 'informatics',
        tags: ['#TinHọc', '#MạngMáyTính'],
        rating: 4.7,
        views: 1120,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
        coverIcon: 'ri-database-2-line',
        pages: [
            "<h2>Chương I: Hệ Cơ Sở Dữ Liệu Quan Hệ</h2><p>Cơ sở dữ liệu (CSDL) là tập hợp dữ liệu được tổ chức có hệ thống lưu trữ trên máy tính. Hệ quản trị CSDL giúp truy xuất thông tin bằng ngôn ngữ SQL.</p>",
            "<h2>Cấu Trúc Bảng Và Khóa Chính</h2><p>Khóa chính (Primary Key) xác định duy nhất một bản ghi trong bảng. Khóa ngoại liên kết các bảng dữ liệu với nhau.</p>",
            "<h2>Kỹ Năng Thiết Kế Website Căn Bản</h2><p>HTML định nghĩa cấu trúc nội dung, CSS làm đẹp phong cách và JavaScript tạo tương tác cho trang web.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_literature',
        title: 'Sách Ngữ Văn 11 - Tập 1 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Các tác phẩm văn học Việt Nam thời kỳ đổi mới và văn học lãng mạn thế kỷ XX. Học cách phân tích nhân vật, phân tích tác phẩm tự sự, kịch nghệ và phóng sự thơ ca.',
        category: 'grade_11',
        subject: 'literature',
        tags: ['#NgữVăn', '#VănHọc'],
        rating: 4.8,
        views: 1410,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #4c1d95 0%, #9d174d 100%)',
        coverIcon: 'ri-quill-pen-fill',
        pages: [
            "<h2>Chương I: Thơ Lãng Mạn Việt Nam 1930 - 1945</h2><p>Phong trào Thơ mới bùng nổ giải phóng cái tôi cá nhân lãng mạn. Các tác gia nổi tiếng Xuân Diệu, Huy Cận, Hàn Mặc Tử, Chế Lan Viên.</p>",
            "<h2>Văn Xuôi Tự Sự Hiện Thực</h2><p>Các tác phẩm phơi bày hiện thực đời sống nghèo khổ dưới ách áp bức thực dân phong kiến: Nam Cao (Chí Phèo), Ngô Tất Tố (Tắt Đèn).</p>",
            "<h2>Phương Pháp Viết Văn Nghị Luận Lớp 11</h2><p>Phân tích sâu sắc giá trị nội dung tư tưởng và giá trị nghệ thuật của tác phẩm văn học.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_history',
        title: 'Sách Giáo Khoa Lịch Sử 11 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu biên soạn Lịch sử lớp 11 hệ thống mới. Tìm hiểu các cuộc cách mạng tư sản, lịch sử khu vực Đông Nam Á, và lịch sử dựng nước, giữ nước của dân tộc Việt Nam.',
        category: 'grade_11',
        subject: 'history',
        tags: ['#LịchSử'],
        rating: 4.6,
        views: 1420,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
        coverIcon: 'ri-ancient-gate-line',
        pages: [
            "<h2>Chương I: Các Cuộc Cách Mạng Tư Sản</h2><p>Từ thế kỷ XVI đến thế kỷ XVIII, các cuộc cách mạng tư sản bùng nổ mạnh mẽ ở châu Âu và Bắc Mỹ, đánh đổ chế độ phong kiến lỗi thời, mở đường cho chủ nghĩa tư bản phát triển.</p>",
            "<h2>Chương II: Đông Nam Á Thời Cận Đại</h2><p>Từ cuối thế kỷ XIX, các nước đế quốc phương Tây đẩy mạnh xâm lược biến hầu hết các quốc gia Đông Nam Á thành thuộc thuộc địa.</p>",
            "<h2>Dân Tộc Việt Nam Kháng Chiến</h2><p>Lịch sử hào hùng chống ngoại xâm giữ vững bờ cõi lãnh thổ non sông của nhân dân ta qua các triều đại lịch sử.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_geography',
        title: 'Sách Giáo Khoa Địa Lí 11 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Địa lí kinh tế - xã hội thế giới. Tìm hiểu xu hướng toàn cầu hóa, khu vực hóa, tìm hiểu địa lí khu vực Đông Nam Á, Hoa Kỳ, EU và Nhật Bản.',
        category: 'grade_11',
        subject: 'geography',
        tags: ['#ĐịaLý'],
        rating: 4.6,
        views: 820,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #075985 0%, #0369a1 100%)',
        coverIcon: 'ri-earth-line',
        pages: [
            "<h2>Chương I: Toàn Cầu Hóa Kinh Tế</h2><p>Toàn cầu hóa là quá trình liên kết các quốc gia trên thế giới về nhiều mặt: kinh tế, văn hóa, khoa học kỹ thuật...</p>",
            "<h2>Khu Vực Liên Minh Châu Âu (EU)</h2><p>Liên minh châu Âu được thành lập năm 1957 là liên minh kinh tế lớn nhất và có mức độ hội nhập sâu sắc nhất thế giới.</p>",
            "<h2>Địa lí Khu vực Đông Nam Á (ASEAN)</h2><p>Hiệp hội các quốc gia Đông Nam Á (ASEAN) thành lập ngày 8/8/1967 tại Bangkok. Nền kinh tế trẻ năng động.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_11_law',
        title: 'Giáo Dục Kinh Tế Và Pháp Luật 11 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Học tập về các quyền và nghĩa vụ công dân, tìm hiểu luật dân sự, luật hình sự cơ bản, ý thức tuân thủ pháp luật và văn hóa sống thượng tôn pháp luật.',
        category: 'grade_11',
        subject: 'law',
        tags: ['#KinhTếPhápLuật', '#PhápLuật'],
        rating: 4.7,
        views: 990,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
        coverIcon: 'ri-scales-line',
        pages: [
            "<h2>Chương I: Ý Thức Pháp Luật Học Đường</h2><p>Quyền và nghĩa vụ của học sinh khối 11. Các quy tắc ứng xử văn minh học đường, phòng chống bạo lực và tuân thủ nội quy trường học.</p>",
            "<h2>Luật Dân Sự Cơ Bản</h2><p>Điều tiết các quan hệ tài sản và quan hệ nhân thân giữa các cá nhân, tổ chức trên nguyên tắc bình đẳng, tự nguyện.</p>",
            "<h2>Văn Hóa Sống Thượng Tôn Pháp Luật</h2><p>Mỗi công dân cần hình thành thói quen sống và làm việc theo Hiến pháp và pháp luật, chung tay xây dựng xã hội thượng tôn công lý.</p>"
        ],
        pdfUrl: ''
    },

    // ================= KHỐI 12 (9 CUỐN ĐẦY ĐỦ 9 MÔN HỌC) =================
    {
        id: 'book_12_math',
        title: 'Sách Giáo Khoa Toán 12 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Chương trình Toán học lớp 12 phục vụ thi tốt nghiệp THPT. Khảo sát hàm số nâng cao, Nguyên hàm, Tích phân và Hình học giải tích không gian Oxyz chuyên sâu.',
        category: 'grade_12',
        subject: 'math',
        tags: ['#Toán', '#TíchPhân', '#ĐạiSố'],
        rating: 4.9,
        views: 2980,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #111827 0%, #1e1b4b 100%)',
        coverIcon: 'ri-pie-chart-line',
        pages: [
            "<h2>Chương I: Khảo Sát Sự Biến Thiên Hàm Số</h2><p>Ứng dụng đạo hàm để tìm khoảng đồng biến, nghịch biến, cực trị và tiệm cận của đồ thị hàm số bậc ba, bậc bốn trùng phương và phân thức.</p>",
            "<h2>Chương II: Nguyên Hàm Và Tích Phân</h2><p>Nguyên hàm của hàm số f(x) là F(x) thỏa mãn F'(x) = f(x). Tích phân dùng để tính diện tích hình phẳng và thể tích vật thể xoay tròn.</p>",
            "<h2>Hình Học Giải Tích Không Gian Oxyz</h2><p>Tọa độ vectơ, phương trình mặt phẳng, phương trình đường thẳng và phương trình mặt cầu trong không gian 3 chiều giải tích.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_physics',
        title: 'Sách Giáo Khoa Vật Lí 12 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Vật lý điện xoay chiều, Vật lý hạt nhân và thuyết tương đối rộng. Hỗ trợ lý thuyết sâu sắc cho kỳ thi quốc gia.',
        category: 'grade_12',
        subject: 'physics',
        tags: ['#VậtLý', '#CơHọc'],
        rating: 4.8,
        views: 2450,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #311042 0%, #1a103c 100%)',
        coverIcon: 'ri-coreos-line',
        pages: [
            "<h2>Chương I: Dòng Điện Xoay Chiều</h2><p>Dòng điện xoay chiều biến thiên tuần hoàn theo thời gian. Mạch RLC mắc nối tiếp, công suất tiêu thụ của dòng điện xoay chiều.</p>",
            "<h2>Chương II: Vật Lí Hạt Nhân</h2><p>Cấu tạo hạt nhân nguyên tử, thuyết tương đối Einstein E = m.c². Phản ứng hạt nhân, hiện tượng phóng xạ phân rã tự nhiên.</p>",
            "<h2>Thuyết Lượng Tử Ánh Sáng</h2><p>Hiện tượng quang điện trong và quang điện ngoài. Thuyết photon ánh sáng của Einstein.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_chemistry',
        title: 'Sách Giáo Khoa Hóa Học 12 - Chân Trời Sáng Tạo',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tài liệu học tập Hóa học lớp 12 chuẩn mực. Giới thiệu sâu sắc về Este, Lipit, Cacbohidrat, Polime, Amin, Amino Axit và Hóa học vô cơ nâng cao chuẩn bị thi tốt nghiệp THPT.',
        category: 'grade_12',
        subject: 'chemistry',
        tags: ['#HóaHọc', '#HữuCơ'],
        rating: 4.7,
        views: 3120,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
        coverIcon: 'ri-flask-line',
        pages: [
            "<h2>Chương I: Este Và Lipit</h2><p>Este là sản phẩm của phản ứng este hóa giữa axit cacboxylic và ancol. Thủy phân este trong môi trường kiềm gọi là phản ứng xà phòng hóa.</p>",
            "<h2>Chương II: Cacbohidrat</h2><p>Glucozơ, Saccarozơ, Tinh bột, Xenlulozơ. Phản ứng tráng bạc đặc trưng của nhóm anđehit trong Glucozơ.</p>",
            "<h2>Polime Và Vật Liệu Polime</h2><p>Chất dẻo, tơ sợi nhân tạo và cao su tổng hợp. Điều chế bằng phản ứng trùng hợp hoặc trùng ngưng.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_biology',
        title: 'Sách Giáo Khoa Sinh Học 12 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Học thuyết di truyền học tế bào, cơ chế nhân đôi ADN, phiên mã, dịch mã, và quá trình tiến hóa của sinh giới toàn cầu dành cho học sinh chuẩn bị tốt nghiệp.',
        category: 'grade_12',
        subject: 'biology',
        tags: ['#SinhHọc', '#DiTruyền'],
        rating: 4.7,
        views: 1100,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)',
        coverIcon: 'ri-dna-line',
        pages: [
            "<h2>Chương I: Cơ Chế Di Truyền Cấp Phân Tử</h2><p>ADN lưu trữ thông tin di truyền dưới dạng các nucleotide A, T, G, X. Cơ chế tự sao nhân đôi ADN theo nguyên tắc bổ sung.</p>",
            "<h2>Phiên Mã Và Dịch Mã</h2><p>ARN polymerase xúc tác tổng hợp RNA mạch khuôn. Ribosome tiến hành đọc codon dịch mã tổng hợp protein.</p>",
            "<h2>Học Thuyết Di Truyền Mendel</h2><p>Quy luật lai một cặp tính trạng phân ly và quy luật phân ly độc lập. Lai phân tích để xác định kiểu gen.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_informatics',
        title: 'Sách Giáo Khoa Tin Học 12 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tìm hiểu sâu về công nghệ mạng không dây, an ninh thông tin mạng, hệ quản trị cơ sở dữ liệu lớn Big Data và bước đầu tiếp xúc Trí tuệ nhân tạo AI.',
        category: 'grade_12',
        subject: 'informatics',
        tags: ['#TinHọc', '#MạngMáyTính'],
        rating: 4.8,
        views: 1530,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #0369a1 100%)',
        coverIcon: 'ri-terminal-box-line',
        pages: [
            "<h2>Chương I: Hệ Thống Thông Tin & Big Data</h2><p>Lưu trữ và khai thác dữ liệu khổng lồ phi cấu trúc. Cơ sở dữ liệu NoSQL phân tán vượt trội cho ứng dụng thời gian thực.</p>",
            "<h2>Mạng Không Dây & An Ninh Thông Tin</h2><p>Mật khẩu wifi, tường lửa bảo mật dữ liệu doanh nghiệp và các cuộc tấn công mạng DDoS phổ biến hiện nay.</p>",
            "<h2>Giới Thiệu Trí Tuệ Nhân Tạo (AI)</h2><p>Generative AI, mô hình ngôn ngữ lớn (LLM) thay đổi tương lai làm việc của nhân loại thế nào.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_literature',
        title: 'Sách Ngữ Văn 12 - Tập 1 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tác phẩm văn học cách mạng Việt Nam 1945 - 1975 hào hùng. Học cách viết báo cáo nghiên cứu và bình luận văn chương sâu sắc.',
        category: 'grade_12',
        subject: 'literature',
        tags: ['#NgữVăn', '#VănHọc'],
        rating: 4.9,
        views: 2610,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #581c87 0%, #0284c7 100%)',
        coverIcon: 'ri-quill-pen-fill',
        pages: [
            "<h2>Chương I: Văn Học Cách Mạng 1945 - 1975</h2><p>Chủ nghĩa anh hùng cách mạng hào hùng chiến đấu bảo vệ độc lập tự do. Tác phẩm tiêu biểu: Tuyên ngôn độc lập (Nguyễn Ái Quốc), Tây Tiến (Quang Dũng), Việt Bắc (Tố Hữu).</p>",
            "<h2>Sức Sống Của Người Dân Trong Kháng Chiến</h2><p>Truyện ngắn phản ánh cuộc sống kiên cường bất khuất anh dũng của nhân dân Tây Bắc, Tây Nguyên: Vợ chồng A Phủ (Tô Hoài), Rừng xà nu (Nguyễn Trung Thành).</p>",
            "<h2>Bình Luận Văn Chương Thi Tốt Nghiệp</h2><p>Cách viết bài văn nghị luận sắc bén, luận điểm chặt chẽ đạt điểm số tối đa kỳ thi quốc gia.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_history',
        title: 'Sách Giáo Khoa Lịch Sử 12 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Lịch sử thế giới hiện đại từ 1945 đến nay. Trật tự thế giới hai cực Yalta, chiến tranh lạnh sụp đổ và công cuộc Đổi mới vĩ đại của Việt Nam năm 1986.',
        category: 'grade_12',
        subject: 'history',
        tags: ['#LịchSử'],
        rating: 4.7,
        views: 1820,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1c1917 0%, #7c2d12 100%)',
        coverIcon: 'ri-treasure-map-line',
        pages: [
            "<h2>Chương I: Trật Tự Thế Giới Mới Sau Chiến Tranh</h2><p>Sự hình thành trật tự hai cực Yalta đối đầu Xô-Mỹ. Hệ thống Liên Hợp Quốc giữ vai trò hòa bình toàn cầu.</p>",
            "<h2>Chương II: Việt Nam Đấu Tranh Giải Phóng Dân Tộc</h2><p>Kháng chiến chống Pháp (1945-1954) kết thúc bằng chiến thắng Điện Biên Phủ chấn động địa cầu, kháng chiến chống Mỹ (1954-1975) giải phóng miền Nam thống nhất đất nước.</p>",
            "<h2>Công Cuộc Đổi Mới Năm 1986</h2><p>Đại hội Đảng lần thứ VI mở ra kỷ nguyên đổi mới tư duy kinh tế thị trường định hướng XHCN, đưa Việt Nam hội nhập phát triển rực rỡ.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_geography',
        title: 'Sách Giáo Khoa Địa Lí 12 - Kết Nối Tri Thức',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Địa lí tự nhiên và Địa lí kinh tế Việt Nam. Cơ cấu các ngành nông nghiệp, công nghiệp, dịch vụ và phân hóa lãnh thổ kinh tế nước nhà.',
        category: 'grade_12',
        subject: 'geography',
        tags: ['#ĐịaLý'],
        rating: 4.8,
        views: 1740,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #0284c7 0%, #15803d 100%)',
        coverIcon: 'ri-map-pin-2-fill',
        pages: [
            "<h2>Chương I: Địa Lí Tự Nhiên Việt Nam</h2><p>Vị trí địa lý nước ta nằm ở rìa phía đông bán đảo Đông Dương, trung tâm Đông Nam Á. Đất nước nhiều đồi núi, khí hậu nhiệt đới ẩm gió mùa đặc trưng.</p>",
            "<h2>Địa Lí Các Ngành Kinh Tế</h2><p>Nông nghiệp chuyển dịch theo hướng hiện đại chất lượng cao. Công nghiệp đẩy mạnh chế biến chế tạo, dịch vụ du lịch trở thành ngành kinh tế mũi nhọn.</p>",
            "<h2>Các Vùng Kinh Tế Trọng Điểm</h2><p>Bảy vùng địa lí kinh tế nước nhà. Sự phát triển vượt trội của Vùng kinh tế trọng điểm phía Nam và Bắc Bộ.</p>"
        ],
        pdfUrl: ''
    },
    {
        id: 'book_12_law',
        title: 'Giáo Dục Kinh Tế Và Pháp Luật 12 - Cánh Diều',
        author: 'Bộ Giáo Dục và Đào Tạo',
        description: 'Tìm hiểu kỹ năng khởi nghiệp và pháp lý doanh nghiệp cơ bản, luật lao động, luật hôn nhân gia đình và nghĩa vụ đóng góp thuế của công dân.',
        category: 'grade_12',
        subject: 'law',
        tags: ['#KinhTếPhápLuật', '#PhápLuật'],
        rating: 4.8,
        views: 1390,
        pagesCount: 3,
        coverGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        coverIcon: 'ri-scales-3-fill',
        pages: [
            "<h2>Chương I: Khởi Nghiệp & Doanh Nghiệp</h2><p>Các hình thức pháp lý của doanh nghiệp (công ty TNHH, cổ phần, tư nhân). Kỹ năng lập kế hoạch kinh doanh và quản trị tài chính cơ bản.</p>",
            "<h2>Luật Lao Động Cần Biết</h2><p>Hợp đồng lao động, thời gian làm việc nghỉ ngơi, bảo hiểm xã hội và bảo vệ quyền lợi chính đáng của người lao động Việt Nam.</p>",
            "<h2>Nghĩa Vụ Thuế Của Công Dân</h2><p>Thuế là nguồn thu chủ yếu của ngân sách nhà nước. Công dân nộp thuế thu nhập cá nhân, doanh nghiệp nộp thuế TNDN để xây dựng đất nước giàu mạnh.</p>"
        ],
        pdfUrl: ''
    }
];

// Khởi tạo cơ sở dữ liệu sách ban đầu trong LocalStorage nếu chưa có (Dùng phiên bản v5 hỗ trợ đầy đủ 27 cuốn sách cho cả 3 khối)
function initDatabase() {
    if (!localStorage.getItem('dl_school_books_v5')) {
        localStorage.setItem('dl_school_books_v5', JSON.stringify(DEFAULT_BOOKS));
    }
    if (!localStorage.getItem('dl_school_categories_v5')) {
        localStorage.setItem('dl_school_categories_v5', JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem('dl_school_subjects_v5')) {
        localStorage.setItem('dl_school_subjects_v5', JSON.stringify(DEFAULT_SUBJECTS));
    }
    if (!localStorage.getItem('dl_school_tags_v5')) {
        localStorage.setItem('dl_school_tags_v5', JSON.stringify(DEFAULT_TAGS));
    }
}

// Lấy danh sách sách từ LocalStorage
function getBooks() {
    initDatabase();
    return JSON.parse(localStorage.getItem('dl_school_books_v5'));
}

// Lưu danh sách sách vào LocalStorage
function saveBooks(books) {
    localStorage.setItem('dl_school_books_v5', JSON.stringify(books));
}

// Lấy chi tiết sách theo ID
function getBookById(id) {
    const books = getBooks();
    return books.find(b => b.id === id);
}

// Thêm hoặc cập nhật sách
function upsertBook(bookData) {
    const books = getBooks();
    if (bookData.id) {
        // Cập nhật sách hiện tại
        const index = books.findIndex(b => b.id === bookData.id);
        if (index !== -1) {
            books[index] = { ...books[index], ...bookData };
            saveBooks(books);
            return books[index];
        }
    }
    
    // Thêm mới
    const newBook = {
        id: 'book_' + Date.now(),
        rating: 5.0,
        views: 0,
        pagesCount: bookData.pages ? bookData.pages.length : 1,
        coverGradient: bookData.coverGradient || 'linear-gradient(135deg, #4b5563, #1f2937)',
        coverIcon: bookData.coverIcon || 'ri-book-open-line',
        subject: bookData.subject || 'math', // mặc định là toán
        ...bookData
    };
    books.push(newBook);
    saveBooks(books);
    
    // Cập nhật danh sách tag nếu có tag mới
    if (bookData.tags) {
        const currentTags = getTags();
        let updated = false;
        bookData.tags.forEach(t => {
            if (!currentTags.includes(t)) {
                currentTags.push(t);
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem('dl_school_tags_v5', JSON.stringify(currentTags));
        }
    }
    return newBook;
}

// Xóa sách
function deleteBook(id) {
    let books = getBooks();
    books = books.filter(b => b.id !== id);
    saveBooks(books);
    return true;
}

// Lấy danh sách categories (Khối lớp)
function getCategories() {
    initDatabase();
    return JSON.parse(localStorage.getItem('dl_school_categories_v5'));
}

// Lấy danh sách subjects (Môn học)
function getSubjects() {
    initDatabase();
    return JSON.parse(localStorage.getItem('dl_school_subjects_v5'));
}

// Lấy danh sách tag
function getTags() {
    initDatabase();
    return JSON.parse(localStorage.getItem('dl_school_tags_v5'));
}

// Tăng lượt xem sách
function incrementViews(id) {
    const books = getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
        books[index].views = (books[index].views || 0) + 1;
        saveBooks(books);
    }
}
