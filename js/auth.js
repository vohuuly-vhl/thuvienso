// Module Quản lý Xác thực và Phân quyền tài khoản (RBAC)

const DEFAULT_USERS = [
    { email: 'admin@thuvien.so', name: 'Quản trị viên Hệ thống', password: 'admin', role: 'admin', active: true, id: 'u_1' },
    { email: 'mod@thuvien.so', name: 'Kiểm duyệt viên Sách', password: 'moderator', role: 'moderator', active: true, id: 'u_2' },
    { email: 'user@thuvien.so', name: 'Độc giả Đam mê', password: 'user', role: 'user', active: true, id: 'u_3' }
];

const PERMISSIONS = {
    VIEW_BOOKS: ['admin', 'moderator', 'user'],
    READ_BOOKS: ['admin', 'moderator', 'user'],
    WRITE_REVIEWS: ['admin', 'moderator', 'user'],
    ADD_EDIT_BOOKS: ['admin', 'moderator'],
    DELETE_BOOKS: ['admin', 'moderator'],
    MANAGE_USERS: ['admin'],
    MANAGE_SETTINGS: ['admin']
};

function initUsers() {
    if (!localStorage.getItem('dl_users')) {
        localStorage.setItem('dl_users', JSON.stringify(DEFAULT_USERS));
    }
}

// Lấy danh sách toàn bộ người dùng (Chỉ Admin)
function getUsersList() {
    initUsers();
    return JSON.parse(localStorage.getItem('dl_users'));
}

// Lưu danh sách người dùng
function saveUsersList(users) {
    localStorage.setItem('dl_users', JSON.stringify(users));
}

// Đăng nhập
function login(email, password) {
    initUsers();
    const users = getUsersList();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
        throw new Error('Email hoặc mật khẩu không chính xác!');
    }
    
    if (!user.active) {
        throw new Error('Tài khoản này đã bị khóa bởi Quản trị viên!');
    }
    
    // Lưu trạng thái đăng nhập
    setCurrentUser(user);
    return user;
}

// Đăng ký tài khoản mới
function register(name, email, password) {
    initUsers();
    const users = getUsersList();
    
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        throw new Error('Email này đã được đăng ký sử dụng!');
    }
    
    const newUser = {
        id: 'u_' + Date.now(),
        name: name,
        email: email,
        password: password,
        role: 'user', // Mặc định là Reader
        active: true
    };
    
    users.push(newUser);
    saveUsersList(users);
    
    // Đăng nhập ngay sau khi đăng ký
    setCurrentUser(newUser);
    return newUser;
}

// Lấy tài khoản hiện tại đang đăng nhập
function getCurrentUser() {
    const userStr = localStorage.getItem('dl_current_user');
    if (!userStr) {
        return null;
    }
    // Lấy thông tin mới nhất từ cơ sở dữ liệu để cập nhật quyền/trạng thái khóa
    const userObj = JSON.parse(userStr);
    const users = getUsersList();
    const latestUser = users.find(u => u.id === userObj.id);
    if (latestUser && !latestUser.active) {
        logout();
        return null;
    }
    return latestUser || userObj;
}

// Lưu thông tin người dùng hiện tại
function setCurrentUser(user) {
    localStorage.setItem('dl_current_user', JSON.stringify(user));
}

// Đăng xuất
function logout() {
    localStorage.removeItem('dl_current_user');
}

// Kiểm tra quyền
function checkPermission(action) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const allowedRoles = PERMISSIONS[action];
    if (!allowedRoles) return false;
    
    return allowedRoles.includes(user.role);
}

// Cập nhật vai trò người dùng (Chỉ dành cho Admin)
function updateUserRole(userId, newRole) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Chỉ Quản trị viên mới có quyền thay đổi vai trò tài khoản!');
    }
    
    const users = getUsersList();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        throw new Error('Không tìm thấy người dùng!');
    }
    
    // Không được tự hạ vai trò của chính mình
    if (userId === currentUser.id) {
        throw new Error('Bạn không thể tự hạ quyền của tài khoản chính mình!');
    }
    
    users[index].role = newRole;
    saveUsersList(users);
    return true;
}

// Khóa hoặc mở khóa người dùng (Chỉ dành cho Admin)
function toggleUserStatus(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Chỉ Quản trị viên mới có quyền thay đổi trạng thái tài khoản!');
    }
    
    const users = getUsersList();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        throw new Error('Không tìm thấy người dùng!');
    }
    
    // Không được tự khóa chính mình
    if (userId === currentUser.id) {
        throw new Error('Bạn không thể tự khóa tài khoản chính mình!');
    }
    
    users[index].active = !users[index].active;
    saveUsersList(users);
    return users[index].active;
}

// Lấy lịch sử đọc sách và bookmarks của người dùng hiện tại
function getUserData() {
    const user = getCurrentUser();
    if (!user) return { bookmarks: [], history: [], notes: {} };
    
    const key = `dl_userdata_${user.id}`;
    let data = localStorage.getItem(key);
    if (!data) {
        data = JSON.stringify({ bookmarks: [], history: [], notes: {} });
        localStorage.setItem(key, data);
    }
    return JSON.parse(data);
}

// Lưu dữ liệu cá nhân của người dùng
function saveUserData(data) {
    const user = getCurrentUser();
    if (!user) return;
    const key = `dl_userdata_${user.id}`;
    localStorage.setItem(key, JSON.stringify(data));
}

// Thêm/Xóa bookmark sách
function toggleBookmark(bookId, pageNum = 1) {
    const data = getUserData();
    const index = data.bookmarks.findIndex(b => b.bookId === bookId && b.pageNum === pageNum);
    
    if (index !== -1) {
        // Xóa bookmark
        data.bookmarks.splice(index, 1);
        saveUserData(data);
        return false; // Trả về false nghĩa là đã xóa
    } else {
        // Thêm bookmark
        data.bookmarks.push({ bookId, pageNum, date: new Date().toLocaleDateString() });
        saveUserData(data);
        return true; // Trả về true nghĩa là đã thêm
    }
}

// Thêm vào lịch sử đọc
function addToHistory(bookId) {
    const data = getUserData();
    // Xóa nếu đã tồn tại để đưa lên đầu danh sách
    data.history = data.history.filter(h => h.bookId !== bookId);
    data.history.unshift({ bookId, date: new Date().toLocaleDateString() });
    
    // Giới hạn lịch sử lưu tối đa 15 cuốn sách
    if (data.history.length > 15) {
        data.history.pop();
    }
    saveUserData(data);
}

// Lưu ghi chú (Notes)
function saveNote(bookId, noteText) {
    const data = getUserData();
    if (!data.notes) data.notes = {};
    data.notes[bookId] = {
        text: noteText,
        date: new Date().toLocaleDateString()
    };
    saveUserData(data);
}

// Khởi tạo người dùng mặc định lúc tải thư viện
initUsers();
