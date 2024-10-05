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

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            user.getIdToken(true).then(token => {
                // Check if the user's email is verified
                if (!user.emailVerified) {
                    alert('Please verify your email before logging in.');
                    return auth.signOut();
                }

                // Assuming 'phoneVerified' is stored in Firebase Firestore
                const userDoc = firebase.firestore().collection('users').doc(user.uid);
                userDoc.get().then(docSnapshot => {
                    if (docSnapshot.exists) {
                        const userData = docSnapshot.data();
                        if (userData.phoneVerified) {
                            // Redirect to dashboard if phone is verified
                            window.location.href = 'https://dashboard.zeeps.me';
                        } else {
                            // Redirect to phone verification page
                            window.location.href = 'https://login.zeeps.me/phone-verify';
                        }
                    } else {
                        console.error('User data does not exist in Firestore.');
                        alert('Error retrieving user data.');
                    }
                }).catch(error => {
                    console.error('Error fetching user data:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert(error.message);
        });
}

// Registration function
function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return user.sendEmailVerification()
                .then(() => {
                    alert('Verification email sent. Please verify your email before logging in.');
                });
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert(error.message);
        });
}
