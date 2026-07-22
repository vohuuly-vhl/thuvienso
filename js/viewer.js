// MODULE TRÌNH ĐỌC SÁCH TIÊU CHUẨN TRỰC TUYẾN (STANDARD VIEWER)

let currentViewerBook = null;
let currentViewerPage = 1;
let viewerTextSize = 1.0; // tỷ lệ font-size gốc = 1rem
let viewerTheme = 'dark'; // light, sepia, dark
let currentPdfDocument = null; // Quản lý PDF.js doc instance

// Khởi chạy trình đọc sách
function initViewer(bookId, tabToFocus = 'info') {
    const book = getBookById(bookId);
    if (!book) {
        showToast('Không tìm thấy cuốn sách yêu cầu!', 'error');
        return;
    }
    
    currentViewerBook = book;
    currentViewerPage = 1;
    currentPdfDocument = null;
    
    // Ghi nhận lịch sử đọc
    addToHistory(book.id);
    
    // Chuyển view
    switchView('viewer');
    
    // 1. Cập nhật Sidebar mô tả
    document.getElementById('viewer-sidebar-title').textContent = book.title;
    document.getElementById('viewer-sidebar-author').textContent = book.author;
    document.getElementById('viewer-sidebar-desc').textContent = book.description;
    
    // Nạp ghi chú cũ nếu có
    const udata = getUserData();
    const noteArea = document.getElementById('viewer-note-textarea');
    if (udata.notes && udata.notes[book.id]) {
        noteArea.value = udata.notes[book.id].text;
    } else {
        noteArea.value = '';
    }
    
    // 2. Chuyển sang Tab mong muốn bên Sidebar
    switchViewerTab(tabToFocus);
    
    // 3. Render Bookmarks của cuốn sách này
    renderViewerBookmarksList();

    // 4. Kiểm tra kiểu nội dung sách (PDF hay Văn bản thủ công)
    if (book.pdfUrl || book.pdfData) {
        document.getElementById('reader-text-container').style.display = 'none';
        document.getElementById('reader-canvas-container').style.display = 'flex';
        
        showToast('Đang nạp tài liệu PDF bằng PDF.js...', 'info');
        loadPdfDocument(book.pdfUrl || book.pdfData);
    } else {
        document.getElementById('reader-text-container').style.display = 'block';
        document.getElementById('reader-canvas-container').style.display = 'none';
        
        renderViewerPage();
    }
}

function exitViewer() {
    switchView('catalog');
    currentViewerBook = null;
    currentPdfDocument = null;
}

// ================= TẢI VÀ XỬ LÝ TỆP PDF.JS =================
function loadPdfDocument(pdfSource) {
    const loadingTask = pdfjsLib.getDocument(pdfSource);
    
    loadingTask.promise.then(pdf => {
        currentPdfDocument = pdf;
        currentViewerBook.pagesCount = pdf.numPages; // Cập nhật số trang thật của PDF
        
        showToast('Tải tài liệu PDF thành công!', 'success');
        renderViewerPage();
    }).catch(err => {
        console.error(err);
        showToast('Không thể nạp tệp PDF. Có thể do lỗi CORS hoặc liên kết hỏng.', 'error');
        
        // Fallback về trang văn bản trống
        document.getElementById('reader-text-container').style.display = 'block';
        document.getElementById('reader-canvas-container').style.display = 'none';
        currentViewerBook.pages = ["<h2 style='text-align:center; color:var(--accent);'>Lỗi Tải File PDF</h2><p style='text-align:center;'>Không thể hiển thị tệp PDF trực tuyến này do chính sách bảo mật CORS hoặc tệp đã bị xóa.</p>"];
        currentViewerBook.pagesCount = 1;
        renderViewerPage();
    });
}

// ================= RENDER TRANG TRÌNH ĐỌC =================
function renderViewerPage() {
    if (!currentViewerBook) return;
    
    const pageIndicator = document.getElementById('viewer-page-indicator');
    pageIndicator.textContent = `Trang ${currentViewerPage} / ${currentViewerBook.pagesCount}`;
    
    // Cập nhật nút Đánh dấu Bookmark
    updateBookmarkButtonUI();

    if (currentPdfDocument) {
        // Render trang PDF bằng PDF.js
        renderPdfPageOnCanvas();
    } else {
        // Render trang văn bản thủ công
        const contentContainer = document.getElementById('reader-text-container');
        const pageText = currentViewerBook.pages[currentViewerPage - 1] || "<p>Trang này không có nội dung.</p>";
        
        contentContainer.innerHTML = pageText;
        contentContainer.style.fontSize = `${viewerTextSize}rem`;
    }
}

// Hàm vẽ trang PDF lên canvas
function renderPdfPageOnCanvas() {
    if (!currentPdfDocument) return;
    
    currentPdfDocument.getPage(currentViewerPage).then(page => {
        const canvas = document.getElementById('pdf-viewer-canvas');
        const context = canvas.getContext('2d');
        
        // Điều chỉnh scale tối ưu theo chiều rộng màn hình đọc
        const containerWidth = document.getElementById('viewer-content-area').clientWidth - 80;
        const viewportOrig = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewportOrig.width;
        const viewport = page.getViewport({ scale: Math.min(scale, 1.5) }); // Giới hạn phóng to tối đa 1.5
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext);
    });
}

// ================= DIỄN HÀNH ĐIỀU HƯỚNG TRANG =================
function changeViewerPage(dir) {
    if (!currentViewerBook) return;
    
    const targetPage = currentViewerPage + dir;
    if (targetPage >= 1 && targetPage <= currentViewerBook.pagesCount) {
        currentViewerPage = targetPage;
        renderViewerPage();
        
        // Cuộn khung đọc về đầu trang
        document.getElementById('viewer-content-area').scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Tự nhảy đến trang xác định (dành cho bookmark link)
function jumpToViewerPage(pageNum) {
    if (pageNum >= 1 && pageNum <= currentViewerBook.pagesCount) {
        currentViewerPage = pageNum;
        renderViewerPage();
        showToast(`Đã di chuyển tới Trang ${pageNum}`, 'success');
    }
}

// ================= CÀI ĐẶT GIAO DIỆN TRÌNH ĐỌC (CỠ CHỮ, THEME) =================
function adjustTextSize(dir) {
    // Không thể zoom text nếu đang xem PDF Canvas
    if (currentPdfDocument) {
        showToast('Không hỗ trợ đổi cỡ chữ của định dạng tài liệu PDF.js!', 'error');
        return;
    }
    
    const targetSize = viewerTextSize + dir * 0.1;
    if (targetSize >= 0.7 && targetSize <= 1.8) {
        viewerTextSize = targetSize;
        document.getElementById('reader-text-container').style.fontSize = `${viewerTextSize}rem`;
    }
}

function changeReaderTheme(themeName) {
    const scroller = document.getElementById('viewer-content-area');
    
    scroller.classList.remove('reader-theme-light', 'reader-theme-sepia', 'reader-theme-dark');
    scroller.classList.add(`reader-theme-${themeName}`);
    
    viewerTheme = themeName;
}

// ================= XỬ LÝ BOOKMARKS SÁCH CÁ NHÂN =================
function triggerViewerBookmark() {
    const currUser = getCurrentUser();
    if (!currUser) {
        showToast('Bạn phải đăng nhập để dùng tính năng Bookmark!', 'error');
        openAuthModal('login');
        return;
    }
    
    const added = toggleBookmark(currentViewerBook.id, currentViewerPage);
    updateBookmarkButtonUI();
    renderViewerBookmarksList();
    
    if (added) {
        showToast(`Đã lưu bookmark Trang ${currentViewerPage}!`, 'success');
    } else {
        showToast(`Đã gỡ bookmark Trang ${currentViewerPage}!`, 'success');
    }
}

function updateBookmarkButtonUI() {
    const btn = document.getElementById('viewer-bookmark-toggle-btn');
    const currUser = getCurrentUser();
    
    if (!currUser || !currentViewerBook) {
        btn.innerHTML = `<i class="ri-bookmark-line"></i>`;
        return;
    }
    
    const udata = getUserData();
    const isBookmarked = udata.bookmarks && udata.bookmarks.some(b => b.bookId === currentViewerBook.id && b.pageNum === currentViewerPage);
    
    if (isBookmarked) {
        btn.innerHTML = `<i class="ri-bookmark-fill" style="color: var(--primary);"></i>`;
    } else {
        btn.innerHTML = `<i class="ri-bookmark-line"></i>`;
    }
}

function renderViewerBookmarksList() {
    const container = document.getElementById('viewer-bookmarks-list');
    container.innerHTML = '';
    
    const currUser = getCurrentUser();
    if (!currUser) {
        container.innerHTML = '<p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">Vui lòng đăng nhập để lưu.</p>';
        return;
    }
    
    const udata = getUserData();
    const thisBookBookmarks = udata.bookmarks ? udata.bookmarks.filter(b => b.bookId === currentViewerBook.id) : [];
    
    if (thisBookBookmarks.length === 0) {
        container.innerHTML = '<p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">Sách này chưa có bookmark nào.</p>';
        return;
    }
    
    thisBookBookmarks.sort((a,b) => a.pageNum - b.pageNum).forEach(bm => {
        const item = document.createElement('div');
        item.className = 'bookmark-list-item';
        item.innerHTML = `
            <span>Trang số ${bm.pageNum}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">${bm.date}</span>
        `;
        item.onclick = () => jumpToViewerPage(bm.pageNum);
        container.appendChild(item);
    });
}

// ================= XỬ LÝ GHI CHÚ (NOTES) =================
function saveCurrentBookNote() {
    const currUser = getCurrentUser();
    if (!currUser) {
        showToast('Bạn phải đăng nhập để viết ghi chú!', 'error');
        openAuthModal('login');
        return;
    }
    
    const noteText = document.getElementById('viewer-note-textarea').value.trim();
    if (!noteText) {
        showToast('Nội dung ghi chú trống!', 'error');
        return;
    }
    
    saveNote(currentViewerBook.id, noteText);
    showToast('Đã lưu thành công ghi chú cá nhân của bạn!', 'success');
}

// ================= SIDEBAR TABS SWITCH =================
function switchViewerTab(tabName) {
    // Ẩn tất cả panes
    const panes = document.querySelectorAll('.viewer-sidebar .viewer-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    
    // Hiện pane tương ứng
    const activePane = document.getElementById(`viewer-pane-${tabName}`);
    if (activePane) activePane.classList.add('active');
    
    // Active tabs button
    const tabBtns = document.querySelectorAll('.viewer-sidebar .viewer-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`viewer-tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');
}
