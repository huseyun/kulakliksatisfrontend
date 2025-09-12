document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    
    // URL'Yİ GÜNCELLİYORUZ
    const loginApiUrl = 'http://localhost:8080/api/auth/login';

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorMessageDiv.textContent = ''; // Eski hataları temizle

        fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Kullanıcı adı veya şifre hatalı.'); });
            }
            return response.json();
        })
        .then(data => {
            // Backend'den gelen token'ı localStorage'a kaydet
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                // Giriş başarılı, profil sayfasına yönlendir
                window.location.href = 'index.html';
            } else {
                throw new Error('Token alınamadı.');
            }
        })
        .catch(error => {
            errorMessageDiv.textContent = `Hata: ${error.message}`;
            console.error('Giriş yapılırken hata:', error);
        });
    });
});