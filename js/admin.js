document.addEventListener('DOMContentLoaded', function() {
    const fetchAllUsersBtn = document.getElementById('fetchAllUsersBtn');
    const fetchAllShoppersBtn = document.getElementById('fetchAllShoppersBtn');
    const userListDiv = document.getElementById('user-list');

    const API_BASE_URL = 'http://localhost:8080/api/admin';

    // Token'ı al
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchAllUsersBtn.addEventListener('click', () => fetchUsers('/allusers'));
    fetchAllShoppersBtn.addEventListener('click', () => fetchUsers('/allshoppers'));

    function fetchUsers(endpoint) {
        userListDiv.innerHTML = '<p>Yükleniyor...</p>';
        fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken');
                throw new Error('Yetkiniz yok veya oturum süreniz doldu. Giriş sayfasına yönlendiriliyorsunuz.');
            }
            if (!response.ok) {
                throw new Error('Veri alınamadı.');
            }
            return response.json();
        })
        .then(users => {
            displayUsers(users);
        })
        .catch(error => {
            userListDiv.innerHTML = `<p style="color: red;">Hata: ${error.message}</p>`;
            if (error.message.includes('yönlendiriliyorsunuz')) {
                setTimeout(() => { window.location.href = 'login.html'; }, 3000);
            }
        });
    }

    function displayUsers(users) {
        if (!users || users.length === 0) {
            userListDiv.innerHTML = '<p>Gösterilecek kullanıcı bulunamadı.</p>';
            return;
        }

        let tableHTML = `
            <table id="user-table">
                <thead>
                    <tr>
                        <th>Kullanıcı Adı</th>
                        <th>Kullanıcı Rolleri</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        users.forEach(user => {
            const userRoles = user.userTypes.map(type => type.name).join(', ');
            tableHTML += `
                <tr>
                    <td>${user.username}</td>
                    <td>${userRoles}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        userListDiv.innerHTML = tableHTML;
    }
});