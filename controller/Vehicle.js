
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

$("#vehicle-form").submit(function (e) {
    e.preventDefault(); // Prevent default form submission

    // Create a vehicle object from form input values
    const vehicle = {
        vehicleCode: $("#vehicleCode").val(),
        licensePlateNumber: $("#licensePlateNumber").val(),
        vehicleType: $("#vehicleType").val(),
        state: $("#vehicleStates").val(),
        staffId: $("#staffId").val(),
        remark: $("#vehiceRemark").val(),
    };

    // Send vehicle data to the backend
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle", // Ensure this endpoint matches your backend route
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(vehicle), // Convert the object to JSON format
        success: function (response) {
            // Add the newly saved vehicle to the table
            addVehicleToTable(vehicle);
            // Clear the form fields after the data has been successfully saved
            clearForm();
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error("Error saving vehicle:", error);
            alert("Error saving vehicle. Please try again.");
        }
    });
});

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

function clearForm() {
    $("#licensePlateNumber").val("");
    $("#vehicleType").val("");
    $("#vehicleStates").val("");
    $("#staffId").val("");
    $("#vehiceRemark").val("");
}

// Correctly bind the clear form button click event
$('#clearFormBtn').click(clearForm);

// Initialize vehicle management
$(document).ready(function () {

});

// Function to handle updating vehicle data
function updateVehicle(vehicleCode) {
    // Get updated values from the modal form
    const updatedVehicle = {
        vehicleCode: vehicleCode, // Keep the same vehicle code
        licensePlateNumber: $("#editLicensePlate").val(),
        vehicleType: $("#editVehicleType").val(),
        state: $("#editState").val(),
        staffId: $("#editStaffId").val(),
        remark: $("#editRemark").val(),
    };

    // Send updated data to the backend
    $.ajax({
        url: `http://localhost:8080/api/v1/vehicle/${vehicleCode}`, // Update endpoint with vehicleCode
        type: "PUT", // Use PUT method for updating
        contentType: "application/json",
        data: JSON.stringify(updatedVehicle), // Convert the object to JSON format
        success: function (response) {
            // Update the table row with new data
            const row = $(`#row-${vehicleCode}`);
            row.find("td:nth-child(2)").text(updatedVehicle.licensePlateNumber);
            row.find("td:nth-child(3)").text(updatedVehicle.vehicleType);
            row.find("td:nth-child(4)").text(updatedVehicle.state);
            row.find("td:nth-child(5)").text(updatedVehicle.staffId);
            row.find("td:nth-child(6)").text(updatedVehicle.remark);

            // Close the modal
            $("#editVehicleModal").modal("hide");
            loadAllVehicles();

            // Optionally show a success message
            alert("Vehicle updated successfully.");
        },
        error: function (error) {
            console.error("Error updating vehicle:", error);
            alert("There was an error updating the vehicle. Please try again.");
        }
    });
}

// Binding Save Changes button in the modal
$("#saveEditVehicleBtn").off("click").on("click", function () {
    const vehicleCode = $("#editVehicleCode").val(); // Retrieve the vehicleCode from the modal
    updateVehicle(vehicleCode); // Call the updateVehicle function with the vehicleCode
});

