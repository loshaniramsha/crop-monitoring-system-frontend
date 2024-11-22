function initializeEquipment() {
    loadAllEquipment();
    loadAllFields();
    loadStaffIds();
}

// Fetch and load all equipment
function loadAllEquipment() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipment",
        type: "GET",
        success: function (data) {
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
            <td>${equipment.name}</td>
            <td>${equipment.type}</td>
            <td>${equipment.state}</td>
            <td>${equipment.field ? equipment.field.fieldId : ''}</td>
            <td>${equipment.staff ? equipment.staff.staffId : ''}</td>
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

// Initialize on page load
$(document).ready(function () {
    initializeEquipment();
});
