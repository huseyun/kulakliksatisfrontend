// user-management.js

// Sayfa yüklendiğinde ilk olarak token var mı diye kontrol et. Yoksa login'e at.
const token = localStorage.getItem('jwtToken');
if (!token) {
    window.location.href = 'login.html';
}

// Global Değişkenler
const API_BASE_URL = 'http://localhost:8080'; 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// Modal (Güncelleme Penceresi) Elementleri
const modal = document.getElementById('updateModal');
const closeButton = document.querySelector('.close-button');
const updateUserForm = document.getElementById('updateUserForm');


// Backend'e güvenli istek atmak için genel bir fonksiyon
async function apiFetch(endpoint, options = {}) {
    options.headers = { ...headers, ...options.headers };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('jwtToken');
        throw new Error('Yetkisiz erişim!');
    }
    
    if (!response.ok) {
        const errorData = await response.text();
        console.error("API isteği başarısız oldu:", response.status, errorData);
        throw new Error(`API hatası: ${response.statusText}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } 
    return null; 
}

// Gelen kullanıcı verisini HTML tablosu olarak ekrana basan fonksiyon
function renderUsers(users, containerId, countId, userType = 'user') {
    const container = document.getElementById(containerId);
    const countEl = document.getElementById(countId);
    container.innerHTML = '';
    
    if (!users || users.length === 0) {
        container.innerHTML = '<p>Kayıtlı kullanıcı bulunamadı.</p>';
        countEl.textContent = '0 sonuç bulundu.';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Kullanıcı Adı</th>
                <th>Email</th>
                ${userType === 'user' ? '<th>Roller</th>' : ''}
                <th>İşlemler</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    const tbody = table.querySelector('tbody');
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        const roles = user.userTypes ? user.userTypes.map(ut => ut.name).join(', ') : 'ROL ATANMAMIŞ';

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email || 'N/A'}</td>
            ${userType === 'user' ? `<td>${roles}</td>` : ''}
            <td><button class="update-btn" data-userid="${user.id}" data-usertype="${userType}">Güncelle</button></td>
        `;
        tbody.appendChild(tr);

        if (userType === 'seller') {
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                 document.querySelectorAll(`#${containerId} tr`).forEach(row => row.style.backgroundColor = '');
                 tr.style.backgroundColor = '#e0f7fa';
                fetchSellerItems(user.id);
            });
        }
    });

    container.appendChild(table);
    countEl.textContent = `${users.length} sonuç bulundu.`;

    document.querySelectorAll(`#${containerId} .update-btn`).forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const userId = e.target.getAttribute('data-userid');
            const type = e.target.getAttribute('data-usertype');
            const userToUpdate = users.find(u => u.id == userId);
            openUpdateModal(userToUpdate, type);
        });
    });
}

// API'den Veri Çeken Fonksiyonlar
const fetchAllUsers = () => apiFetch('/api/admin/get/allusers').then(data => renderUsers(data, 'allUsersResults', 'allUsersCount', 'user')).catch(err => console.error(err));
const fetchAllAdmins = () => apiFetch('/api/admin/get/alladmins').then(data => renderUsers(data, 'adminsResults', 'adminsCount', 'admin')).catch(err => console.error(err));
const fetchAllSellers = () => apiFetch('/api/admin/get/allsellers').then(data => renderUsers(data, 'sellersResults', 'sellersCount', 'seller')).catch(err => console.error(err));
const fetchAllShoppers = () => apiFetch('/api/admin/get/allshoppers').then(data => renderUsers(data, 'shoppersResults', 'shoppersCount', 'shopper')).catch(err => console.error(err));

async function fetchSellerItems(sellerId) {
    const container = document.getElementById('sellerItemsResults');
    container.innerHTML = '<p>Yükleniyor...</p>';
    try {
        const items = await apiFetch(`/api/admin/get/selleritems/${sellerId}`);
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p>Bu satıcıya ait ürün bulunamadı.</p>';
            return;
        }
        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.itemName} - Fiyat: ${item.itemPrice} TL`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch(error) {
        container.innerHTML = '<p>Ürünler getirilirken hata oluştu.</p>';
    }
}


// Yeni Kullanıcı Ekleme Formu
document.getElementById('addUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const user = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        userTypes: []
    };
    
    formData.getAll('role').forEach(roleId => {
        user.userTypes.push({ id: parseInt(roleId) });
    });
    
    try {
        await apiFetch('/api/admin/post/adduser', {
            method: 'POST',
            body: JSON.stringify(user)
        });
        alert('Kullanıcı başarıyla eklendi!');
        this.reset();
        fetchAllUsers();
    } catch (error) {
        console.error('Kullanıcı ekleme hatası:', error);
        alert('Kullanıcı eklenirken bir hata oluştu.');
    }
});


// Güncelleme Penceresi (Modal) Fonksiyonları
function openUpdateModal(user, userType) {
    updateUserForm.reset();
    document.querySelectorAll('.specific-fields').forEach(f => f.style.display = 'none');
    
    document.getElementById('updateUserId').value = user.id;
    document.getElementById('updateUsername').value = user.username;
    document.getElementById('updateEmail').value = user.email || '';
    
    updateUserForm.dataset.userType = userType; 

    if (userType === 'seller') {
        document.getElementById('updateSellerFields').style.display = 'block';
        document.getElementById('updateCompanyName').value = user.company_name || '';
    } else if (userType === 'shopper') {
        document.getElementById('updateShopperFields').style.display = 'block';
        document.getElementById('updateFirstName').value = user.firstName || '';
        document.getElementById('updateLastName').value = user.lastName || '';
    }

    modal.style.display = 'block';
}

closeButton.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Kullanıcı Güncelleme Formu
updateUserForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const userType = this.dataset.userType;
    let endpoint = '';
    let body = {
        id: formData.get('id'),
        username: formData.get('username'),
        email: formData.get('email')
    };

    if (userType === 'seller') {
        endpoint = '/api/admin/put/updateseller';
        body.company_name = formData.get('company_name');
    } else if (userType === 'shopper') {
        endpoint = '/api/admin/put/updateshopper';
        body.firstName = formData.get('firstName');
        body.lastName = formData.get('lastName');
    } else {
        endpoint = '/api/admin/put/updateuser';
    }

    try {
        await apiFetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        alert('Kullanıcı başarıyla güncellendi!');
        modal.style.display = 'none';
        
        switch(userType) {
            case 'user': fetchAllUsers(); break;
            case 'admin': fetchAllAdmins(); break;
            case 'seller': fetchAllSellers(); break;
            case 'shopper': fetchAllShoppers(); break;
        }
    } catch (error) {
        console.error('Update user error:', error);
        alert('Kullanıcı güncellenirken bir hata oluştu.');
    }
});


// Sayfa içi sekmeler arası geçiş
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.management-section').forEach(section => {
            section.classList.remove('active-section');
        });
        const targetSection = document.getElementById(this.dataset.target);
        if(targetSection) {
            targetSection.classList.add('active-section');
        }
    });
});

// "Getir" Butonları için Olay Dinleyicileri
document.getElementById('fetchAllUsersBtn').addEventListener('click', fetchAllUsers);
document.getElementById('fetchAllAdminsBtn').addEventListener('click', fetchAllAdmins);
document.getElementById('fetchAllSellersBtn').addEventListener('click', fetchAllSellers);
document.getElementById('fetchAllShoppersBtn').addEventListener('click', fetchAllShoppers);

// Sayfa ilk yüklendiğinde varsayılan olarak "Tüm Kullanıcılar" listesini getir.
document.addEventListener('DOMContentLoaded', () => {
    fetchAllUsers();
});