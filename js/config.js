// -------- FIREBASE CONFIGURATION START --------
const firebaseConfig = {
  apiKey: "AIzaSyB-KAhv0liItjCdjGsuvchaW2EZTNonN4c",
  authDomain: "zenith-diy.firebaseapp.com",
  databaseURL:
    "https://zenith-diy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zenith-diy",
  storageBucket: "zenith-diy.appspot.com",
  messagingSenderId: "263615101865",
  appId: "1:263615101865:web:64f7c30a266a1e5145e2b8",
  measurementId: "G-K9WVE6D2RC",
};

// buat menginisialisasi firebasenya
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// -------- FIREBASE CONFIGURATION END --------
