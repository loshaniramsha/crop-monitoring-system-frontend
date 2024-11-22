initializeEquipment();
function initializeEquipment() {
    loadAllEquipment();
    loadAllFields();
    loadStaffIds();
    nextId();
}
function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment/generateId", // Adjusted to match the generateEquipmentId endpoint
        type: "GET",
        success: function (data) {
            // Assuming the endpoint returns the next ID as a plain string
            $('#equipmentId').val(data);
        },
        error: function (error) {
            console.error("Error generating next ID:", error);
        }
    });
}


// Fetch and load all equipment
function loadAllEquipment() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment",
        type: "GET",
        success: function (data) {
            console.log("Equipment data:", data);  // Add this line to check the structure of the data
            $('#equipment-table tbody').empty();
            data.forEach((equipment) => {
                addEquipmentToTable(equipment);
            });
        },
        error: function (error) {
            console.error("Error loading equipment:", error);
        }
    });
}

// Fetch and populate all fields
function loadAllFields() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        success: function (data) {
            const fieldSelect = $('#fieldId');
            fieldSelect.empty().append('<option value="">Select Field</option>');
            data.forEach(field => {
                fieldSelect.append(`<option value="${field.fieldId}">${field.fieldId}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
        }
    });
}

// Fetch and populate all staff IDs
function loadStaffIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
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
                <button class="btn btn-warning btn-sm" onclick="updateEquipment('${equipment.equipmentId}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEquipment('${equipment.equipmentId}')">Delete</button>
            </td>
        </tr>`;
    $('#equipment-table tbody').append(equipmentRow);
}

// Update equipment (placeholder function)
function updateEquipment(equipmentId) {
    console.log("Update equipment with ID:", equipmentId);
}

// Delete equipment
function deleteEquipment(equipmentId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/equipment/${equipmentId}`,
        type: "DELETE",
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

// Initialize on page load
$(document).ready(function () {
    $("#equipment-form").submit(function (e) {
        e.preventDefault();
        const equipment = {
            name: $("#equipmentName").val(),
            type: $("#equipmentType").val(),
            state: $("#equipmentState").val(),
            fieldCode: $("#fieldId").val(),
            staffId: $("#staffId-equipment").val(),
        };
        $.ajax({
            url: "http://localhost:8080/api/v1/equipment",
            type: "POST",
            data: JSON.stringify(equipment),
            contentType: "application/json",
            success: function () {
                console.log("Equipment added successfully.");
                loadAllEquipment();
                clearForm();
            },
            error: function (error) {
                console.error("Error adding equipment:", error);
            }
        });
    })

});
