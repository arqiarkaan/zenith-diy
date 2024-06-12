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
  const confirmPassword = document.getElementById(
    "confirm-password-admin"
  ).value;

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
