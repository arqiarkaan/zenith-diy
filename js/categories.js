function reloadPage() {
  window.location.reload();
}

// -------- ADD CATEGORY BEGIN --------
function addNewCategory() {
  var id_category = document.getElementById("id_category").value;
  var name = document.getElementById("name_category").value;
  var description = document.getElementById("description_category").value;

  var data = {
    id_category: id_category,
    name: name,
    description: description,
  };

  var categoryUID = firebase.database().ref().child("categories").push().key;

  var updates = {};
  updates["/categories/" + categoryUID] = data;

  firebase
    .database()
    .ref()
    .update(updates)
    .then(function () {
      alert("Successfully created new category!");
      reloadPage();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

const formCategory = document.getElementById("form-category");
if (formCategory) {
  formCategory.addEventListener("submit", function (event) {
    event.preventDefault();
    addNewCategory();
  });
}
// -------- ADD CATEGORY END --------

// -------- READ CATEGORY DATA BEGIN --------
var categoryTable = document
  .getElementById("table_category")
  .getElementsByTagName("tbody")[0];

firebase
  .database()
  .ref("categories")
  .on("child_added", function (snapshot) {
    var category = snapshot.val();
    var row = categoryTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var descriptionCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    idCell.innerHTML = category.id_category;
    nameCell.innerHTML = category.name;
    descriptionCell.innerHTML = category.description;

    var editButton = document.createElement("button");
    editButton.classList.add("btn", "edit");
    editButton.innerHTML = '<i class="uil uil-edit"></i>';
    editButton.addEventListener("click", function () {
      editCategoryModal(snapshot.key, category);
    });

    var delButton = document.createElement("button");
    delButton.classList.add("btn", "delete");
    delButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    delButton.addEventListener("click", function () {
      deleteThisCategory(snapshot.key);
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(delButton);
  });
// -------- READ CATEGORY DATA END --------

// --------- UPDATE CATEGORY DATA BEGIN --------
function editCategoryModal(categoryID, category) {
  var editModal = document.getElementById("editModalCategory");
  var editId = document.getElementById("categoryId");
  var editName = document.getElementById("categoryName");
  var editDescription = document.getElementById("categoryDescription");
  var saveButton = document.getElementById("saveCategory");
  var closeButton = document.getElementsByClassName("close")[0];
  editId.value = category.id_category;
  editName.value = category.name;
  editDescription.value = category.description;

  editModal.style.display = "block";

  function saveChanges() {
    var newCategoryId = editId.value;
    var newCategoryName = editName.value;
    var newCategoryDescription = editDescription.value;

    var updates = {};
    updates["/categories/" + categoryID + "/id_category"] = newCategoryId;
    updates["/categories/" + categoryID + "/name"] = newCategoryName;
    updates["/categories/" + categoryID + "/description"] =
      newCategoryDescription;

    firebase
      .database()
      .ref()
      .update(updates)
      .then(function () {
        alert("Succesfully updated the category!");
        reloadPage("");
        editModal.style.display = "none";
      })
      .catch(function (error) {
        alert(error.message);
      });

    editModal.style.display = "none";
  }
  function cancelEdit() {
    editModal.style.display = "none";
  }

  saveButton.addEventListener("click", saveChanges);
  closeButton.addEventListener("click", cancelEdit);
}
// -------- UPDATE CATEGORY DATA END --------

// -------- DELETE THE CATEGORY BEGIN --------
function deleteThisCategory(categoryID) {
  if (confirm("Are you sure you want to delete this category?")) {
    firebase
      .database()
      .ref("categories")
      .child(categoryID)
      .remove()
      .then(function () {
        alert("Successfully deleted the category!");
        reloadPage("");
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
}
// -------- DELETE THE CATEGORY END --------