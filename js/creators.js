function reloadPage() {
  window.location.reload();
}

// -------- AUTOMATIC ID BEGIN --------
function fetchAndSetCreatorId() {
  var idCreatorInput = document.getElementById("id_creator");

  firebase
    .database()
    .ref("creators")
    .once("value")
    .then(function (snapshot) {
      var maxId = 0;

      snapshot.forEach(function (childSnapshot) {
        var creator = childSnapshot.val();
        var creatorId = creator.id_creator;
        var idNumber = parseInt(creatorId.replace("CRT", ""), 10);
        if (idNumber > maxId) {
          maxId = idNumber;
        }
      });

      var newId = "CRT" + ("000" + (maxId + 1)).slice(-3);
      idCreatorInput.value = newId;
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
// -------- AUTOMATIC ID END --------

// -------- ADD CREATOR BEGIN --------
function addNewCreator() {
  var id_creator = document.getElementById("id_creator").value;
  var name = document.getElementById("name_creator").value;
  var description = document.getElementById("description_creator").value;

  var data = {
    id_creator: id_creator,
    name: name,
    description: description,
  };

  var creatorUID = firebase.database().ref().child("creators").push().key;

  var updates = {};
  updates["/creators/" + creatorUID] = data;

  firebase
    .database()
    .ref()
    .update(updates)
    .then(function () {
      alert("Successfully created new creator!");
      reloadPage();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

// Event listener for form submission
window.onload = function () {
  fetchAndSetCreatorId();
  const formCreator = document.getElementById("form-creator");
  if (formCreator) {
    formCreator.addEventListener("submit", function (event) {
      event.preventDefault();
      addNewCreator();
    });
  }
};
// -------- ADD CREATOR END --------

// -------- READ CREATOR DATA BEGIN --------
var creatorTable = document
  .getElementById("table_creator")
  .getElementsByTagName("tbody")[0];

firebase
  .database()
  .ref("creators")
  .on("child_added", function (snapshot) {
    var creator = snapshot.val();
    var row = creatorTable.insertRow(0);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var descriptionCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    idCell.innerHTML = creator.id_creator;
    nameCell.innerHTML = creator.name;
    descriptionCell.innerHTML = creator.description;

    var editButton = document.createElement("button");
    editButton.classList.add("btn", "edit");
    editButton.innerHTML = '<i class="uil uil-edit"></i>';
    editButton.addEventListener("click", function () {
      editCreatorModal(snapshot.key, creator);
    });

    var delButton = document.createElement("button");
    delButton.classList.add("btn", "delete");
    delButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    delButton.addEventListener("click", function () {
      deleteThisCreator(snapshot.key);
    });

    actionCell.appendChild(editButton);
    actionCell.appendChild(delButton);
  });
// -------- READ CREATOR DATA END --------

// --------- UPDATE CATEGORY DATA BEGIN --------
function editCreatorModal(creatorID, creator) {
  var editModal = document.getElementById("editModalCreator");
  var editId = document.getElementById("creatorId");
  var editName = document.getElementById("creatorName");
  var editDescription = document.getElementById("creatorDescription");
  var saveButton = document.getElementById("saveCreator");
  var closeButton = document.getElementsByClassName("close")[0];
  editId.value = creator.id_creator;
  editName.value = creator.name;
  editDescription.value = creator.description;

  editModal.style.display = "block";

  function saveChanges() {
    var newCreatorId = editId.value;
    var newCreatorName = editName.value;
    var newCreatorDescription = editDescription.value;

    var updates = {};
    updates["/creators/" + creatorID + "/id_creator"] = newCreatorId;
    updates["/creators/" + creatorID + "/name"] = newCreatorName;
    updates["/creators/" + creatorID + "/description"] = newCreatorDescription;

    firebase
      .database()
      .ref()
      .update(updates)
      .then(function () {
        alert("Succesfully updated the creator!");
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
function deleteThisCreator(creatorID) {
  if (confirm("Are you sure you want to delete this creator?")) {
    firebase
      .database()
      .ref("creators")
      .child(creatorID)
      .remove()
      .then(function () {
        alert("Successfully deleted the creator!");
        reloadPage("");
      })
      .catch(function (error) {
        alert(error.message);
      });
  }
}
// -------- DELETE THE CATEGORY END --------

// -------- SEARCH BEGIN --------
document.getElementById("searchInput").addEventListener("keyup", function () {
  var filter = this.value.toLowerCase();
  var rows = creatorTable.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var match = false;
    for (var j = 0; j < cells.length; j++) {
      if (cells[j]) {
        if (cells[j].innerText.toLowerCase().indexOf(filter) > -1) {
          match = true;
          break;
        }
      }
    }
    if (match) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
});
// -------- SEARCH END --------
