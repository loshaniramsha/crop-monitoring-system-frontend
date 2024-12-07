
// Initialize the equipment management functionality
initializeEquipment();

function initializeEquipment() {
    loadAllEquipment();
    loadAllFieldEquipments();
    loadStaffEquipment();
    populateEquipmentSearch();
    nextId();

    // Attach event handlers
    $('#addEquipmentBtn').click(addEquipment);
    $('#clearFormBtn-equipment').click(clearForm);
    $('#equipment-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        addEquipment();
    });
}

function loadAllFieldEquipments() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const fieldSelect = $('#fieldId');
            fieldSelect.empty().append('<option value="">Select Field</option>');
            data.forEach(field => {
                fieldSelect.append(`<option value="${field.fieldCode}">${field.fieldCode}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
        }
    });
}

// Fetch and populate all staff IDs
function loadStaffEquipment() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const staffSelect = $('#staffId-equipment');
            staffSelect.empty().append('<option value="">Select Staff</option>');
            data.forEach(staff => {
                staffSelect.append(`<option value="${staff.staffId}">${staff.staffId}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading staff IDs:", error);
        }
    });
}

// Add a row to the equipment table

function addEquipmentToTable(equipment) {
    const equipmentRow = `
        <tr>
            <td>${equipment.equipmentId}</td>
            <td>${equipment.equipmentName || 'N/A'}</td> <!-- Assuming the name property is 'equipmentName' -->
            <td>${equipment.equipmentType || 'N/A'}</td> <!-- Assuming the type property is 'equipmentType' -->
            <td>${equipment.state || 'N/A'}</td> <!-- Fallback in case of missing state -->
            <td>${equipment.fieldCode || 'N/A'}</td> <!-- Fallback for fieldCode -->
            <td>${equipment.staffId || 'N/A'}</td> <!-- Fallback for staffId -->
            <td>
                <button class="btn btn-warning btn-sm" style="background-color: #4CAF50; border-color: #4CAF50;" onclick="updateEquipment('${equipment.equipmentId}')">Update</button>
                <button class="btn btn-danger btn-sm" style="background-color: #f44336; border-color: #f44336;" onclick="deleteEquipment('${equipment.equipmentId}')">Delete</button>
            </td>
        </tr>`;
    $('#equipment-table tbody').append(equipmentRow);
}


// Delete function
function deleteEquipment(equipmentId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/equipment/${equipmentId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function () {
            console.log("Equipment deleted successfully.");
            loadAllEquipment(); // Reload table after deletion
        },
        error: function (error) {
            console.error("Error deleting equipment:", error);
        }
    });
}
//clear
function clearForm() {
    $("#equipmentName").val("");
    $("#equipmentType").val("");
    $("#equipmentState").val("");
    $("#fieldId").val("");
    $("#staffId-equipment").val("");
}

$('#clearFormBtn-equipment').click(clearForm);

// Update function to open the modal and load equipment details
function updateEquipment(equipmentId) {
    // Fetch equipment details by ID
    $.ajax({
        url: `http://localhost:8080/api/v1/equipment/${equipmentId}`, // API endpoint to get equipment by ID
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (equipment) {
            // Populate modal fields with the equipment data
            $('#editEquipmentId').val(equipment.equipmentId);
            $('#editEquipmentName').val(equipment.equipmentName);
            $('#editEquipmentType').val(equipment.equipmentType);
            $('#editEquipmentState').val(equipment.state);

            // Load field and staff data
            loadModalFieldsAndStaff(equipment.fieldCode, equipment.staffId);

            // Show the modal
            $('#editEquipmentModal').modal('show');
        },
        error: function (error) {
            console.error("Error fetching equipment details:", error);
        }
    });
}

// Function to load field and staff data into the modal
function loadModalFieldsAndStaff(selectedField, selectedStaff) {
    // Fetch and populate all fields in the modal dropdown
    $.ajax({
        url: "http://localhost:8080/api/v1/field", // API endpoint to get all fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (fields) {
            const fieldSelect = $('#editFieldId');
            fieldSelect.empty().append('<option value="">Select Field</option>'); // Clear existing options
            fields.forEach(field => {
                // Populate field options
                const isSelected = field.fieldCode === selectedField ? 'selected' : '';
                fieldSelect.append(`<option value="${field.fieldCode}" ${isSelected}>${field.fieldCode}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
        }
    });

    // Fetch and populate all staff IDs in the modal dropdown
    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // API endpoint to get all staff
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (staffList) {
            const staffSelect = $('#editStaffId-equipment');
            staffSelect.empty().append('<option value="">Select Staff</option>'); // Clear existing options
            staffList.forEach(staff => {
                // Populate staff options
                const isSelected = staff.staffId === selectedStaff ? 'selected' : '';
                staffSelect.append(`<option value="${staff.staffId}" ${isSelected}>${staff.staffId}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading staff IDs:", error);
        }
    });
}

// Save button click handler to update the equipment
$('#saveEditBtn').click(function () {
    const updatedEquipment = {
        equipmentId: $('#editEquipmentId').val(),
        equipmentName: $('#editEquipmentName').val(),
        equipmentType: $('#editEquipmentType').val(),
        state: $('#editEquipmentState').val(),
        fieldCode: $('#editFieldId').val(),
        staffId: $('#editStaffId-equipment').val()
    };

    // Send updated data to the server
    $.ajax({
        url: `http://localhost:8080/api/v1/equipment/${updatedEquipment.equipmentId}`, // API endpoint to update equipment
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: JSON.stringify(updatedEquipment),
        contentType: "application/json",
        success: function () {
            console.log("Equipment updated successfully.");
            $('#editEquipmentModal').modal('hide'); // Close the modal
            loadAllEquipment(); // Reload the equipment table
        },
        error: function (error) {
            console.error("Error updating equipment:", error);
        }
    });
});

// Form submission handler
$('#equipment-form').submit(function (event) {
    event.preventDefault(); // Prevent default form submission
    addEquipment();
});
$("#editEquipmentModal").hide();


// Generate next equipment ID
function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment/generateId",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $('#equipmentId').val(data);
        },
        error: function (error) {
            console.error("Error generating next ID:", error);
        }
    });
}

// Load all equipment
function loadAllEquipment() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $('#equipment-table tbody').empty();
            data.forEach(equipment => addEquipmentToTable(equipment));
        },
        error: function (error) {
            console.error("Error loading equipment:", error);
        }
    });
}

// Save new equipment
function addEquipment() {
    const equipmentData = {
        equipmentId: $('#equipmentId').val(),
        equipmentName: $('#equipmentName').val(),
        equipmentType: $('#equipmentType').val(),
        state: $('#equipmentState').val(),
        fieldCode: $('#fieldId').val(),
        staffId: $('#staffId-equipment').val(),
    };

    // Validate inputs
    if (!equipmentData.equipmentName || !equipmentData.equipmentType || !equipmentData.state || !equipmentData.fieldCode || !equipmentData.staffId) {
        alert('Please fill in all required fields.');
        return;
    }

    // AJAX request to add equipment
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
        },
        data: JSON.stringify(equipmentData),
        success: function () {
            Swal.fire({
                title: "Successful!",
                text: "Equipment Saved Successfully!",
                icon: "success"
            });
            clearForm();
            nextId();
            loadAllEquipment();
        },
        error: function (error) {
            console.error("Error adding equipment:", error);
            alert("Failed to add equipment. Please check your data and try again.");
        }
    });
}


// Populate the combo box with equipment IDs
function populateEquipmentSearch() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const searchSelect = $('#searchEquipmentId');
            searchSelect.empty().append('<option value="">Select Equipment ID</option>');
            data.forEach(equipment => {
                searchSelect.append(`<option value="${equipment.equipmentId}">${equipment.equipmentId}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading equipment IDs for search:", error);
        }
    });
}

$("#searchButton-equipment").click(function () {
    const selectedEquipmentId = $("#searchEquipmentId").val();

    if (!selectedEquipmentId) {
        alert("Please select an Equipment ID.");
        return;
    }

    // Remove any previous highlights
    $("#equipment-table tbody tr").removeClass("highlight-row");

    // Find the row corresponding to the selected Equipment ID
    const targetRow = $(`#equipment-table tbody tr:has(td:contains('${selectedEquipmentId}'))`);
    if (targetRow.length > 0) {
        targetRow.addClass("highlight-row");
        // Scroll to the row smoothly
        $('html, body').animate({
            scrollTop: targetRow.offset().top - 100
        }, 500);
    } else {
        alert("Equipment ID not found in the table.");
    }
});

// Call populateEquipmentSearch when the page is loaded or data is updated
populateEquipmentSearch();












