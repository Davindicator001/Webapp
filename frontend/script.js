// Function to fetch user data and update the dashboard
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        // Update the user's name and balance dynamically
        document.getElementById('userName').innerText = data.name || 'Unknown User';
        document.getElementById('balance').innerText = `$${data.balance || 0}`;
    })
    .catch(error => console.error('Error fetching user data:', error));
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const result = await response.json();
    
            if (result.success) {
                showAlert("login successful", 'success');
                setTimeout(() => window.location.href = '/dashboard', 1000);
            } else {
                showAlert("login failed", 'error');
            }
        } catch (error) {
            showAlert('An error occurred during login.', 'error');
        }
    });
    
    
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
        // Check if passwords match before sending to the backend
        if (password !== confirmPassword) {
            showAlert('Passwords do not match.', 'error');
            return;
        }
    
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });
    
            const result = await response.json();
            if (result.success) {
                showAlert('Sign-up successful!', 'success');
                setTimeout(() => window.location.href = '/', 1000);
            } else {
                showAlert('Sign-up failed: ' + result.message, 'error');
            }
        } catch (error) {
            showAlert('An error occurred during sign-up.', 'error');
        }
    });
    
});

// Toggle balance visibility
document.getElementById('toggleBalance').addEventListener('click', function() {
    const balanceElem = document.getElementById('balance');
    if (balanceElem.style.display === 'none') {
        balanceElem.style.display = 'inline';
        this.innerText = 'Hide Balance';
    } else {
        balanceElem.style.display = 'none';
        this.innerText = 'Show Balance';
    }
});

// Toggle side panel visibility
document.getElementById('optionsButton').addEventListener('click', function() {
    console.log("Options button clicked");  // Debugging log
    document.getElementById('sidePanel').style.right = '0px';
});

document.getElementById('closeButton').addEventListener('click', function() {
    console.log("Close button clicked");  // Debugging log
    document.getElementById('sidePanel').style.right = '-300px';
});


// Handle logout
document.getElementById('logoutButton').addEventListener('click', async function() {
    try {
        await fetch('/logout', { method: 'GET' });
        showAlert('Logout successful!', 'success');
        setTimeout(() => window.location.href = '/', 1000); // Redirect after 1 second
    } catch (error) {
        showAlert('An error occurred during logout.', 'error');
    }
});

function showAlert(message, type) {
    console.log(`Alert triggered: ${message} (${type})`);  // Debugging log
    const alertBox = document.getElementById('alertBox');
    alertBox.innerText = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';

    // Hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            showAlert(result.message, 'success');
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } else {
            showAlert(result.message, 'error');
        }
    } catch (error) {
        showAlert('An error occurred during login.', 'error');
    }
});


document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (result.success) {
            showAlert(result.message, 'success');
            setTimeout(() => window.location.href = '/', 1000);
        } else {
            showAlert(result.message, 'error');
        }
    } catch (error) {
        showAlert('An error occurred during sign-up.', 'error');
    }
});

