function reloadPage() {
  window.location.reload();
}
// -------- AUTOMATIC ID BEGIN --------
function fetchAndSetPostId() {
  var idPostInput = document.getElementById("id_post");

  firebase
    .database()
    .ref("posts")
    .once("value")
    .then(function (snapshot) {
      var maxId = 0;

      snapshot.forEach(function (childSnapshot) {
        var post = childSnapshot.val();
        var postId = post.id_post;
        var idNumber = parseInt(postId.replace("PST", ""), 10);
        if (idNumber > maxId) {
          maxId = idNumber;
        }
      });

      var newId = "PST" + ("000" + (maxId + 1)).slice(-3);
      idPostInput.value = newId;
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
// -------- AUTOMATIC ID END --------

// ------- ADD POST BEGIN -------
function addNewPost() {
  var id_post = document.getElementById("id_post").value;
  var name_post = document.getElementById("name_post").value;
  var category = document.getElementById("category_post").value;
  var creator = document.getElementById("creator_post").value;
  var imageFile = document.getElementById("image_post").files[0];
  var tools = document.getElementById("tools_post").value;
  var steps = document.getElementById("steps_post").value;
  var admin = document.getElementById("admin_post").value;

  // Upload file gambar ke Firebase Storage
  var storageRef = firebase.storage().ref("images_post/" + imageFile.name);
  storageRef
    .put(imageFile)
    .then(function (snapshot) {
      return snapshot.ref.getDownloadURL();
    })
    .then(function (imageURL) {
      var postData = {
        id_post: id_post,
        name: name_post,
        category: category,
        creator: creator,
        image: imageURL,
        tools: tools,
        steps: steps,
        admin: admin,
      };

      var postID = firebase.database().ref().child("posts").push().key;

      var updates = {};
      updates["/posts/" + postID] = postData;

      firebase
        .database()
        .ref()
        .update(updates)
        .then(function () {
          alert("Successfully created new post!");
          reloadPage();
        })
        .catch(function (error) {
          console.log(error.message);
        });
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

window.onload = function () {
  fetchAndSetPostId();
  const formPost = document.getElementById("form-post");
  if (formPost) {
    formPost.addEventListener("submit", function (event) {
      event.preventDefault();
      addNewPost();
    });
  }
};
// -------- ADD POST END --------

// -------- ADD SELECT OPTION FOR CATEGORY, CREATOR, ADMIN BEGIN --------
// select option category
var selectCategory = document.getElementById("category_post");
firebase
  .database()
  .ref("categories")
  .on("child_added", function (snapshot) {
    var category = snapshot.val();
    console.log("Category:", category);
    var option = document.createElement("option");
    option.value = category.name;
    option.text = category.id_category + " - " + category.name;
    selectCategory.appendChild(option);
  });

// select option creator
var selectCreator = document.getElementById("creator_post");
firebase
  .database()
  .ref("creators")
  .on("child_added", function (snapshot) {
    var creators = snapshot.val();
    console.log("Creator:", creators);
    var option = document.createElement("option");
    option.value = creators.name;
    option.text = creators.id_creator + " - " + creators.name;
    selectCreator.appendChild(option);
  });

// select option admin
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const loggedInAdminEmail = user.email;

    var adminsRef = firebase.database().ref("admins");
    adminsRef
      .orderByChild("email")
      .equalTo(loggedInAdminEmail)
      .once("value", function (snapshot) {
        var adminSelect = document.getElementById("admin_post");
        while (adminSelect.firstChild) {
          adminSelect.removeChild(adminSelect.firstChild);
        }

        snapshot.forEach(function (childSnapshot) {
          var admin = childSnapshot.val();
          var adminName = admin.adminname;

          var option = document.createElement("option");
          option.value = adminName;
          option.text = adminName;
          adminSelect.appendChild(option);
          adminSelect.disabled = true;
        });
      });
  }
});
// -------- ADD SELECT OPTION FOR CATEGORY, CREATOR, ADMIN BEGIN --------

// -------- EDIT SELECT OPTION FOR CATEGORY, CREATOR, ADMIN BEGIN --------
// edit select option category
var editSelectCategory = document.getElementById("postCategory");
firebase
  .database()
  .ref("categories")
  .on("child_added", function (snapshot) {
    var category = snapshot.val();
    var option = document.createElement("option");
    option.value = category.name;
    option.text = category.id_category + " - " + category.name;
    editSelectCategory.appendChild(option);
  });

// edit select option creator
var editSelectCreator = document.getElementById("postCreator");
firebase
  .database()
  .ref("creators")
  .on("child_added", function (snapshot) {
    var creator = snapshot.val();
    var option = document.createElement("option");
    option.value = creator.name;
    option.text = creator.id_creator + " - " + creator.name;
    editSelectCreator.appendChild(option);
  });

// edit select option admin
var editSelectAdmin = document.getElementById("postAdmin");
firebase
  .database()
  .ref("admins")
  .on("child_added", function (snapshot) {
    var admin = snapshot.val();
    var option = document.createElement("option");
    option.value = admin.adminname;
    option.text = admin.adminname;
    editSelectAdmin.appendChild(option);
  });
// -------- EDIT SELECT OPTION FOR CATEGORY, CREATOR, ADMIN BEGIN --------

// -------- READ POST DATA BEGIN --------
var postTable = document
  .getElementById("table_post")
  .getElementsByTagName("tbody")[0];

firebase
  .database()
  .ref("posts")
  .on("child_added", function (snapshot) {
    var post = snapshot.val();
    var row = postTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var categoryCell = row.insertCell(2);
    var creatorCell = row.insertCell(3);
    var imageCell = row.insertCell(4);
    var toolsCell = row.insertCell(5);
    var stepsCell = row.insertCell(6);
    var adminCell = row.insertCell(7);
    var actionCell = row.insertCell(8);

    idCell.innerHTML = post.id_post;
    nameCell.innerHTML = post.name;
    categoryCell.innerHTML = post.category;
    creatorCell.innerHTML = post.creator;
    imageCell.innerHTML =
      "<img src='" + post.image + "' style='width:200px;height:200px;'>";
    toolsCell.innerHTML = post.tools;
    stepsCell.innerHTML = post.steps;
    adminCell.innerHTML = post.admin;

    var editButton = document.createElement("button");
    editButton.classList.add("btn", "edit");
    editButton.innerHTML = '<i class="uil uil-edit"></i>';
    editButton.addEventListener("click", function () {
      editPost(snapshot.key, post);
    });

    var delButton = document.createElement("button");
    delButton.classList.add("btn", "delete");
    delButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    delButton.addEventListener("click", function () {
      deletePost(snapshot.key);
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(delButton);
  });
// -------- READ POST DATA END --------

// -------- UPDATE POST BEGIN --------
function editPost(postID, post) {
  var editModal = document.getElementById("editModalPost");
  var editID = document.getElementById("postId");
  var editName = document.getElementById("postName");
  var editCategory = document.getElementById("postCategory");
  var editCreator = document.getElementById("postCreator");
  var editImageFile = document.getElementById("postImage");
  var editTools = document.getElementById("postTools");
  var editSteps = document.getElementById("postSteps");
  var editAdmin = document.getElementById("postAdmin");
  var savePost = document.getElementById("savePost");
  var closeButton = document.getElementsByClassName("close")[0];

  // Set current post values to the edit form
  editID.value = post.id_post;
  editName.value = post.name;
  editCategory.value = post.category;
  editCreator.value = post.creator;
  editTools.value = post.tools;
  editSteps.value = post.steps;
  editAdmin.value = post.admin;

  editModal.style.display = "block";

  function saveEdit() {
    var id_post = editID.value;
    var name_post = editName.value;
    var category = editCategory.value;
    var creator = editCreator.value;
    var newImageFile = editImageFile.files[0];
    var tools = editTools.value;
    var steps = editSteps.value;
    var admin = editAdmin.value;

    // Object to hold the updated post data
    var postData = {
      id_post: id_post,
      name: name_post,
      category: category,
      creator: creator,
      tools: tools,
      steps: steps,
      admin: admin,
    };

    // Reference to the post in the database
    var postRef = firebase.database().ref("posts/" + postID);

    // Function to update the post in the database
    function updatePostWithImageURL(imageURL) {
      if (imageURL) {
        postData.image = imageURL;
      }
      postRef
        .update(postData)
        .then(function () {
          alert("Post updated successfully!");
          editModal.style.display = "none";
          reloadPage("");
        })
        .catch(function (error) {
          alert(error.message);
        });
    }

    // Upload a new image if a new file is selected
    if (newImageFile) {
      var storageRef = firebase.storage().ref("images_post/" + postID);
      storageRef
        .put(newImageFile)
        .then(function () {
          return storageRef.getDownloadURL();
        })
        .then(function (downloadURL) {
          updatePostWithImageURL(downloadURL);
          alert("Image updated!");
        })
        .catch(function (error) {
          alert(error.message);
        });
    } else {
      updatePostWithImageURL();
    }
  }

  function cancelEdit() {
    editModal.style.display = "none";
  }

  savePost.addEventListener("click", saveEdit);
  closeButton.addEventListener("click", cancelEdit);
}
// -------- UPDATE POST END --------

// -------- DELETE POST BEGIN --------
function deletePost(postID) {
  if (confirm("Are you sure you want to delete this post?")) {
    database
      .ref("posts")
      .child(postID)
      .remove()
      .then(function () {
        alert("Successfully deleted the post!");
        reloadPage("");
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
}
// -------- DELETE POST END --------
