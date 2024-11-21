
document.addEventListener("DOMContentLoaded", () => {
    const staffForm = document.getElementById("staff-form");
    const editStaffForm = document.getElementById("edit-staff-form");
    const staffTableBody = document.querySelector("#staff-table tbody");
    const clearFormButton = document.getElementById("clearFormBtn-staff");

    let editingRow = null; // Track the row being edited

    // Clear form function
    function clearForm(form) {
        form.reset();
    }

    // Handle staff form submission
    staffForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Collect form values
        const staffData = {
            staffId: document.getElementById("staffId-staff").value.trim(),
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            designation: document.getElementById("designation").value.trim(),
            gender: document.getElementById("gender").value.trim(),
            birthDate: document.getElementById("birthDate").value.trim(),
            joiningDate: document.getElementById("joiningDate").value.trim(),
            address: [
                document.getElementById("addressLine1").value.trim(),
                document.getElementById("addressLine2").value.trim(),
                document.getElementById("addressLine3").value.trim(),
                document.getElementById("addressLine4").value.trim(),
                document.getElementById("addressLine5").value.trim(),
            ].filter(line => line).join(", "),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            email: document.getElementById("email-staff").value.trim(),
            role: document.getElementById("role").value.trim(),
            logId: document.getElementById("logId-staff").value.trim(),
        };

        // Validation
        if (Object.values(staffData).some(value => !value)) {
            alert("Please fill out all required fields!");
            return;
        }

        // Create new row for the staff table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${staffData.staffId}</td>
            <td>${staffData.firstName}</td>
            <td>${staffData.lastName}</td>
            <td>${staffData.designation}</td>
            <td>${staffData.gender}</td>
            <td>${staffData.birthDate}</td>
            <td>${staffData.joiningDate}</td>
            <td>${staffData.address}</td>
            <td>${staffData.phoneNumber}</td>
            <td>${staffData.email}</td>
            <td>${staffData.role}</td>
            <td>${staffData.logId}</td>
            <td>
                <button class="btn btn-success btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editStaffModal">Edit</button>
                <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
            </td>
        `;

        // Append new row
        staffTableBody.appendChild(newRow);

        // Clear form
        clearForm(staffForm);
    });

    // Handle edit and delete button clicks
    staffTableBody.addEventListener("click", (event) => {
        const target = event.target;

        if (target.classList.contains("editBtn")) {
            const row = target.closest("tr");
            editingRow = row;

            // Populate the modal with the current row data
            document.getElementById("editStaffId-staff").value = row.cells[0].textContent;
            document.getElementById("editFirstName").value = row.cells[1].textContent;
            document.getElementById("editLastName").value = row.cells[2].textContent;
            document.getElementById("editDesignation").value = row.cells[3].textContent;
            document.getElementById("editGender").value = row.cells[4].textContent;
            document.getElementById("editBirthDate").value = row.cells[5].textContent;
            document.getElementById("editJoiningDate").value = row.cells[6].textContent;
            const addressParts = row.cells[7].textContent.split(", ");
            document.getElementById("editAddressLine1").value = addressParts[0] || "";
            document.getElementById("editAddressLine2").value = addressParts[1] || "";
            document.getElementById("editAddressLine3").value = addressParts[2] || "";
            document.getElementById("editAddressLine4").value = addressParts[3] || "";
            document.getElementById("editAddressLine5").value = addressParts[4] || "";
            document.getElementById("editPhoneNumber").value = row.cells[8].textContent;
            document.getElementById("editEmail-staff").value = row.cells[9].textContent;
            document.getElementById("editRole").value = row.cells[10].textContent;
            document.getElementById("editLogId").value = row.cells[11].textContent;
        } else if (target.classList.contains("deleteBtn")) {
            // Delete the row
            const row = target.closest("tr");
            row.remove();
        }
    });

    // Handle edit staff form submission
    editStaffForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (editingRow) {
            // Update the editing row with new data from the modal form
            editingRow.cells[1].textContent = document.getElementById("editFirstName").value.trim();
            editingRow.cells[2].textContent = document.getElementById("editLastName").value.trim();
            editingRow.cells[3].textContent = document.getElementById("editDesignation").value.trim();
            editingRow.cells[4].textContent = document.getElementById("editGender").value.trim();
            editingRow.cells[5].textContent = document.getElementById("editBirthDate").value.trim();
            editingRow.cells[6].textContent = document.getElementById("editJoiningDate").value.trim();
            editingRow.cells[7].textContent = [
                document.getElementById("editAddressLine1").value.trim(),
                document.getElementById("editAddressLine2").value.trim(),
                document.getElementById("editAddressLine3").value.trim(),
                document.getElementById("editAddressLine4").value.trim(),
                document.getElementById("editAddressLine5").value.trim(),
            ].filter(line => line).join(", ");
            editingRow.cells[8].textContent = document.getElementById("editPhoneNumber").value.trim();
            editingRow.cells[9].textContent = document.getElementById("editEmail-staff").value.trim();
            editingRow.cells[10].textContent = document.getElementById("editRole").value.trim();
            editingRow.cells[11].textContent = document.getElementById("editLogId").value.trim();

            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("editStaffModal"));
            modal.hide();
        }
    });

    // Clear form on button click
    clearFormButton.addEventListener("click", () => clearForm(staffForm));
});
