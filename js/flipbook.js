// MODULE TRÌNH ĐỌC SÁCH LẬT PDF 3D HOÀN MỸ (3D FLIPBOOK ENGINE)

let current3DBook = null;
let current3DPdf = null;
let active3DSheetIndex = 0; // Chỉ số tờ giấy đang lật (0 = Cover front)
let total3DSheets = 0;
let flipbookSheetsList = []; // Danh sách các DOM sheet elements
let is3DFullscreen = false;

// Các biến phục vụ thu phóng và kéo di chuyển (3D Zoom & Pan)
let zoomScale = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;
let clickPrevented = false;

// Khởi chạy trình đọc sách lật 3D
function init3DFlipbook(bookId) {
    const book = getBookById(bookId);
    if (!book) {
        showToast('Không tìm thấy đầu sách!', 'error');
        return;
    }
    
    current3DBook = book;
    current3DPdf = null;
    active3DSheetIndex = 0;
    flipbookSheetsList = [];
    
    // Reset các biến thu phóng & kéo di chuyển sách
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    isPanning = false;
    clickPrevented = false;
    update3DBookTransform();
    
    // Ghi nhận lịch sử đọc
    addToHistory(book.id);
    
    // Chuyển view sang 3D
    switchView('flipbook');
    
    // 1. Cập nhật Bìa trước 3D
    const coverFront = document.getElementById('3d-cover-front-gradient');
    const coverBack = document.getElementById('3d-cover-back-gradient');
    
    if (book.coverImage) {
        coverFront.style.backgroundImage = `url(${book.coverImage})`;
        coverFront.style.backgroundSize = 'cover';
        coverFront.style.backgroundPosition = 'center';
        
        // Ẩn các nhãn chữ đè lên vì ảnh bìa đã có sẵn tiêu đề/tác giả
        document.getElementById('3d-cover-cat').style.display = 'none';
        document.getElementById('3d-cover-title').style.display = 'none';
        document.getElementById('3d-cover-author').style.display = 'none';
        document.getElementById('3d-cover-icon').style.display = 'none';
    } else {
        coverFront.style.backgroundImage = 'none';
        coverFront.style.background = book.coverGradient;
        
        document.getElementById('3d-cover-cat').textContent = book.category.toUpperCase();
        document.getElementById('3d-cover-title').textContent = book.title;
        document.getElementById('3d-cover-author').textContent = book.author;
        document.getElementById('3d-cover-icon').className = `${book.coverIcon} cover-icon`;
        
        // Hiện lại các nhãn chữ
        document.getElementById('3d-cover-cat').style.display = 'block';
        document.getElementById('3d-cover-title').style.display = 'block';
        document.getElementById('3d-cover-author').style.display = 'block';
        document.getElementById('3d-cover-icon').style.display = 'block';
    }
    
    // Bìa sau dùng màu trơn đồng bộ
    coverBack.style.backgroundImage = 'none';
    coverBack.style.background = book.coverGradient;
    
    document.getElementById('3d-book-intro-desc').textContent = book.description;
    
    // Reset z-indexes
    document.getElementById('cover-3d-front').className = 'book-page-3d cover-page-3d';
    document.getElementById('cover-3d-front').style.zIndex = '10';
    document.getElementById('cover-3d-back').className = 'book-page-3d cover-page-3d';
    document.getElementById('cover-3d-back').style.zIndex = '-1';
    
    // Clear các trang động cũ
    const pagesContainer = document.getElementById('dynamic-3d-pages');
    pagesContainer.innerHTML = '';
    
    // 2. Kiểm tra nếu có PDF thật
    if (book.pdfUrl || book.pdfData) {
        showToast('Đang nạp file PDF 3D bằng PDF.js...', 'info');
        load3DPdf(book.pdfUrl || book.pdfData);
    } else {
        // Soạn các trang Text
        buildText3DPages(book.pages);
    }

    // 3. Đăng ký phím mũi tên điều khiển lật trang
    document.removeEventListener('keydown', handle3DKeyboardNav);
    document.addEventListener('keydown', handle3DKeyboardNav);
}

function exitFlipbook() {
    // Thoát Fullscreen nếu có
    if (is3DFullscreen) {
        toggle3DFullscreen();
    }
    
    switchView('catalog');
    current3DBook = null;
    current3DPdf = null;
    document.removeEventListener('keydown', handle3DKeyboardNav);
}

// Lắng nghe phím mũi tên lật trang
function handle3DKeyboardNav(e) {
    if (currentView !== 'flipbook') return;
    
    if (e.key === 'ArrowRight') {
        flipToNext3DPage();
    } else if (e.key === 'ArrowLeft') {
        flipToPrev3DPage();
    }
}

// ================= TẢI TỆP PDF CHO 3D CANVAS =================
function load3DPdf(pdfSource) {
    const loadingTask = pdfjsLib.getDocument(pdfSource);
    
    loadingTask.promise.then(pdf => {
        current3DPdf = pdf;
        buildPdf3DPages(pdf.numPages);
        showToast('Tải PDF 3D thành công! Bắt đầu lật sách.', 'success');
    }).catch(err => {
        console.error(err);
        showToast('Không thể tải PDF cho 3D. Sử dụng bản fallback text.', 'error');
        
        // Fallback text
        buildText3DPages([
            "<h2>Lỗi kết nối PDF</h2><p>Không thể hiển thị tệp PDF này bằng chế độ sách lật 3D do lỗi CORS hoặc đường dẫn không khả dụng.</p>",
            "<h2>Gợi ý khắc phục</h2><p>Hãy thử xem sách bằng chế độ <b>Đọc trực tuyến tiêu chuẩn</b> hoặc sử dụng tệp tài liệu nội bộ được tích hợp sẵn.</p>"
        ]);
    });
}

// ================= DỰNG CÁC TRANG SÁCH CHỮ (TEXT FALLBACK) =================
function buildText3DPages(pagesArray) {
    const pagesContainer = document.getElementById('dynamic-3d-pages');
    const sheetsCount = Math.ceil(pagesArray.length / 2);
    
    flipbookSheetsList = [document.getElementById('cover-3d-front')];
    
    for (let i = 0; i < sheetsCount; i++) {
        const sheet = document.createElement('div');
        sheet.className = 'book-page-3d';
        
        // Trang trước (Trang lẻ)
        const frontText = pagesArray[i * 2] || '';
        const pageNumFront = i * 2 + 1;
        const frontHtml = frontText ? `
            <div class="book-text-page">
                ${frontText}
                <span class="book-page-num">${pageNumFront}</span>
            </div>
        ` : '';
        
        // Trang sau (Trang chẵn)
        const backText = pagesArray[i * 2 + 1] || '';
        const pageNumBack = i * 2 + 2;
        const backHtml = backText ? `
            <div class="book-text-page">
                ${backText}
                <span class="book-page-num">${pageNumBack}</span>
            </div>
        ` : '';
        
        sheet.innerHTML = `
            <div class="page-side page-front">
                ${frontHtml}
            </div>
            <div class="page-side page-back">
                ${backHtml}
            </div>
        `;
        
        // Bắt sự kiện click mép lật trang trực tiếp
        sheet.querySelector('.page-front').onclick = (e) => {
            e.stopPropagation();
            flipToNext3DPage();
        };
        sheet.querySelector('.page-back').onclick = (e) => {
            e.stopPropagation();
            flipToPrev3DPage();
        };
        
        pagesContainer.appendChild(sheet);
        flipbookSheetsList.push(sheet);
    }
    
    flipbookSheetsList.push(document.getElementById('cover-3d-back'));
    total3DSheets = flipbookSheetsList.length;
    
    update3DSheetsLayering();
    update3DPageIndicator();
}

// ================= DỰNG CÁC TRANG SÁCH PDF (CANVAS RENDERING) =================
function buildPdf3DPages(totalPagesCount) {
    const pagesContainer = document.getElementById('dynamic-3d-pages');
    
    // Tỷ lệ tờ giấy (chẵn chục trang)
    const sheetsCount = Math.ceil(totalPagesCount / 2);
    
    flipbookSheetsList = [document.getElementById('cover-3d-front')];
    
    for (let i = 0; i < sheetsCount; i++) {
        const sheet = document.createElement('div');
        sheet.className = 'book-page-3d';
        
        const pageNumFront = i * 2 + 1;
        const pageNumBack = i * 2 + 2;
        
        sheet.innerHTML = `
            <div class="page-side page-front">
                <canvas id="pdf-3d-canvas-${pageNumFront}" class="page-canvas"></canvas>
                <span class="book-page-num">${pageNumFront}</span>
            </div>
            <div class="page-side page-back">
                ${pageNumBack <= totalPagesCount ? `
                    <canvas id="pdf-3d-canvas-${pageNumBack}" class="page-canvas"></canvas>
                    <span class="book-page-num">${pageNumBack}</span>
                ` : `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#cbd5e1; font-size:0.8rem;">Trang trống</div>`}
            </div>
        `;
        
        // Click mép lật trang
        sheet.querySelector('.page-front').onclick = (e) => {
            e.stopPropagation();
            flipToNext3DPage();
        };
        sheet.querySelector('.page-back').onclick = (e) => {
            e.stopPropagation();
            flipToPrev3DPage();
        };
        
        pagesContainer.appendChild(sheet);
        flipbookSheetsList.push(sheet);
        
        // Khởi tạo render canvas không đồng bộ (lazy loading)
        lazyRender3DPdfPage(pageNumFront);
        if (pageNumBack <= totalPagesCount) {
            lazyRender3DPdfPage(pageNumBack);
        }
    }
    
    flipbookSheetsList.push(document.getElementById('cover-3d-back'));
    total3DSheets = flipbookSheetsList.length;
    
    update3DSheetsLayering();
    update3DPageIndicator();
}

// Render PDF Page lên Canvas 3D
function lazyRender3DPdfPage(pageNum) {
    if (!current3DPdf) return;
    
    current3DPdf.getPage(pageNum).then(page => {
        const canvas = document.getElementById(`pdf-3d-canvas-${pageNum}`);
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        
        // Thiết lập độ phân giải vẽ cao hơn để chữ cực kỳ sắc nét
        const viewport = page.getViewport({ scale: 1.5 });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext);
    });
}

// ================= CÔNG THỨC THẦN KỲ TÍNH TOÁN Z-INDEX CHO CÁC SHEET SÁCH 3D =================
function update3DSheetsLayering() {
    for (let i = 0; i < total3DSheets; i++) {
        const sheet = flipbookSheetsList[i];
        if (!sheet) continue;
        
        if (i < active3DSheetIndex) {
            // Tờ giấy ĐÃ lật qua bên trái
            sheet.classList.add('flipped-page');
            sheet.style.zIndex = i; // Xếp lớp từ đáy lên trên: tờ 1 ở đáy, tờ cuối lật qua sẽ nằm trên
        } else {
            // Tờ giấy CHƯA lật (đang ở bên phải)
            sheet.classList.remove('flipped-page');
            sheet.style.zIndex = total3DSheets - i; // Xếp lớp từ trên xuống: tờ hiện tại (active) zIndex cao nhất
        }
    }
}

// ================= LẬT TRANG TIẾP THEO (NEXT) =================
function flipToNext3DPage() {
    if (active3DSheetIndex < total3DSheets - 1) {
        // Tờ giấy hiện tại
        const currentSheet = flipbookSheetsList[active3DSheetIndex];
        currentSheet.classList.add('flipping-right');
        
        active3DSheetIndex++;
        
        // Đồng bộ hiệu ứng
        update3DSheetsLayering();
        update3DPageIndicator();
        
        setTimeout(() => {
            currentSheet.classList.remove('flipping-right');
        }, 800);
    } else {
        showToast('Bạn đã đọc đến trang cuối của tài liệu!', 'info');
    }
}

// ================= LẬT TRANG TRƯỚC (PREVIOUS) =================
function flipToPrev3DPage() {
    if (active3DSheetIndex > 0) {
        active3DSheetIndex--;
        
        // Đồng bộ zIndex
        update3DSheetsLayering();
        update3DPageIndicator();
    } else {
        showToast('Bạn đang ở trang bìa mở đầu!', 'info');
    }
}

// ================= CẬP NHẬT CHỈ SỐ TRANG =================
function update3DPageIndicator() {
    const indicator = document.getElementById('flipbook-page-indicator');
    
    if (active3DSheetIndex === 0) {
        indicator.textContent = 'Trang Bìa Trước';
    } else if (active3DSheetIndex === total3DSheets - 1) {
        indicator.textContent = 'Trang Bìa Sau';
    } else {
        // Chỉ ra khoảng trang thực tế (ví dụ: Trang 1 - 2)
        const leftPage = (active3DSheetIndex - 1) * 2 + 1;
        
        let rightPage = leftPage + 1;
        if (current3DBook.pdfUrl && current3DPdf) {
            rightPage = Math.min(rightPage, current3DPdf.numPages);
        } else {
            rightPage = Math.min(rightPage, current3DBook.pages.length);
        }
        
        if (leftPage === rightPage) {
            indicator.textContent = `Trang ${leftPage}`;
        } else {
            indicator.textContent = `Trang ${leftPage} - ${rightPage}`;
        }
    }
}

// ================= TOÀN MÀN HÌNH WORKSPACE 3D =================
function toggle3DFullscreen() {
    const workspace = document.querySelector('.flipbook-workspace');
    const icon = document.querySelector('[onclick="toggle3DFullscreen()"] i');
    
    is3DFullscreen = !is3DFullscreen;
    
    if (is3DFullscreen) {
        workspace.style.position = 'fixed';
        workspace.style.top = '0';
        workspace.style.left = '0';
        workspace.style.width = '100vw';
        workspace.style.height = '100vh';
        workspace.style.zIndex = '99999';
        workspace.style.borderRadius = '0';
        icon.className = 'ri-fullscreen-exit-fill';
        showToast('Đã mở toàn màn hình trình đọc 3D. Nhấn ESC hoặc click biểu tượng để thoát.', 'success');
    } else {
        workspace.style.position = 'relative';
        workspace.style.top = 'auto';
        workspace.style.left = 'auto';
        workspace.style.width = '100%';
        workspace.style.height = 'calc(100vh - 180px)';
        workspace.style.zIndex = 'auto';
        workspace.style.borderRadius = '24px';
        icon.className = 'ri-fullscreen-fill';
    }
}

// ================= CÁC HÀM XỬ LÝ THU PHÓNG VÀ DỊCH CHUYỂN SÁCH 3D (ZOOM & PAN) =================

// Hàm cập nhật Transform (bao gồm dịch chuyển Pan và tỉ lệ Zoom)
function update3DBookTransform() {
    const container = document.getElementById('book-3d-container');
    if (container) {
        container.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
    }
}

// Phóng to / Thu nhỏ sách lật 3D bằng các nút bấm
function zoom3DBook(amount) {
    zoomScale = Math.max(0.5, Math.min(2.5, zoomScale + amount));
    update3DBookTransform();
    showToast(`Tỉ lệ thu phóng: ${Math.round(zoomScale * 100)}%`, 'success');
}

// Đặt lại tỉ lệ thu phóng và vị trí ban đầu
function reset3DBookZoom() {
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    isPanning = false;
    clickPrevented = false;
    update3DBookTransform();
    showToast('Đã đặt lại góc nhìn và độ thu phóng!', 'success');
}

// Khởi chạy lắng nghe các sự kiện thu phóng và kéo di chuyển sách lật 3D ngay lập tức
(function init3DFlipbookEvents() {
    const viewport = document.querySelector('.book-viewport');
    if (!viewport) return;
    
    // --- 1. LĂN CHUỘT ĐỂ THU PHÓNG (MOUSE WHEEL ZOOM) ---
    viewport.addEventListener('wheel', (e) => {
        // Chỉ kích hoạt thu phóng khi đang ở màn hình 3D
        if (currentView !== 'flipbook') return;
        
        e.preventDefault();
        const zoomSpeed = 0.05;
        const delta = e.deltaY < 0 ? 1 : -1;
        zoomScale = Math.max(0.5, Math.min(2.5, zoomScale + delta * zoomSpeed));
        update3DBookTransform();
    }, { passive: false });
    
    // --- 2. KÉO CHUỘT / CHẠM VUỐT ĐỂ DỊCH CHUYỂN (DRAG-TO-PAN) ---
    const handleDragStart = (clientX, clientY) => {
        if (currentView !== 'flipbook') return;
        isPanning = true;
        startX = clientX - panX;
        startY = clientY - panY;
        viewport.style.cursor = 'grabbing';
        clickPrevented = false;
    };
    
    const handleDragMove = (clientX, clientY) => {
        if (!isPanning) return;
        
        const nextPanX = clientX - startX;
        const nextPanY = clientY - startY;
        
        // Đo đạc quãng đường di chuyển từ điểm nhấp chuột ban đầu
        const deltaX = Math.abs(nextPanX - (startX + panX - clientX)); // Sửa lại tính toán đo delta kéo chính xác
        const deltaY = Math.abs(nextPanY - (startY + panY - clientY));
        
        // Nếu di chuyển nhiều hơn 5px, ta sẽ kích hoạt chặn click lật trang (clickPrevented)
        if (deltaX > 5 || deltaY > 5) {
            clickPrevented = true;
        }
        
        panX = nextPanX;
        panY = nextPanY;
        update3DBookTransform();
    };
    
    const handleDragEnd = () => {
        if (isPanning) {
            isPanning = false;
            viewport.style.cursor = 'grab';
        }
    };
    
    // Đăng ký sự kiện Chuột (Mouse Events)
    viewport.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Chỉ kéo bằng chuột trái
        handleDragStart(e.clientX, e.clientY);
    });
    
    window.addEventListener('mousemove', (e) => {
        handleDragMove(e.clientX, e.clientY);
    });
    
    window.addEventListener('mouseup', () => {
        handleDragEnd();
    });
    
    // Đăng ký sự kiện Cảm ứng (Touch Events cho thiết bị di động)
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    
    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    
    viewport.addEventListener('touchend', () => {
        handleDragEnd();
    });
    
    // --- 3. CHẶN LẬT TRANG NGOÀI Ý MUỐN KHI KÉO (CLICK INTERCEPTION) ---
    // Sử dụng giai đoạn Capturing (true) để nuốt sự kiện click trước khi nó đến .page-front/.page-back
    const bookContainer = document.getElementById('book-3d-container');
    if (bookContainer) {
        bookContainer.addEventListener('click', (e) => {
            if (clickPrevented) {
                e.stopPropagation();
                e.preventDefault();
                clickPrevented = false; // reset lại flag
            }
        }, true);
    }
})();
