
// Initialize vehicles and load all data
initializeVehicles();
function initializeVehicles() {
    loadAllVehicles();
    loadStaffIds();
    nextId(); // Get the next ID for new vehicle
}

// Generate next vehicle ID (called when adding a new vehicle)
function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle/generateId",  // Ensure this endpoint returns a plain string
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log("Generated ID:", data);
            if (data) {
                $('#vehicleCode').val(data);  // Set the vehicle code field with the generated ID
            } else {
                console.error('No ID returned from the server.');
            }
        },
        error: function (error) {
            console.error("Error fetching next vehicle ID:", error);
        }
    });
}

// Load all vehicles when the page loads or refreshes
function loadAllVehicles() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            vehicles = data;
            // Clear current table data before reloading
            $("#vehicle-table tbody").empty();
            data.forEach(vehicle => {
                addVehicleToTable(vehicle);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Load all staff IDs for the dropdowns (Create/Edit vehicle)
function loadStaffIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            staffIds = data;
            const staffSelect = $("#staffId, #editStaffId");
            staffSelect.empty(); // Clear any existing options
            staffSelect.append(`<option selected>Select Staff Id</option>`);
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
                <button class="btn btn-primary btn-sm"  style="background-color: #4CAF50; border-color: #4CAF50;" onclick="editVehicle('${vehicle.vehicleCode}')">Edit</button>
                <button class="btn btn-danger btn-sm" style="background-color: #f44336; border-color: #f44336;" onclick="deleteVehicle('${vehicle.vehicleCode}')">Delete</button>
            </td>
        </tr>`;
    $("#vehicle-table tbody").append(row);
}

// Edit vehicle logic
function editVehicle(vehicleCode) {
    const vehicle = vehicles.find(v => v.vehicleCode === vehicleCode);

    // Populate modal fields with the current vehicle data
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

// Function to update vehicle data after editing
function updateVehicle(vehicleCode) {
    const updatedVehicle = {
        vehicleCode: vehicleCode,
        licensePlateNumber: $("#editLicensePlate").val(),
        vehicleType: $("#editVehicleType").val(),
        state: $("#editState").val(),
        staffId: $("#editStaffId").val(),
        remark: $("#editRemark").val(),
    };

    // Send updated data to the backend
    $.ajax({
        url: `http://localhost:8080/api/v1/vehicle/${vehicleCode}`,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify(updatedVehicle),
        success: function (response) {
            // Update the table row with new data

            // Close the modal
            $("#editVehicleModal").modal("hide");

            // Optionally show a success message
            Swal.fire({
                title: "Successful!",
                text: "Vehicle updated successfully.",
                icon: "success"
            });

            loadAllVehicles()
        },
        error: function (error) {
            console.error("Error updating vehicle:", error);
            alert("There was an error updating the vehicle. Please try again.");
        }
    });
}

// Delete vehicle logic
function deleteVehicle(vehicleCode) {
    if (confirm("Are you sure you want to delete this vehicle?")) {
        // Call API to delete the vehicle from the backend
        $.ajax({
            url: `http://localhost:8080/api/v1/vehicle/${vehicleCode}`,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function () {
                // Remove the vehicle from the table
                $(`#row-${vehicleCode}`).remove();
                alert("Vehicle deleted successfully.");
            },
            error: function (error) {
                console.error("Error deleting vehicle:", error);
                alert("There was an error deleting the vehicle.");
            }
        });
    }
}

// Save new vehicle form data
$("#vehicle-form").submit(function (e) {
    e.preventDefault(); // Prevent default form submission

    console.log("staff id"+ $("#staffId").val())

    let vehicle = null

    if ($("#staffId").val() === 'Select Staff Id') {
        vehicle = {
            licensePlateNumber: $("#licensePlateNumber").val(),
            vehicleType: $("#vehicleType").val(),
            state: $("#vehicleStates").val(),
            remark: $("#vehiceRemark").val(),
        };
    } else {
        vehicle = {
            licensePlateNumber: $("#licensePlateNumber").val(),
            vehicleType: $("#vehicleType").val(),
            state: $("#vehicleStates").val(),
            staffId: $("#staffId").val(),
            remark: $("#vehiceRemark").val(),
        };
    }

    console.log(vehicle)

    // Create vehicle object from form input values


    // Send vehicle data to the backend
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle", // Ensure this endpoint matches your backend route
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify(vehicle),
        success: function (response) {
            Swal.fire({
                title: "Successful!",
                text: "Vehicle Saved Successfully!",
                icon: "success"
            });

            loadAllVehicles()
            clearForm(); // Clear the form fields after saving
            nextId(); // Reset the vehicle ID for the next vehicle
        },
        error: function (xhr, status, error) {
            console.error("Error saving vehicle:", error);
            alert("Error saving vehicle. Please try again.");
        }
    });
});

// Clear form fields
function clearForm() {
    $("#licensePlateNumber").val("");
    $("#vehicleType").val("");
    $("#vehicleStates").val("");
    $("#staffId").val("");
    $("#vehiceRemark").val("");
}

// Clear form button click event
$('#clearFormBtn').click(clearForm);

// Hide the modal initially
$("#editVehicleModal").hide();















// Populate the combo box with vehicle IDs
function populateVehicleIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle", // Replace with your backend API endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const searchDropdown = $("#searchVehicleId");
            searchDropdown.empty(); // Clear any existing options
            searchDropdown.append('<option value="">Select Vehicle ID</option>'); // Default option
            data.forEach(vehicle => {
                searchDropdown.append(`<option value="${vehicle.vehicleCode}">${vehicle.vehicleCode}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading vehicle IDs for search:", error);
        }
    });
}

// Search functionality to highlight the corresponding row
$("#searchButton").click(function () {
    const selectedVehicleId = $("#searchVehicleId").val();
    if (!selectedVehicleId) {
        alert("Please select a Vehicle ID.");
        return;
    }

    // Remove any previous highlights
    $("#vehicle-table tbody tr").removeClass("highlight-row");

    // Highlight the selected row
    const targetRow = $(`#row-${selectedVehicleId}`);
    if (targetRow.length > 0) {
        targetRow.addClass("highlight-row");
        // Scroll to the row
        $('html, body').animate({
            scrollTop: targetRow.offset().top - 100
        }, 500);
    } else {
        alert("Vehicle ID not found in the table.");
    }
});

// Add this call after loading vehicles
populateVehicleIds();




