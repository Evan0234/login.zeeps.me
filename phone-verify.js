// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAjl5C7TvjmtxPc4_eno6vRMIVjciLiV04",
    authDomain: "zeeplogin.firebaseapp.com",
    projectId: "zeeplogin",
    storageBucket: "zeeplogin.appspot.com",
    messagingSenderId: "343221159933",
    appId: "1:343221159933:web:e6c3e1e7ec6161a48dfb94",
    measurementId: "G-DE7X1YKVGY"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Send OTP function
function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').value;

    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(confirmationResult => {
            window.confirmationResult = confirmationResult;
            alert('OTP sent to your phone.');
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            alert(error.message);
        });
}

// Verify OTP function
function verifyOTP() {
    const otp = document.getElementById('otp').value;

    window.confirmationResult.confirm(otp)
        .then(result => {
            const user = result.user;

            // Update Firestore to mark phone as verified
            firebase.firestore().collection('users').doc(user.uid).update({
                phoneVerified: true
            }).then(() => {
                alert('Phone verified successfully!');
                window.location.href = 'https://dashboard.zeeps.me';
            }).catch(error => {
                console.error('Error updating phone verification status:', error);
            });
        })
        .catch(error => {
            console.error('Error during OTP verification:', error);
            alert(error.message);
        });
}
