initializeVehicles()

function initializeVehicles() {
    loadAllVehicles();
    loadStaffIds();
    nextId();
}
function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle/generateId",
        type: "GET",
        success: function (data) {
            $('#vehicleCode').val(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function loadAllVehicles() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vehicle",
        type: "GET",
        success: function (data) {
            data.map((vehicle) => {
                addVehicleToTable(vehicle);
            })
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
            const vehicleSelect = document.getElementById('staffId');
            $('#staffId').empty();
            $('#staffId').append(`<option value="">Select</option>`);
            data.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.staffId;
                option.textContent = staff.staffId;
                vehicleSelect.appendChild(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Populate staff IDs
$(document).ready(function () {
    const staffIdSelect = $("#staffId, #editStaffId");
    staffIds.forEach((id) =>
        staffIdSelect.append(`<option value="${id}">${id}</option>`)
    );

    // Handle form submission
    $("#vehicle-form").submit(function (e) {
        e.preventDefault();
        const vehicle = {
            code: $("#vehicleCode").val(),
            license: $("#licensePlateNumber").val(),
            type: $("#vehicleType").val(),
            state: $("#vehicleStates").val(),
            staffId: $("#staffId").val(),
            remark: $("#vehiceRemark").val(),
        };

        if (!vehicles.find((v) => v.code === vehicle.code)) {
            vehicles.push(vehicle);
            addVehicleToTable(vehicle);
            clearForm();
        } else {
            alert("Vehicle with this code already exists.");
        }
    });

    // Clear form button
    $("#clearFormBtn").click(clearForm);
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
                <button class="btn btn-primary btn-sm" onclick="editVehicle('${vehicle.code}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteVehicle('${vehicle.code}')">Delete</button>
            </td>
        </tr>`;
    $("#vehicle-table tbody").append(row);
}

// Clear form

// Edit vehicle with modal
function editVehicle(code) {
    const vehicle = vehicles.find((v) => v.code === code);

    $("#editVehicleCode").val(vehicle.code);
    $("#editLicensePlate").val(vehicle.license);
    $("#editVehicleType").val(vehicle.type);
    $("#editState").val(vehicle.state);
    $("#editStaffId").val(vehicle.staffId);
    $("#editRemark").val(vehicle.remark);

    // Show modal
    $("#editVehicleModal").modal("show");

    $("#saveEditVehicleBtn").off("click").on("click", function () {
        updateVehicle(code);
    });
}

// Update vehicle logic
function updateVehicle(code) {
    const vehicle = vehicles.find((v) => v.code === code);
    vehicle.license = $("#editLicensePlate").val();
    vehicle.type = $("#editVehicleType").val();
    vehicle.state = $("#editState").val();
    vehicle.staffId = $("#editStaffId").val();
    vehicle.remark = $("#editRemark").val();

    const row = $(`#row-${code}`);
    row.find("td:nth-child(2)").text(vehicle.license);
    row.find("td:nth-child(3)").text(vehicle.type);
    row.find("td:nth-child(4)").text(vehicle.state);
    row.find("td:nth-child(5)").text(vehicle.staffId);
    row.find("td:nth-child(6)").text(vehicle.remark);

    $("#editVehicleModal").modal("hide");
}

// Delete vehicle
function deleteVehicle(vehicleCode) {
    if (confirm("Are you sure you want to delete this vehicle?")) {
        vehicles = vehicles.filter((v) => v.code !== vehicleCode); // Correct vehicle property
        const row = $(`#row-${vehicleCode}`);
        row.remove();

        $.ajax({
            url: `http://localhost:8080/api/v1/vehicle/${vehicleCode}`,
            type: "DELETE",
            success: function () {
                console.log("Vehicle deleted successfully.");
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

function clearForm() {
    $("#licensePlateNumber").val("");
    $("#vehicleType").val("");
    $("#vehicleStates").val("");
    $("#staffId").val("");
    $("#vehiceRemark").val("");
}
$('#clearFormBtn').click(clearForm);