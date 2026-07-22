// MODULE ĐIỀU KHIỂN CHÍNH SPA & TÌM KIẾM HỆ THỐNG (APP ROUTER)

// Biến trạng thái toàn cục
let currentView = 'discover';
let selectedCatalogCategories = [];
let selectedCatalogSubjects = [];
let selectedCatalogTags = [];
let activeBookDetail = null;

// Khởi chạy khi tài liệu HTML đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Khởi tạo ứng dụng
function initApp() {
    // 1. Đồng bộ người dùng hiện tại & hiển thị Navbar
    updateHeaderUI();
    
    // 2. Nạp dữ liệu lên trang Discover
    renderDiscoverView();
    
    // 3. Khởi tạo bộ lọc Catalog
    initCatalogFilters();
    
    // 4. Lắng nghe sự kiện cuộn màn hình để đổi kiểu Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. Cập nhật các chỉ số stats
    updateLibraryStats();
    
    // Hiển thị chào mừng
    showToast('Chào mừng bạn đến với Thư viện số GDTX Thuận An!', 'success');
}

// ================= SPA ROUTER =================
function switchView(viewName) {
    if (viewName === 'admin' && !checkPermission('MANAGE_USERS') && !checkPermission('ADD_EDIT_BOOKS')) {
        showToast('Bạn không có quyền truy cập trang Quản trị!', 'error');
        return;
    }
    
    // Ẩn toàn bộ views
    const views = document.querySelectorAll('.spa-view');
    views.forEach(v => v.classList.remove('active-view'));
    
    // Hiện view mong muốn
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active-view');
        currentView = viewName;
    }
    
    // Cập nhật trạng thái Active trên Navigation Bar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeNavLink = document.getElementById(`nav-${viewName}`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    // Các tác vụ đặc thù khi chuyển màn hình
    if (viewName === 'shelf') {
        renderShelfView();
    } else if (viewName === 'admin') {
        renderAdminDashboard();
    } else if (viewName === 'catalog') {
        triggerSearchFilter();
    } else if (viewName === 'discover') {
        renderDiscoverView();
        updateLibraryStats();
    }
    
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= NAVBAR & AUTH UI GIAO DIỆN =================
function updateHeaderUI() {
    const authControls = document.getElementById('auth-controls');
    const navAdmin = document.getElementById('nav-admin');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Tải avatar chữ cái đầu của tên
        const firstLetter = currentUser.name.charAt(0).toUpperCase();
        let roleBadgeColor = 'var(--primary)';
        if (currentUser.role === 'admin') roleBadgeColor = '#ef4444';
        else if (currentUser.role === 'moderator') roleBadgeColor = '#eab308';
        
        authControls.innerHTML = `
            <div class="user-profile-badge">
                <div class="user-avatar" style="background: linear-gradient(135deg, ${roleBadgeColor}, var(--secondary));">${firstLetter}</div>
                <div class="user-info">
                    <span class="user-name">${currentUser.name}</span>
                    <span class="user-role-tag" style="color:${roleBadgeColor}">${currentUser.role}</span>
                </div>
                <button onclick="handleLogoutClick(event)" class="btn-icon" style="width:24px; height:24px; border:none; background:transparent; color:var(--text-muted); margin-left:8px;" title="Đăng xuất">
                    <i class="ri-logout-box-r-line"></i>
                </button>
            </div>
        `;
        
        // Hiển thị nút quản trị nếu có quyền
        if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
            navAdmin.style.display = 'block';
        } else {
            navAdmin.style.display = 'none';
        }
        
    } else {
        authControls.innerHTML = `
            <button class="btn btn-secondary" onclick="openAuthModal('login')">Đăng nhập</button>
            <button class="btn btn-primary" onclick="openAuthModal('register')">Đăng ký</button>
        `;
        navAdmin.style.display = 'none';
    }
}

function handleLogoutClick(e) {
    e.stopPropagation(); // Tránh kích hoạt click của parent profile badge
    logout();
    updateHeaderUI();
    showToast('Đăng xuất tài khoản thành công.', 'success');
    if (currentView === 'shelf' || currentView === 'admin') {
        switchView('discover');
    }
}

// ================= TRANG DISCOVER (KHÁM PHÁ) =================
function renderDiscoverView() {
    const books = getBooks();
    const categories = getCategories();
    
    // 1. Render Categories Grid
    const categoriesContainer = document.getElementById('discover-categories');
    categoriesContainer.innerHTML = '';
    categories.forEach(cat => {
        // Đếm số lượng sách thuộc danh mục này
        const count = books.filter(b => b.category === cat.id).length;
        
        const catCard = document.createElement('div');
        catCard.className = 'category-card glass-panel';
        catCard.onclick = () => selectCategoryFromDiscover(cat.id);
        catCard.innerHTML = `
            <div class="category-icon-box" style="background: ${cat.color}">
                <i class="${cat.icon}"></i>
            </div>
            <h3 class="category-name">${cat.name}</h3>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:5px; display:inline-block;">${count} ấn bản</span>
        `;
        categoriesContainer.appendChild(catCard);
    });

    // 2. Render Featured Books (Sắp xếp theo view giảm dần)
    const sortedBooks = [...books].sort((a,b) => b.views - a.views).slice(0, 4);
    const featuredContainer = document.getElementById('featured-books');
    featuredContainer.innerHTML = '';
    
    sortedBooks.forEach(book => {
        featuredContainer.appendChild(createBookCardElement(book));
    });
}

function createBookCardElement(book) {
    const card = document.createElement('div');
    card.className = 'book-card glass-panel';
    card.onclick = () => openBookDetailModal(book.id);
    
    // Tạo list tags
    const tagsHtml = book.tags.slice(0, 3).map(tag => `<span class="tag-badge">${tag}</span>`).join('');
    
    const coverHtml = book.coverImage ? `
        <div class="book-cover-mock-image" style="width:100%; height:100%; position:relative;">
            <div class="cover-spine-effect"></div>
            <img src="${book.coverImage}" style="width:100%; height:100%; object-fit:cover; display:block;" alt="${book.title}">
        </div>
    ` : `
        <div class="book-cover-mock" style="background: ${book.coverGradient}">
            <div class="cover-spine-effect"></div>
            <span class="cover-cat-badge">${book.category}</span>
            <div class="cover-center">
                <i class="${book.coverIcon} cover-icon"></i>
                <h3 class="cover-title">${book.title}</h3>
            </div>
            <span class="cover-author">${book.author}</span>
        </div>
    `;
    
    card.innerHTML = `
        <div class="book-card-cover-wrapper">
            ${coverHtml}
        </div>
        <div class="book-card-info">
            <h3 class="book-card-title" title="${book.title}">${book.title}</h3>
            <span class="book-card-author">${book.author}</span>
            <div class="book-tags-list">
                ${tagsHtml}
            </div>
            <div class="book-card-stats">
                <span class="book-card-rating"><i class="ri-star-fill"></i> ${book.rating.toFixed(1)}</span>
                <span><i class="ri-eye-line"></i> ${book.views} lượt xem</span>
            </div>
        </div>
    `;
    return card;
}

function selectCategoryFromDiscover(catId) {
    selectedCatalogCategories = [catId];
    switchView('catalog');
    
    // Sync UI với sidebar checkbox
    const checkboxes = document.querySelectorAll('#filter-categories-list .filter-item');
    checkboxes.forEach(cb => {
        if (cb.dataset.catId === catId) {
            cb.classList.add('active');
        } else {
            cb.classList.remove('active');
        }
    });
    triggerSearchFilter();
}

function updateLibraryStats() {
    const books = getBooks();
    const totalViews = books.reduce((sum, b) => sum + (b.views || 0), 0);
    const users = getUsersList().length;
    
    document.getElementById('stat-total-books').textContent = books.length;
    document.getElementById('stat-total-users').textContent = users + 15; // Cộng ảo cho đẹp mắt
    document.getElementById('stat-total-views').textContent = totalViews;
    
    // Bookmark count của người dùng hiện tại
    const currUser = getCurrentUser();
    if (currUser) {
        const udata = getUserData();
        document.getElementById('stat-total-bookmarks').textContent = udata.bookmarks ? udata.bookmarks.length : 0;
    } else {
        document.getElementById('stat-total-bookmarks').textContent = 0;
    }
}

// ================= TRANG CATALOG (BỘ LỌC TÌM KIẾM MẠNH MẼ) =================
function initCatalogFilters() {
    const categories = getCategories();
    const subjects = getSubjects();
    const tags = getTags();
    
    // 1. Nạp danh mục vào Sidebar
    const catList = document.getElementById('filter-categories-list');
    catList.innerHTML = '';
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'filter-item';
        item.dataset.catId = cat.id;
        item.innerHTML = `
            <div class="checkbox-custom"><i class="ri-check-line"></i></div>
            <span>${cat.name}</span>
        `;
        item.onclick = () => {
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                selectedCatalogCategories.push(cat.id);
            } else {
                selectedCatalogCategories = selectedCatalogCategories.filter(id => id !== cat.id);
            }
            triggerSearchFilter();
        };
        catList.appendChild(item);
    });

    // 2. Nạp môn học vào Sidebar
    const subList = document.getElementById('filter-subjects-list');
    subList.innerHTML = '';
    subjects.forEach(sub => {
        const item = document.createElement('div');
        item.className = 'filter-item';
        item.dataset.subId = sub.id;
        item.innerHTML = `
            <div class="checkbox-custom"><i class="ri-check-line"></i></div>
            <span>${sub.name}</span>
        `;
        item.onclick = () => {
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                selectedCatalogSubjects.push(sub.id);
            } else {
                selectedCatalogSubjects = selectedCatalogSubjects.filter(id => id !== sub.id);
            }
            triggerSearchFilter();
        };
        subList.appendChild(item);
    });

    // 3. Nạp tags vào Sidebar
    const tagsList = document.getElementById('filter-tags-list');
    tagsList.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag-badge';
        span.style.cursor = 'pointer';
        span.textContent = tag;
        span.onclick = () => {
            span.classList.toggle('active');
            if (span.classList.contains('active')) {
                span.style.background = 'var(--primary)';
                span.style.color = 'var(--text-inverse)';
                selectedCatalogTags.push(tag);
            } else {
                span.style.background = 'rgba(6, 182, 212, 0.08)';
                span.style.color = 'var(--primary)';
                selectedCatalogTags = selectedCatalogTags.filter(t => t !== tag);
            }
            triggerSearchFilter();
        };
        tagsList.appendChild(span);
    });
}

function resetAllFilters() {
    selectedCatalogCategories = [];
    selectedCatalogSubjects = [];
    selectedCatalogTags = [];
    document.getElementById('catalog-search-input').value = '';
    document.getElementById('catalog-sort-select').value = 'views_desc';
    
    // Reset classes sidebar
    document.querySelectorAll('#filter-categories-list .filter-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('#filter-subjects-list .filter-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('#filter-tags-list .tag-badge').forEach(t => {
        t.classList.remove('active');
        t.style.background = 'rgba(6, 182, 212, 0.08)';
        t.style.color = 'var(--primary)';
    });
    
    triggerSearchFilter();
    showToast('Đã làm trống toàn bộ bộ lọc!', 'success');
}

function handleHeroSearch(e) {
    if (e.key === 'Enter') {
        submitHeroSearch();
    }
}

function submitHeroSearch() {
    const val = document.getElementById('hero-search-input').value.trim();
    if (!val) return;
    
    switchView('catalog');
    document.getElementById('catalog-search-input').value = val;
    triggerSearchFilter();
    document.getElementById('hero-search-input').value = ''; // clear hero
}

function triggerSearchFilter() {
    const query = document.getElementById('catalog-search-input').value.toLowerCase().trim();
    const sortVal = document.getElementById('catalog-sort-select').value;
    const books = getBooks();
    
    // Tiến hành lọc nâng cao
    let filtered = books.filter(book => {
        // 1. Lọc theo từ khóa text
        const matchesQuery = book.title.toLowerCase().includes(query) || 
                             book.author.toLowerCase().includes(query) || 
                             book.description.toLowerCase().includes(query) ||
                             book.tags.some(t => t.toLowerCase().includes(query));
                             
        // 2. Lọc theo khối lớp đã chọn
        const matchesCategory = selectedCatalogCategories.length === 0 || 
                                selectedCatalogCategories.includes(book.category);
                                
        // 3. Lọc theo môn học đã chọn
        const matchesSubject = selectedCatalogSubjects.length === 0 || 
                               selectedCatalogSubjects.includes(book.subject);
                                
        // 4. Lọc theo tags đã chọn
        const matchesTags = selectedCatalogTags.length === 0 || 
                            selectedCatalogTags.some(t => book.tags.includes(t));
                            
        return matchesQuery && matchesCategory && matchesSubject && matchesTags;
    });
    
    // Tiến hành sắp xếp kết quả
    if (sortVal === 'views_desc') {
        filtered.sort((a,b) => b.views - a.views);
    } else if (sortVal === 'rating_desc') {
        filtered.sort((a,b) => b.rating - a.rating);
    } else if (sortVal === 'title_asc') {
        filtered.sort((a,b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'newest') {
        filtered.reverse(); // Dựa theo thứ tự thêm ban đầu
    }
    
    // Cập nhật giao diện
    const countLabel = document.getElementById('catalog-results-count');
    countLabel.textContent = `Tìm thấy ${filtered.length} tài liệu phù hợp`;
    
    const booksContainer = document.getElementById('catalog-books-list');
    const emptyState = document.getElementById('catalog-empty-state');
    booksContainer.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filtered.forEach(book => {
            booksContainer.appendChild(createBookCardElement(book));
        });
    }
}

// ================= TRANG KỆ SÁCH CÁ NHÂN =================
let activeShelfTab = 'bookmarks';

function switchShelfTab(tabName) {
    activeShelfTab = tabName;
    const tabBtns = document.querySelectorAll('[id^="shelf-tab-"]');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`shelf-tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const panes = document.querySelectorAll('.shelf-tab-content .viewer-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    
    const activePane = document.getElementById(`shelf-pane-${tabName}`);
    if (activePane) activePane.classList.add('active');
    
    renderShelfTabContent(tabName);
}

function renderShelfView() {
    const currUser = getCurrentUser();
    const anonPanel = document.getElementById('shelf-anonymous');
    const authPanel = document.getElementById('shelf-authenticated');
    
    if (currUser) {
        anonPanel.style.display = 'none';
        authPanel.style.display = 'block';
        switchShelfTab(activeShelfTab);
    } else {
        anonPanel.style.display = 'block';
        authPanel.style.display = 'none';
    }
}

function renderShelfTabContent(tabName) {
    const data = getUserData();
    
    if (tabName === 'bookmarks') {
        const container = document.getElementById('shelf-bookmarks-grid');
        container.innerHTML = '';
        if (!data.bookmarks || data.bookmarks.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Chưa có bookmark tài liệu nào.</div>';
            return;
        }
        
        // Nhóm các bookmarks theo sách
        const bookmarkedBookIds = [...new Set(data.bookmarks.map(b => b.bookId))];
        bookmarkedBookIds.forEach(id => {
            const bookObj = getBookById(id);
            if (bookObj) {
                container.appendChild(createBookCardElement(bookObj));
            }
        });
        
    } else if (tabName === 'history') {
        const container = document.getElementById('shelf-history-grid');
        container.innerHTML = '';
        if (!data.history || data.history.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Lịch sử đọc trống. Hãy chọn một cuốn sách để bắt đầu đọc!</div>';
            return;
        }
        
        data.history.forEach(hist => {
            const bookObj = getBookById(hist.bookId);
            if (bookObj) {
                container.appendChild(createBookCardElement(bookObj));
            }
        });
        
    } else if (tabName === 'notes') {
        const container = document.getElementById('shelf-notes-list');
        container.innerHTML = '';
        if (!data.notes || Object.keys(data.notes).length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Bạn chưa tạo ghi chú học tập nào.</div>';
            return;
        }
        
        Object.keys(data.notes).forEach(bookId => {
            const bookObj = getBookById(bookId);
            const noteInfo = data.notes[bookId];
            if (bookObj) {
                const noteCard = document.createElement('div');
                noteCard.className = 'glass-panel';
                noteCard.style.padding = '20px';
                noteCard.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:12px;">
                        <h4 style="font-family:var(--font-heading); color:var(--primary); cursor:pointer;" onclick="openBookDetailModal('${bookObj.id}')">${bookObj.title}</h4>
                        <span style="font-size:0.7rem; color:var(--text-muted);">${noteInfo.date}</span>
                    </div>
                    <p style="font-size:0.85rem; line-height:1.5; color:var(--text-muted); text-align:justify; white-space:pre-line;">${noteInfo.text}</p>
                    <button class="btn btn-secondary" style="margin-top:15px; padding:6px 12px; font-size:0.75rem;" onclick="openBookInStandardViewer('${bookObj.id}', 'notes')">Mở trình đọc</button>
                `;
                container.appendChild(noteCard);
            }
        });
    }
}

// ================= MODAL THƯ VIỆN DETAIL DIALOGS =================
function openBookDetailModal(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    activeBookDetail = book;
    
    // Tải thông tin
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = book.author;
    document.getElementById('detail-rating').textContent = book.rating.toFixed(1);
    document.getElementById('detail-views').textContent = book.views;
    document.getElementById('detail-pages').textContent = `${book.pagesCount} trang`;
    document.getElementById('detail-desc').textContent = book.description;
    
    // Vẽ cover
    const coverContainer = document.getElementById('detail-cover-target');
    
    const coverHtml = book.coverImage ? `
        <div class="book-cover-mock-image" style="width:100%; height:100%; position:relative;">
            <div class="cover-spine-effect"></div>
            <img src="${book.coverImage}" style="width:100%; height:100%; object-fit:cover; display:block;" alt="${book.title}">
        </div>
    ` : `
        <div class="book-cover-mock" style="background: ${book.coverGradient}; font-size:0.9rem; padding: 25px 15px;">
            <div class="cover-spine-effect"></div>
            <span class="cover-cat-badge" style="font-size:0.6rem;">${book.category}</span>
            <div class="cover-center">
                <i class="${book.coverIcon} cover-icon" style="font-size:2.8rem;"></i>
                <h3 class="cover-title" style="font-size:1rem; max-height:3.2rem;">${book.title}</h3>
            </div>
            <span class="cover-author" style="font-size:0.7rem;">${book.author}</span>
        </div>
    `;
    coverContainer.innerHTML = coverHtml;
    
    // Vẽ tags
    const tagsContainer = document.getElementById('detail-tags-target');
    tagsContainer.innerHTML = book.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
    
    // Bật overlay
    const modal = document.getElementById('book-detail-modal');
    modal.classList.add('active');
}

function closeBookDetailModal() {
    const modal = document.getElementById('book-detail-modal');
    modal.classList.remove('active');
    activeBookDetail = null;
}

// Chuyển sách sang các viewer
function openBookInStandardViewer(bookId = null, tabToFocus = 'info') {
    const id = bookId || (activeBookDetail ? activeBookDetail.id : null);
    if (!id) return;
    
    closeBookDetailModal();
    // Tăng lượt đọc
    incrementViews(id);
    
    // Mở Trình xem
    initViewer(id, tabToFocus);
}

function openBookIn3DFlipbook(bookId = null) {
    const id = bookId || (activeBookDetail ? activeBookDetail.id : null);
    if (!id) return;
    
    closeBookDetailModal();
    // Tăng lượt đọc
    incrementViews(id);
    
    // Khởi chạy trình đọc sách 3D
    init3DFlipbook(id);
}

// ================= AUTH MODAL (ĐĂNG NHẬP / ĐĂNG KÝ MOCK) =================
let activeAuthTab = 'login';

function openAuthModal(tab = 'login') {
    switchAuthTab(tab);
    document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
    document.getElementById('login-error-msg').style.display = 'none';
    document.getElementById('register-error-msg').style.display = 'none';
}

function switchAuthTab(tab) {
    activeAuthTab = tab;
    
    const loginBtn = document.getElementById('tab-login-btn');
    const regBtn = document.getElementById('tab-register-btn');
    
    const loginPane = document.getElementById('pane-login');
    const regPane = document.getElementById('pane-register');
    
    if (tab === 'login') {
        loginBtn.classList.add('active');
        regBtn.classList.remove('active');
        loginPane.classList.add('active');
        regPane.classList.remove('active');
    } else {
        loginBtn.classList.remove('active');
        regBtn.classList.add('active');
        loginPane.classList.remove('active');
        regPane.classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');
    
    try {
        const user = login(email, pass);
        updateHeaderUI();
        closeAuthModal();
        showToast(`Xin chào ${user.name}! Đăng nhập thành công.`, 'success');
        
        // Reset fields
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        
        // Load lại kệ sách nếu đang ở view kệ sách
        if (currentView === 'shelf') {
            renderShelfView();
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const pass = document.getElementById('register-password').value;
    const errorMsg = document.getElementById('register-error-msg');
    
    if (pass.length < 6) {
        errorMsg.textContent = 'Mật khẩu bắt buộc tối thiểu từ 6 ký tự!';
        errorMsg.style.display = 'block';
        return;
    }
    
    try {
        const user = register(name, email, pass);
        updateHeaderUI();
        closeAuthModal();
        showToast(`Chào mừng ${user.name}! Tài khoản của bạn đã sẵn sàng.`, 'success');
        
        // Reset fields
        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        
        if (currentView === 'shelf') {
            renderShelfView();
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
    }
}

// ================= HỆ THỐNG AN NINH PHÂN QUYỀN BẢO MẬT =================
// Đã loại bỏ hoàn toàn khả năng tự chuyển đổi quyền hạn ở phía máy khách.

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-checkbox-circle-line';
    else if (type === 'error') icon = 'ri-alert-line';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Tự biến mất sau 3.5 giây
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// Chức năng tắt modal khi click ra ngoài
function closeModalOnOuterClick(e, modalId) {
    if (e.target === document.getElementById(modalId)) {
        if (modalId === 'auth-modal') closeAuthModal();
        else if (modalId === 'book-detail-modal') closeBookDetailModal();
        else if (modalId === 'add-book-modal') closeAddBookModal();
    }
}

// ================= QUẢN LÝ GIAO DIỆN LIGHT/DARK THEME =================
let activeTheme = 'light'; // mặc định là light

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    
    if (activeTheme === 'light') {
        body.removeAttribute('data-theme'); // Xóa data-theme quay về mặc định :root (Dark Mode)
        icon.className = 'ri-moon-line';
        activeTheme = 'dark';
        showToast('Đã kích hoạt Giao diện Tối.', 'success');
    } else {
        body.setAttribute('data-theme', 'light');
        icon.className = 'ri-sun-line';
        activeTheme = 'light';
        showToast('Đã kích hoạt Giao diện Sáng.', 'success');
    }
}
