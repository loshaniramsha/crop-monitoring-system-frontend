
document.addEventListener("DOMContentLoaded", function () {
    const fieldIdDropdown = document.getElementById("fieldId");
    const staffIdDropdown = document.getElementById("staffId-equipment");
    const editFieldIdDropdown = document.getElementById("editFieldId");
    const editStaffIdDropdown = document.getElementById("editStaffId-equipment");

    // Example data: Replace with API calls if required
    const fields = [
        { id: "F001", name: "Field 1" },
        { id: "F002", name: "Field 2" },
        { id: "F003", name: "Field 3" }
    ];

    const staff = [
        { id: "S001", name: "Staff 1" },
        { id: "S002", name: "Staff 2" },
        { id: "S003", name: "Staff 3" }
    ];

    // Helper function to populate dropdowns
    function populateDropdown(dropdown, data) {
        dropdown.innerHTML = '<option value="">Select</option>'; // Reset and add default option
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            dropdown.appendChild(option);
        });
    }

    // Populate the dropdowns for both add and edit forms
    populateDropdown(fieldIdDropdown, fields);
    populateDropdown(staffIdDropdown, staff);

    // Add Equipment functionality
    const equipmentForm = document.getElementById("equipment-form");
    const equipmentTableBody = document.getElementById("equipment-table").querySelector("tbody");

    equipmentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const equipmentId = document.getElementById("equipmentId").value;
        const equipmentName = document.getElementById("equipmentName").value;
        const equipmentType = document.getElementById("equipmentType").value;
        const equipmentState = document.getElementById("equipmentState").value;
        const fieldId = fieldIdDropdown.value;
        const staffId = staffIdDropdown.value;

        // Add a row to the table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${equipmentId}</td>
            <td>${equipmentName}</td>
            <td>${equipmentType}</td>
            <td>${equipmentState}</td>
            <td>${fields.find(field => field.id === fieldId)?.name || ''}</td>
            <td>${staff.find(st => st.id === staffId)?.name || ''}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-id="${equipmentId}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${equipmentId}">Delete</button>
            </td>
        `;
        equipmentTableBody.appendChild(row);

        equipmentForm.reset();
    });

    // Equipment Table functionality: Edit and Delete
    equipmentTableBody.addEventListener("click", function (event) {
        const row = event.target.closest("tr");
        if (event.target.classList.contains("edit-btn")) {
            // Edit button logic
            const equipmentId = row.cells[0].textContent;
            const equipmentName = row.cells[1].textContent;
            const equipmentType = row.cells[2].textContent;
            const equipmentState = row.cells[3].textContent;
            const fieldName = row.cells[4].textContent;
            const staffName = row.cells[5].textContent;

            // Populate modal fields
            document.getElementById("editEquipmentId").value = equipmentId;
            document.getElementById("editEquipmentName").value = equipmentName;
            document.getElementById("editEquipmentType").value = equipmentType;
            document.getElementById("editEquipmentState").value = equipmentState;

            populateDropdown(editFieldIdDropdown, fields);
            populateDropdown(editStaffIdDropdown, staff);

            editFieldIdDropdown.value = fields.find(field => field.name === fieldName)?.id || "";
            editStaffIdDropdown.value = staff.find(st => st.name === staffName)?.id || "";

            // Show modal
            const editModal = new bootstrap.Modal(document.getElementById("editEquipmentModal"));
            editModal.show();

            // Save changes
            document.getElementById("saveEditBtn").onclick = function () {
                row.cells[1].textContent = document.getElementById("editEquipmentName").value;
                row.cells[2].textContent = document.getElementById("editEquipmentType").value;
                row.cells[3].textContent = document.getElementById("editEquipmentState").value;
                row.cells[4].textContent = fields.find(field => field.id === editFieldIdDropdown.value)?.name || '';
                row.cells[5].textContent = staff.find(st => st.id === editStaffIdDropdown.value)?.name || '';

                // Hide modal after saving
                editModal.hide();
            };
        } else if (event.target.classList.contains("delete-btn")) {
            // Delete button logic
            if (confirm("Are you sure you want to delete this equipment?")) {
                row.remove();
            }
        }
    });

    // Clear form functionality
    document.getElementById("clearFormBtn-equipment").addEventListener("click", function () {
        equipmentForm.reset();
    });
});
