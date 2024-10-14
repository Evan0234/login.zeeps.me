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

// Check if user is already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // Redirect to the dashboard if the user is already logged in
        if (user.emailVerified) {
            // Set login_token cookie for .zeeps.me (7 days)
            document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;
            window.location.href = 'https://dashboard.zeeps.me'; // Redirect to dashboard
        } else {
            alert('Please verify your email before logging in.');
            auth.signOut(); // Sign out user if email is not verified
        }
    }
});

// Register function
function register() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validate_email(email) || !validate_password(password)) {
            throw new Error('Invalid email or password!');
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;

                // Send verification email
                return user.sendEmailVerification()
                    .then(() => {
                        alert('Verification Email Sent. Please verify your email before logging in.');
                        // No automatic login after registration
                    });
            })
            .catch(error => {
                console.error('Error during registration:', error);
                alert(error.message);
            });
    } catch (error) {
        console.error('Error in register function:', error.message);
    }
}

// Login function
function login() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validate_email(email) || !validate_password(password)) {
            throw new Error('Invalid email or password!');
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;

                if (user.emailVerified) {
                    // Set login_token cookie for .zeeps.me (7 days)
                    document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;

                    alert('Login Successful!');
                    // Redirect to the dashboard after successful login
                    window.location.href = 'https://dashboard.zeeps.me';
                } else {
                    alert('Please verify your email before logging in.');
                    auth.signOut(); // Sign out the user if email is not verified
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert(error.message);
            });
    } catch (error) {
        console.error('Error in login function:', error.message);
    }
}

// Email validation
function validate_email(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Password validation
function validate_password(password) {
    return password.length >= 6; // Minimum length of 6 characters
}
