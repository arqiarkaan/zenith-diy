// -------- LOGIN BEGIN --------
function adminLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email-admin").value;
  const password = document.getElementById("password-admin").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((adminCredential) => {
      const loggedInEmail = adminCredential.user.email;

      if (loggedInEmail === "darrenarkaan@gmail.com") {
        alert(
          "You have successfully logged in as a super admin! Click 'Ok' to proceed"
        );
        window.location.href = "dashboard-super.html";
      } else {
        alert(
          "You have successfully logged in as an admin! Click 'Ok' to proceed"
        );
        window.location.href = "dashboard.html";
      }
    })
    .catch((error) => {
      alert("Wrong email or password!");
    });
}

const loginForm = document.getElementById("admin-login");
if (loginForm) {
  loginForm.addEventListener("submit", adminLogin);
}
// -------- LOGIN END --------

// -------- REGISTER BEGIN --------
function adminRegister(event) {
  event.preventDefault();
  const adminname = document.getElementById("name-admin").value;
  const email = document.getElementById("email-admin").value;
  const password = document.getElementById("password-admin").value;
  const confirmPassword = document.getElementById("confirm-password-admin").value;

  if (password !== confirmPassword) {
    alert("Password do not match! Please try again");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const adminData = {
        adminname: adminname,
        email: email,
      };

      database
        .ref("admins/" + user.uid)
        .set(adminData)
        .then(() => {
          alert("Admin successfully registered.");
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

const registerForm = document.getElementById("admin-register");
if (registerForm) {
  registerForm.addEventListener("submit", adminRegister);
}
// -------- REGISTER END --------

// -------- READ ADMIN DATA BEGIN --------
var adminTable = document
  .getElementById("table_admin")
  .getElementsByTagName("tbody")[0];

firebase
  .database()
  .ref("admins")
  .on("child_added", function (snapshot) {
    var admin = snapshot.val();
    var row = adminTable.insertRow(-1);
    var nameCell = row.insertCell(0);
    var emailCell = row.insertCell(1);

    nameCell.innerHTML = admin.adminname;
    emailCell.innerHTML = admin.email;
  });
// -------- READ ADMIN DATA END --------

// -------- RESET PASSWORD BEGIN --------
function resetPasswordForm(event) {
  event.preventDefault();
  const currentPassword = document.getElementById(
    "admin-currentpassword"
  ).value;
  const newPassword = document.getElementById("admin-newpassword").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match! Please try again.");
    return;
  }

  // Mendapatkan pengguna saat ini yang terautentikasi
  const user = firebase.auth().currentUser;

  if (user) {
    const email = user.email; // Mendapatkan email dari pengguna saat ini
    // Membuat credential dari email dan password saat ini
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      currentPassword
    );

    // Melakukan re-authentikasi pengguna
    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // Mengupdate password pengguna di Firebase Authentication setelah re-authentikasi berhasil
        return user.updatePassword(newPassword);
      })
      .then(() => {
        alert("Password updated successfully!");
      })
      .catch((error) => {
        console.error(error.message);
        if (error.code === "auth/wrong-password") {
          alert("Current password is incorrect. Please try again.");
        } else {
          alert("Error updating password: " + error.message);
        }
      });
  } else {
    alert("No authenticated user found. Please log in and try again.");
  }
}

const resetAdminPasswordForm = document.getElementById("reset-password-form");
if (resetAdminPasswordForm) {
  resetAdminPasswordForm.addEventListener("submit", resetPasswordForm);
}
// -------- RESET PASSWORD END --------

// -------- LOGOUT START --------
function logout() {
  if (window.confirm("Are you sure you want to logout?")) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.history.replaceState({}, "", "index.html");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
// -------- LOGOUT END --------

// -------- SHOW PASSWORD BEGIN --------
function seePassword() {
  var see = document.getElementById("password-admin");
  if (see.type === "password") {
    see.type = "text";
  } else {
    see.type = "password";
  }
}

function seePasswordAndConfirmPassword() {
  var password = document.getElementById("password-admin");
  var confirmPassword = document.getElementById("confirm-password-admin");

  if (password.type === "password" || confirmPassword.type === "password") {
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
  }
}

function seeNewPasswordAndConfirmPassword() {
  var confirmPassword = document.getElementById("admin-currentpassword");
  var password = document.getElementById("admin-newpassword");
  var currentPassword = document.getElementById("confirm-password");

  if (
    password.type === "password" ||
    confirmPassword.type === "password" ||
    currentPassword === "password"
  ) {
    password.type = "text";
    confirmPassword.type = "text";
    currentPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
    currentPassword.type = "password";
  }
}
function seePasswordAndConfirmPasswordUser() {
  var password = document.getElementById("password-user");
  var confirmPassword = document.getElementById("confirm-password-user");

  if (password.type === "password" || confirmPassword.type === "password") {
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    password.type = "password";
    confirmPassword.type = "password";
  }
}
// -------- SHOW PASSWORD END --------
