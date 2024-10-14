// Your Firebase config (assuming it's already initialized)
const firebaseConfig = {
    apiKey: "AIzaSyAjl5C7TvjmtxPc4_eno6vRMIVjciLiV04",
    authDomain: "zeeplogin.firebaseapp.com",
    databaseURL: "https://zeeplogin-default-rtdb.firebaseio.com",
    projectId: "zeeplogin",
    storageBucket: "zeeplogin.appspot.com",
    messagingSenderId: "343221159933",
    appId: "1:343221159933:web:e6c3e1e7ec6161a48dfb94",
    measurementId: "G-DE7X1YKVGY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Register function
function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validate_email(email) || !validate_password(password)) {
        alert('Invalid email or password!');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;

            // Send verification email
            return user.sendEmailVerification()
                .then(() => {
                    alert('Verification Email Sent. Please verify your email before logging in.');
                });
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert(error.message);
        });
}

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validate_email(email) || !validate_password(password)) {
        alert('Invalid email or password!');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;

            if (user.emailVerified) {
                // Set login_token cookie for .zeeps.me (7 days)
                document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;

                alert('Login Successful!');
                // Redirect to the correct subdomain dashboard
                window.location.href = 'https://dashboard.zeeps.me';
            } else {
                alert('Please verify your email before logging in.');
                // Sign out the user if email is not verified
                auth.signOut();
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert(error.message);
        });
}

// Validate email format
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

// Validate password length
function validate_password(password) {
    return password.length >= 6;
}

// Redirect to dashboard if already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified) {
            document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;
            window.location.href = 'https://dashboard.zeeps.me';
        } else {
            // If email is not verified, sign them out
            auth.signOut();
        }
    }
});
