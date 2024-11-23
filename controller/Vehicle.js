
initializeVehicles();
function initializeVehicles() {
    loadAllVehicles();
    loadStaffIds();
    nextId();
}

function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle/generateId",  // Ensure this endpoint returns a plain string
        type: "GET",
        success: function (data) {
            // Log the response to confirm it's a plain string
            console.log("Generated ID:", data);

            // Set the vehicle code field with the generated ID
            if (data) {
                $('#vehicleCode').val(data);  // Directly set the value
            } else {
                console.error('No ID returned from the server.');
            }
        },
        error: function (error) {
            console.error("Error fetching next vehicle ID:", error);
        }
    });
}

function loadAllVehicles() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle",
        type: "GET",
        success: function (data) {
            vehicles = data;
            data.forEach(vehicle => {
                addVehicleToTable(vehicle);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function loadStaffIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
        success: function (data) {
            staffIds = data;
            const staffSelect = $("#staffId, #editStaffId");
            staffIds.forEach(staff => {
                staffSelect.append(`<option value="${staff.staffId}">${staff.staffId}</option>`);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Add vehicle to the table
function addVehicleToTable(vehicle) {
    const row = `
        <tr id="row-${vehicle.vehicleCode}">
            <td>${vehicle.vehicleCode}</td>
            <td>${vehicle.licensePlateNumber}</td>
            <td>${vehicle.vehicleType}</td>
            <td>${vehicle.state}</td>
            <td>${vehicle.staffId}</td>
            <td>${vehicle.remark}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm" onclick="editVehicle('${vehicle.vehicleCode}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteVehicle('${vehicle.vehicleCode}')">Delete</button>
            </td>
        </tr>`;
    $("#vehicle-table tbody").append(row);
}

// Edit vehicle logic
function editVehicle(vehicleCode) {
    const vehicle = vehicles.find(v => v.vehicleCode === vehicleCode);

    $("#editVehicleCode").val(vehicle.vehicleCode);
    $("#editLicensePlate").val(vehicle.licensePlateNumber);
    $("#editVehicleType").val(vehicle.vehicleType);
    $("#editState").val(vehicle.state);
    $("#editStaffId").val(vehicle.staffId);
    $("#editRemark").val(vehicle.remark);

    // Show modal
    $("#editVehicleModal").modal("show");

    // Handle save button click for editing
    $("#saveEditVehicleBtn").off("click").on("click", function () {
        updateVehicle(vehicleCode);
    });
}

// Update vehicle after editing
function updateVehicle(vehicleCode) {
    const vehicle = vehicles.find(v => v.vehicleCode === vehicleCode);
    vehicle.licensePlateNumber = $("#editLicensePlate").val();
    vehicle.vehicleType = $("#editVehicleType").val();
    vehicle.state = $("#editState").val();
    vehicle.staffId = $("#editStaffId").val();
    vehicle.remark = $("#editRemark").val();

    // Update table row
    const row = $(`#row-${vehicleCode}`);
    row.find("td:nth-child(2)").text(vehicle.licensePlateNumber);
    row.find("td:nth-child(3)").text(vehicle.vehicleType);
    row.find("td:nth-child(4)").text(vehicle.state);
    row.find("td:nth-child(5)").text(vehicle.staffId);
    row.find("td:nth-child(6)").text(vehicle.remark);

    // Close modal
    $("#editVehicleModal").modal("hide");
}

// Delete vehicle logic
function deleteVehicle(vehicleCode) {
    if (confirm("Are you sure you want to delete this vehicle?")) {
        // Remove vehicle from array and update table
        vehicles = vehicles.filter(v => v.vehicleCode !== vehicleCode);
        $(`#row-${vehicleCode}`).remove();

        // Call API to delete the vehicle from the backend
        $.ajax({
            url: `http://localhost:8080/api/v1/vehicle/${vehicleCode}`,
            type: "DELETE",
            success: function () {
                alert("Vehicle deleted successfully.");
            },
            error: function (error) {
                console.error("Error deleting vehicle:", error);
                alert("There was an error deleting the vehicle.");
            }
        });
    } else {
        alert("Vehicle deletion canceled.");
    }
}

// Handle form submission to add vehicle
$("#vehicle-form").submit(function (e) {
    e.preventDefault();

    const vehicle = {
        vehicleCode: $("#vehicleCode").val(),
        licensePlateNumber: $("#licensePlateNumber").val(),
        vehicleType: $("#vehicleType").val(),
        state: $("#vehicleStates").val(),
        staffId: $("#staffId").val(),
        remark: $("#vehiceRemark").val(),
    };

    // Check if vehicle already exists
    if (!vehicles.find(v => v.vehicleCode === vehicle.vehicleCode)) {
        vehicles.push(vehicle);
        addVehicleToTable(vehicle);
        clearForm();
    } else {
        alert("Vehicle with this code already exists.");
    }
});

// Clear form inputs
function clearForm() {
    $("#licensePlateNumber").val("");
    $("#vehicleType").val("");
    $("#vehicleStates").val("");
    $("#staffId").val("");
    $("#vehiceRemark").val("");
}

$('#clearFormBtn').click(clearForm);

// Initialize vehicle management
$(document).ready(function () {

});
