document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            // Here you would typically send this data to your backend
            console.log('Login attempt:', { email, password, remember });
            
            // For demo purposes, show success message
            alert('Login successful!');
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const terms = document.getElementById('terms').checked;

            // Here you would typically send this data to your backend
            console.log('Signup attempt:', { name, email, password, terms });
            
            // For demo purposes, show success message
            alert('Account created successfully!');
        });
    }

    // Handle social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const githubBtn = document.querySelector('.github-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            console.log('Google login clicked');
            // Implement Google OAuth login here
        });
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            console.log('GitHub login clicked');
            // Implement GitHub OAuth login here
        });
    }

    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Forgot password clicked');
            // Implement forgot password functionality here
        });
    }
}); 