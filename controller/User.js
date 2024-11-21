import UserModel from "../model/UserModel";

let users = [];
initializeUsers();
function initializeUsers() {
    $.ajax({
        url: "http://localhost:3000/users",
        type: "GET",
        success: function (data) {
            users = data;
            displayUsers();
        }
    });
}

// Function to display users in the table
function displayUsers() {
    const tableBody = $("#user_table tbody");
    tableBody.empty();
    users.forEach(user => {
        const sanitizedEmail = sanitizeEmail(user.email);
        const row = `
            <tr id="row-${sanitizedEmail}">
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-email="${user.email}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-email="${user.email}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}

function clearForm() {
    $("#name").val("");
    $("#email").val("");
    $("#password").val("");
}
// Function to add a new user to the table

function addUserToTable(user) {
    const tableBody = $("#user_table tbody");
    const sanitizedEmail = sanitizeEmail(user.email);
    const row = `
        <tr id="row-${sanitizedEmail}">
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-email="${user.email}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-email="${user.email}">Delete</button>
            </td>
        </tr>
    `;
    tableBody.append(row);
}

// Function to delete a user by email
function deleteUser(email) {
    // Remove user from the array
    users = users.filter(user => user.email !== email);

    // Remove the corresponding row from the table
    const sanitizedEmail = sanitizeEmail(email);
    $(`#row-${sanitizedEmail}`).remove();
}

// Function to edit user details
function editUser(email) {
    const user = users.find(user => user.email === email);

    if (user) {
        $("#editName").val(user.name);
        $("#editEmail").val(user.email);
        $("#editPassword").val(user.password);

        $("#editModal").modal('show');
    } else {
        alert("User not found!");
    }
}

// Function to update user details
function updateUser() {
    const email = $("#editEmail").val(); // Email is unique and non-editable
    const user = users.find(user => user.email === email);

    if (user) {
        // Update user details in the array
        user.name = $("#editName").val();
        user.password = $("#editPassword").val();

        // Update the corresponding table row
        const sanitizedEmail = sanitizeEmail(email);
        const row = $(`#row-${sanitizedEmail}`);
        row.find("td:nth-child(1)").text(user.name); // Update name
        row.find("td:nth-child(3)").text(user.password); // Update password

        // Close the modal
        $("#editModal").modal('hide');
    } else {
        alert("User not found!");
    }
}

// Utility function to sanitize email for safe use in IDs
function sanitizeEmail(email) {
    return email.replace(/[@.]/g, "-");
}

// Event listeners
$(document).ready(function () {
    // Add user on form submission
    $("#user_form").submit(function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const email = $("#email").val();
        const password = $("#password").val();

        // Check if email already exists
        if (!users.find(user => user.email === email)) {
            const user = { name, email, password };
            users.push(user);
            addUserToTable(user);
            clearForm();
        } else {
            alert("User with this email already exists!");
        }
    });

    // Clear form when "Clear" button is clicked
    $("#clearBtn").click(function () {
        clearForm();
    });

    // Delegate click event for Edit button
    $("#user_table").on("click", ".edit-btn", function () {
        const email = $(this).data("email");
        editUser(email);
    });

    // Delegate click event for Delete button
    $("#user_table").on("click", ".delete-btn", function () {
        const email = $(this).data("email");
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(email);
        }
    });

    // Update user when "Update" button in modal is clicked
    $("#updateBtn").click(function () {
        updateUser();
    });
});
