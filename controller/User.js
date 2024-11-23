function initializeUser() {
    loadAllUser();
}
function loadAllUser() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user",
        type: "GET",
        success: function (data) {
            $("#user_table tbody").empty();
            data.forEach((user) => {
                addUserToTable(user);
            });
        },
        error: function (error) {
            console.log("Error loading users:", error);
        }
    });
}

function addUserToTable(user) {
    const tbody = $("#user_table tbody");
    const tr = $("<tr>");
    tr.append($("<td>").text(user.email));
    tr.append($("<td>").text(user.role));
    tr.append($("<td>").html(`
        <button class="btn btn-warning edit-btn" data-email="${user.email}">Edit</button>
        <button class="btn btn-danger delete-btn" data-email="${user.email}">Delete</button>
    `));
    tbody.append(tr);
}

$(document).on('click', '.edit-btn', function () {
    const email = $(this).data("email");

    $.ajax({
        url: `http://localhost:8080/api/v1/user/${email}`,
        type: "GET",
        success: function (user) {

            $("#editEmail").val(user.email);
            $("#editPassword").val("");

            $("#editRole-user").val(user.role);

            // Check if the role is valid and select it
            if ($("#editRole-user").val() === user.role) {
                $("#editRole-user").val(user.role);
            }

            // Show the modal
            $('#editModal').modal('show');
        },
        error: function (error) {
            console.log("Error loading user data for edit:", error);
        }
    });
});

$('#updateBtn').click(function () {
    const email = $("#editEmail").val();
    const updatedUser = {
        email: email,
        role: $("#editRole-user").val(),
        password: $("#editPassword").val(),
    };

    $.ajax({
        url: `http://localhost:8080/api/v1/user/${email}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedUser),
        success: function () {
            $('#editModal').modal('hide');
            loadAllUser(); // Reload the user table after update
        },
        error: function (error) {
            console.log("Error updating user:", error);
        }
    });
});

$(document).on('click', '.delete-btn', function () {
    const email = $(this).data("email");
    if (confirm("Are you sure you want to delete this user?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/user/${email}`,
            type: "DELETE",
            success: function () {
                loadAllUser(); // Reload the user table after deletion
            },
            error: function (error) {
                console.log("Error deleting user:", error);
            }
        });
    }
});

initializeUser();