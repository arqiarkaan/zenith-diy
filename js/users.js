// -------- ADD NEW USER --------
function reloadPage() {
  window.location.reload();
}

function userRegister(event) {
  event.preventDefault();
  const username = document.getElementById("name-user").value;
  const emailUser = document.getElementById("email-user").value;
  const passwordUser = document.getElementById("password-user").value;
  const confirmPasswordUser = document.getElementById("confirm-password-user").value;

  if (passwordUser !== confirmPasswordUser) {
    alert("Password do not match! Please try again");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(emailUser, passwordUser)
    .then((userCredential) => {
      const userApp = userCredential.user;
      const userData = {
        username: username,
        email: emailUser,
      };

      database
        .ref("users/" + userApp.uid)
        .set(userData)
        .then(() => {
          alert("Successfully registered new user.");
          reloadPage();
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

const userRegisterForm = document.getElementById("user-register");
if (userRegisterForm) {
  userRegisterForm.addEventListener("submit", userRegister);
}
// -------- REGISTER END --------

// -------- READ USER DATA BEGIN --------
var userTable = document
  .getElementById("table_user")
  .getElementsByTagName("tbody")[0];

firebase
  .database()
  .ref("users")
  .on("child_added", function (snapshot) {
    var user = snapshot.val();
    var row = userTable.insertRow(-1);
    var nameCell = row.insertCell(0);
    var emailCell = row.insertCell(1);

    nameCell.innerHTML = user.username;
    emailCell.innerHTML = user.email;
  });
// -------- READ USER DATA END --------