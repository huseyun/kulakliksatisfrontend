document.addEventListener('DOMContentLoaded', function() {
    const profileInfoDiv = document.getElementById('profile-info');
    const apiUrl = 'http://localhost:8080/api/profile';

    // Kayıtlı token'ı al
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        // Eğer token yoksa, kullanıcı giriş yapmamış demektir. Giriş sayfasına yönlendir.
        window.location.href = 'login.html';
        return; // Kodun devamının çalışmasını engelle
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            // Her istekte token'ı Authorization header'ı ile gönder
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            // Yetkisiz veya geçersiz token durumu
            localStorage.removeItem('jwtToken'); // Geçersiz token'ı temizle
            throw new Error('Yetkiniz yok veya oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        }
        if (!response.ok) {
            throw new Error('Profil bilgileri alınamadı.');
        }
        return response.json();
    })
    .then(data => {
        const userType = data.userTypes && data.userTypes.length > 0 ? data.userTypes[0].name : 'Belirtilmemiş';
        profileInfoDiv.innerHTML = `
            <h2>Profil Bilgileri</h2>
            <p><strong>Kullanıcı Adı:</strong> ${data.username}</p>
            <p><strong>Kullanıcı Rolü:</strong> ${userType}</p>
        `;
    })
    .catch(error => {
        profileInfoDiv.innerHTML = `<p style="color: red;">Hata: ${error.message}</p>`;
        // Hata durumunda bir süre sonra login sayfasına yönlendirebiliriz
        setTimeout(() => { window.location.href = 'login.html'; }, 3000);
    });
});