// Your Firebase config (assuming it's already initialized)
var firebaseConfig = {
    apiKey: "AIzaSyAjl5C7TvjmtxPc4_eno6vRMIVjciLiV04",
    authDomain: "zeeplogin.firebaseapp.com",
    projectId: "zeeplogin",
    storageBucket: "zeeplogin.appspot.com",
    messagingSenderId: "343221159933",
    appId: "1:343221159933:web:e6c3e1e7ec6161a48dfb94",
    measurementId: "G-DE7X1YKVGY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Register function (email/password)
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

// Login function (email/password)
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
                    document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;
                    alert('Login Successful!');
                    window.location.href = 'https://dashboard.zeeps.me';
                } else {
                    alert('Please verify your email before logging in.');
                    auth.signOut();
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
            auth.signOut();
        }
    }
});

// --- Phone Authentication (SMS Verification) ---

// Send OTP (SMS)
function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    // Get the reCAPTCHA token
    grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute('6Lc-gVgqAAAAAOIfqdzW9Mc-y6jGxdpPSRGzsqEp', {action: 'submit'})
        .then(function(token) {
            // Pass reCAPTCHA token to Firebase RecaptchaVerifier
            const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA verified:', response);
                }
            });

            auth.signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(confirmationResult => {
                    window.confirmationResult = confirmationResult;
                    alert('OTP Sent to your phone number!');
                })
                .catch(error => {
                    console.error('Error during SMS sending:', error);
                    alert(error.message);
                });
        });
    });
}

// Verify OTP
function verifyOTP() {
    const otp = document.getElementById('otp').value;

    window.confirmationResult.confirm(otp)
        .then(result => {
            const user = result.user;
            alert('Phone authentication successful!');
            document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;
            window.location.href = 'https://dashboard.zeeps.me';
        })
        .catch(error => {
            console.error('Error during OTP verification:', error);
            alert(error.message);
        });
}

// Initialize reCAPTCHA when the page loads
window.onload = function () {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            console.log("reCAPTCHA solved");
        }
    });
};
