// MODULE QUẢN TRỊ HỆ THỐNG - QUẢN LÝ SÁCH & PHÂN QUYỀN (ADMIN CONSOLE)

let currentAdminTab = 'books';
let localUploadedPdfData = ''; // Lưu Object URL tệp PDF tải lên cục bộ
let localUploadedCoverData = ''; // Lưu dữ liệu ảnh bìa dạng nén base64 tải lên cục bộ
let formActiveTags = []; // Tags đang gõ trong form

function renderAdminDashboard() {
    renderAdminBooksTable();
    renderAdminUsersTable();
    
    // Nạp Categories vào form select dropdown
    const catSelect = document.getElementById('form-book-category');
    catSelect.innerHTML = '';
    getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
    });

    // Nạp Subjects vào form select dropdown
    const subSelect = document.getElementById('form-book-subject');
    subSelect.innerHTML = '';
    getSubjects().forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub.id;
        opt.textContent = sub.name;
        subSelect.appendChild(opt);
    });
}

function switchAdminTab(tabName) {
    currentAdminTab = tabName;
    
    const tabBtns = document.querySelectorAll('.admin-tabs-nav .admin-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`admin-tab-${tabName}`).classList.add('active');
    
    const panes = document.querySelectorAll('#admin-view .viewer-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    document.getElementById(`admin-pane-${tabName}`).classList.add('active');
    
    if (tabName === 'books') renderAdminBooksTable();
    else if (tabName === 'users') renderAdminUsersTable();
}

// ================= QUẢN LÝ TÀI LIỆU SÁCH (CRUD) =================

// Vẽ bảng danh sách sách
function renderAdminBooksTable() {
    const tbody = document.getElementById('admin-books-tbody');
    tbody.innerHTML = '';
    
    const books = getBooks();
    books.forEach(book => {
        const tr = document.createElement('tr');
        const catObj = getCategories().find(c => c.id === book.category);
        const catName = catObj ? catObj.name : book.category.toUpperCase();
        const subObj = getSubjects().find(s => s.id === book.subject);
        const subName = subObj ? subObj.name : (book.subject || 'Toán').toUpperCase();
        
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:48px; border-radius:4px; background:${book.coverGradient}; display:flex; align-items:center; justify-content:center; color:white; font-size:1.1rem; box-shadow:0 3px 6px rgba(0,0,0,0.15)">
                        <i class="${book.coverIcon}"></i>
                    </div>
                    <div>
                        <span style="font-weight:700; display:block; max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${book.title}">${book.title}</span>
                        <span style="font-size:0.72rem; color:var(--text-muted);">${book.pdfUrl || book.pdfData ? 'Định dạng: PDF' : 'Định dạng: Văn bản'}</span>
                    </div>
                </div>
            </td>
            <td>${book.author}</td>
            <td>
                <span class="badge" style="background:rgba(255,255,255,0.05); color:var(--text-main); border:1px solid var(--border-color);">${catName}</span>
                <span class="badge" style="background:rgba(6, 182, 212, 0.05); color:var(--primary); border:1px solid rgba(6, 182, 212, 0.15); margin-top:4px; display:inline-block;">${subName}</span>
            </td>
            <td>${book.views} lượt xem</td>
            <td><span style="color:#f59e0b;"><i class="ri-star-fill"></i> ${book.rating.toFixed(1)}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem; border-radius:6px;" onclick="handleEditBookClick('${book.id}')" title="Sửa thông tin"><i class="ri-edit-line"></i></button>
                    <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem; border-radius:6px; color:var(--accent); border-color:rgba(244,63,94,0.2);" onclick="handleDeleteBookClick('${book.id}')" title="Xóa sách"><i class="ri-delete-bin-line"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Xử lý Xóa Sách
function handleDeleteBookClick(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    // Check quyền hạn hành động
    if (!checkPermission('DELETE_BOOKS')) {
        showToast('Bạn không có quyền xóa sách!', 'error');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" khỏi hệ thống không? Hành động này không thể hoàn tác.`)) {
        deleteBook(bookId);
        renderAdminBooksTable();
        showToast('Đã xóa sách khỏi thư viện thành công!', 'success');
        
        // Cập nhật Discover
        renderDiscoverView();
    }
}

// Mở Form Thêm Mới
function openAddBookModal() {
    // Check quyền thêm
    if (!checkPermission('ADD_EDIT_BOOKS')) {
        showToast('Tài khoản của bạn không được phân quyền thực hiện hành động này!', 'error');
        return;
    }

    document.getElementById('add-book-modal-title').textContent = 'Thêm Tài Liệu Mới';
    document.getElementById('edit-book-id').value = '';
    
    // Reset Form fields
    document.getElementById('form-book-title').value = '';
    document.getElementById('form-book-author').value = '';
    document.getElementById('form-book-desc').value = '';
    document.getElementById('form-book-pages-text').value = '';
    document.getElementById('form-book-pdf-url').value = '';
    document.getElementById('form-book-pdf-file').value = '';
    
    // Reset cover customization
    document.getElementById('form-book-cover-gradient').value = 'linear-gradient(135deg, #4b5563, #1f2937)';
    document.getElementById('form-book-cover-icon').value = 'ri-book-open-line';
    document.getElementById('form-book-cover-image').value = '';
    document.getElementById('form-book-cover-file').value = '';
    localUploadedCoverData = '';
    
    // Reset format radio
    document.querySelector('input[name="book-format"][value="text"]').checked = true;
    toggleFormContentFields();
    
    localUploadedPdfData = '';
    formActiveTags = [];
    renderFormTagsChips();

    document.getElementById('add-book-modal').classList.add('active');
}

// Mở Form Sửa Sách
function handleEditBookClick(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    if (!checkPermission('ADD_EDIT_BOOKS')) {
        showToast('Tài khoản của bạn không được cấp quyền chỉnh sửa!', 'error');
        return;
    }

    document.getElementById('add-book-modal-title').textContent = 'Chỉnh Sửa Tài Liệu';
    document.getElementById('edit-book-id').value = book.id;
    
    document.getElementById('form-book-title').value = book.title;
    document.getElementById('form-book-author').value = book.author;
    document.getElementById('form-book-category').value = book.category;
    document.getElementById('form-book-subject').value = book.subject || 'math';
    document.getElementById('form-book-desc').value = book.description;
    
    // Nạp màu bìa và icon
    document.getElementById('form-book-cover-gradient').value = book.coverGradient || 'linear-gradient(135deg, #4b5563, #1f2937)';
    document.getElementById('form-book-cover-icon').value = book.coverIcon || 'ri-book-open-line';
    document.getElementById('form-book-cover-image').value = book.coverImage || '';
    document.getElementById('form-book-cover-file').value = '';
    localUploadedCoverData = book.coverImage || '';
    
    // Nạp định dạng và nội dung tương ứng
    if (book.pdfUrl || book.pdfData) {
        document.querySelector('input[name="book-format"][value="pdf"]').checked = true;
        document.getElementById('form-book-pdf-url').value = book.pdfUrl || '';
        localUploadedPdfData = book.pdfData || '';
    } else {
        document.querySelector('input[name="book-format"][value="text"]').checked = true;
        document.getElementById('form-book-pages-text').value = book.pages ? book.pages.join('\n[PAGE_BREAK]\n') : '';
        localUploadedPdfData = '';
    }
    toggleFormContentFields();
    
    // Nạp tags
    formActiveTags = [...book.tags];
    renderFormTagsChips();

    document.getElementById('add-book-modal').classList.add('active');
}

function closeAddBookModal() {
    document.getElementById('add-book-modal').classList.remove('active');
}

// Xử lý ẩn hiện các ô nội dung khi chuyển đổi định dạng
function toggleFormContentFields() {
    const format = document.querySelector('input[name="book-format"]:checked').value;
    const textGroup = document.getElementById('form-content-text-group');
    const pdfGroup = document.getElementById('form-content-pdf-group');
    
    if (format === 'text') {
        textGroup.style.display = 'block';
        pdfGroup.style.display = 'none';
    } else {
        textGroup.style.display = 'none';
        pdfGroup.style.display = 'block';
    }
}

// Đọc file PDF cục bộ tải lên bằng FileReader
function handleLocalPDFUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        showToast('Chỉ chấp nhận tải lên tệp định dạng PDF!', 'error');
        e.target.value = '';
        return;
    }
    
    // Tạo Object URL cục bộ để đọc an toàn không ngốn RAM
    localUploadedPdfData = URL.createObjectURL(file);
    showToast(`Đã nhận diện tệp cục bộ: ${file.name}`, 'success');
}

// Đọc và nén file hình ảnh bìa cục bộ tải lên bằng FileReader + Canvas
function handleLocalCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Chỉ chấp nhận tệp định dạng hình ảnh!', 'error');
        e.target.value = '';
        return;
    }
    
    showToast('Đang tối ưu hóa hình ảnh...', 'info');
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            // Nén ảnh về tỷ lệ chuẩn 3:4 của bìa sách (150x200 pixel) để tối ưu bộ nhớ LocalStorage
            const width = 150;
            const height = 200;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Chuyển đổi sang chuỗi base64 JPEG với chất lượng nén 0.7 cực nhẹ (~10-15KB)
            localUploadedCoverData = canvas.toDataURL('image/jpeg', 0.7);
            showToast(`Đã nạp và tối ưu hóa ảnh bìa: ${file.name}`, 'success');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Lưu Sách (Add / Edit)
function handleSaveBook(e) {
    e.preventDefault();
    
    const editId = document.getElementById('edit-book-id').value;
    const title = document.getElementById('form-book-title').value.trim();
    const author = document.getElementById('form-book-author').value.trim();
    const category = document.getElementById('form-book-category').value;
    const subject = document.getElementById('form-book-subject').value;
    const description = document.getElementById('form-book-desc').value.trim();
    const format = document.querySelector('input[name="book-format"]:checked').value;
    
    const coverGradient = document.getElementById('form-book-cover-gradient').value.trim();
    const coverIcon = document.getElementById('form-book-cover-icon').value.trim();
    const coverImage = document.getElementById('form-book-cover-image').value.trim();
    
    let bookData = {
        title,
        author,
        category,
        subject,
        description,
        coverGradient: coverGradient || 'linear-gradient(135deg, #4b5563, #1f2937)',
        coverIcon: coverIcon || 'ri-book-open-line',
        coverImage: coverImage || localUploadedCoverData || '',
        tags: formActiveTags.length > 0 ? formActiveTags : ['#TàiLiệu']
    };
    
    if (editId) {
        bookData.id = editId;
    }
    
    // Xử lý theo định dạng sách
    if (format === 'text') {
        const pagesText = document.getElementById('form-book-pages-text').value;
        // Tách trang bằng ký tự [PAGE_BREAK]
        const pages = pagesText.split('[PAGE_BREAK]').map(p => p.trim()).filter(p => p.length > 0);
        
        if (pages.length === 0) {
            showToast('Nội dung sách dạng văn bản bắt buộc phải có ít nhất 1 trang!', 'error');
            return;
        }
        
        bookData.pages = pages;
        bookData.pdfUrl = '';
        bookData.pdfData = '';
    } else {
        const pdfUrl = document.getElementById('form-book-pdf-url').value.trim();
        
        if (!pdfUrl && !localUploadedPdfData) {
            showToast('Bạn phải nhập đường dẫn URL PDF hoặc tải lên tệp PDF từ máy tính!', 'error');
            return;
        }
        
        bookData.pdfUrl = pdfUrl;
        bookData.pdfData = localUploadedPdfData; // Sẽ dùng data/object URL cục bộ nạp thẳng vào PDF.js
        bookData.pages = [];
    }
    
    // Thực thi Lưu
    upsertBook(bookData);
    
    closeAddBookModal();
    renderAdminBooksTable();
    renderDiscoverView();
    showToast(editId ? 'Cập nhật tài liệu thành công!' : 'Đã thêm tài liệu mới vào thư viện thành công!', 'success');
}

// --- QUẢN LÝ CHIPS TỪ KHÓA TRÊN FORM ---
function renderFormTagsChips() {
    const container = document.getElementById('form-tags-container');
    container.innerHTML = '';
    
    formActiveTags.forEach((tag, idx) => {
        const chip = document.createElement('div');
        chip.className = 'tag-input-chip';
        chip.innerHTML = `
            <span>${tag}</span>
            <i class="ri-close-line" onclick="removeFormTag(${idx})"></i>
        `;
        container.appendChild(chip);
    });
}

function handleTagInputKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Tránh submit form
        
        let val = e.target.value.trim();
        if (!val) return;
        
        // Thêm dấu thăng tự động nếu gõ thiếu
        if (!val.startsWith('#')) val = '#' + val;
        
        if (formActiveTags.includes(val)) {
            showToast('Từ khóa này đã tồn tại trên ấn bản!', 'error');
            return;
        }
        
        formActiveTags.push(val);
        renderFormTagsChips();
        e.target.value = '';
    }
}

function removeFormTag(idx) {
    formActiveTags.splice(idx, 1);
    renderFormTagsChips();
}


// ================= PHÂN QUYỀN TÀI KHOẢN NGƯỜI DÙNG (RBAC) =================

// Vẽ bảng thành viên
function renderAdminUsersTable() {
    const tbody = document.getElementById('admin-users-tbody');
    tbody.innerHTML = '';
    
    const users = getUsersList();
    const currentUser = getCurrentUser();
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        // Badge cho Role
        let roleBadgeClass = 'badge-user';
        if (user.role === 'admin') roleBadgeClass = 'badge-admin';
        else if (user.role === 'moderator') roleBadgeClass = 'badge-mod';
        
        // Trạng thái hoạt động
        const statusText = user.active ? 'Đang hoạt động' : 'Đã bị khóa';
        const statusBadgeClass = user.active ? 'badge-active' : 'badge-inactive';
        
        // Tạo select vai trò
        const isSelf = user.id === currentUser.id;
        const disableSelect = isSelf ? 'disabled' : '';
        
        tr.innerHTML = `
            <td><code>${user.id}</code></td>
            <td><b>${user.name}</b> ${isSelf ? '<span style="color:var(--primary); font-size:0.75rem;">(Tài khoản của bạn)</span>' : ''}</td>
            <td>${user.email}</td>
            <td>
                <select class="sort-select" style="padding:4px 10px; font-size:0.8rem;" ${disableSelect} onchange="handleRoleChange('${user.id}', this.value)">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Reader (Độc giả)</option>
                    <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator (Kiểm duyệt viên)</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin (Quản trị viên)</option>
                </select>
            </td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>
                ${isSelf ? `
                    <span style="font-size:0.78rem; color:var(--text-muted);">Không thể thao tác trên tài khoản của bạn</span>
                ` : `
                    <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.75rem; border-radius:6px; color: ${user.active ? 'var(--accent)' : '#10b981'}; border-color: ${user.active ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}" onclick="handleToggleUserStatus('${user.id}')">
                        <i class="${user.active ? 'ri-user-unfollow-line' : 'ri-user-follow-line'}"></i> ${user.active ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                    </button>
                `}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Xử lý đổi vai trò
function handleRoleChange(userId, newRole) {
    try {
        updateUserRole(userId, newRole);
        showToast('Cập nhật vai trò người dùng thành công!', 'success');
        
        // Cập nhật lại UI Header & Switcher vì có thể tác động phân quyền hệ thống
        updateHeaderUI();
        renderAdminUsersTable();
    } catch (err) {
        showToast(err.message, 'error');
        renderAdminUsersTable(); // Khôi phục lại UI ban đầu
    }
}

// Xử lý khóa / mở khóa tài khoản
function handleToggleUserStatus(userId) {
    try {
        const isActive = toggleUserStatus(userId);
        showToast(isActive ? 'Đã kích hoạt lại tài khoản thành công!' : 'Đã khóa tài khoản thành công! Tài khoản này không còn quyền truy cập.', 'success');
        renderAdminUsersTable();
    } catch (err) {
        showToast(err.message, 'error');
    }
}
