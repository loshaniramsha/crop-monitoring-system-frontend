function initializeLog() {
    loadAllLogs();
    loadAllCrops();
    loadAllFields();
    loadStaffIds();
}

function loadAllLogs() {
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "GET",
        success: function (data) {
            console.log("Logs data:", data);  // Add this line to check the structure of the data
            $('#logTableBody').empty();  // Correct table body selector
            data.forEach((log) => {
                addLogToTable(log);
            });
        },
        error: function (error) {
            console.error("Error loading logs:", error);
        }
    });
}

function loadAllCrops() {
    $.ajax({
        url: "http://localhost:8080/api/v1/crop",
        type: "GET",
        success: function (data) {
            const cropSelect = $('#cropSelect');  // Correct selector
            cropSelect.empty().append('<option value="">Select Crop</option>');
            data.forEach(crop => {
                cropSelect.append(`<option value="${crop.cropId}">${crop.cropName}</option>`);  // Assuming cropName is the name
            });
        },
        error: function (error) {
            console.error("Error loading crops:", error);
        }
    });
}

function loadAllFields() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        success: function (data) {
            const fieldSelect = $('#fieldSelect');  // Correct selector
            fieldSelect.empty().append('<option value="">Select Field</option>');
            data.forEach(field => {
                fieldSelect.append(`<option value="${field.fieldId}">${field.fieldName}</option>`);  // Assuming fieldName is the name
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
        }
    });
}

function loadStaffIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
        success: function (data) {
            const staffSelect = $('#staffSelect');  // Correct selector
            staffSelect.empty().append('<option value="">Select Staff</option>');
            data.forEach(staff => {
                staffSelect.append(`<option value="${staff.staffId}">${staff.staffName}</option>`);  // Assuming staffName is the name
            });
        },
        error: function (error) {
            console.error("Error loading staff IDs:", error);
        }
    });
}

function addLogToTable(log) {
    const tableBody = $('#logTableBody');
    const row = `<tr>
        <td>${log.logCode}</td>
        <td>${log.logDate}</td>
        <td>${log.logDetails}</td>
        <td><img src="${log.observedImage}" alt="Observed Image" width="100"></td>  <!-- Assuming you return an image URL -->
        <td>${log.fieldName}</td>
        <td>${log.cropName}</td>
        <td>${log.staffName}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editLog('${log.logCode}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteLog('${log.logCode}')">Delete</button>
        </td>
    </tr>`;
    tableBody.append(row);
}

function editLog(logCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "GET",
        success: function (log) {
            $('#editLogCode').val(log.logCode);
            $('#editLogDate').val(log.logDate);
            $('#editLogDetails').val(log.logDetails);
            $('#editFieldSelect').val(log.fieldId);  // Assuming the API returns the field ID
            $('#editCropSelect').val(log.cropId);    // Assuming the API returns the crop ID
            $('#editStaffSelect').val(log.staffId);  // Assuming the API returns the staff ID
            $('#editModal-log').modal('show');
        },
        error: function (error) {
            console.error("Error fetching log:", error);
        }
    });
}

function saveLogChanges() {
    const logData = {
        logCode: $('#editLogCode').val(),
        logDate: $('#editLogDate').val(),
        logDetails: $('#editLogDetails').val(),
        fieldId: $('#editFieldSelect').val(),
        cropId: $('#editCropSelect').val(),
        staffId: $('#editStaffSelect').val()
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "PUT",
        data: JSON.stringify(logData),
        contentType: "application/json",
        success: function () {
            $('#editModal-log').modal('hide');
            loadAllLogs();  // Reload logs after editing
        },
        error: function (error) {
            console.error("Error saving log changes:", error);
        }
    });
}

function deleteLog(logCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "DELETE",
        success: function () {
            loadAllLogs();  // Reload logs after deleting
        },
        error: function (error) {
            console.error("Error deleting log:", error);
        }
    });
}

// Add Monitoring Log
$('#addButton').click(function () {
    const logData = {
        logCode: $('#logCode').val(),
        logDate: $('#logDate').val(),
        logDetails: $('#logDetails').val(),
        observedImage: $('#observedImage').val(),  // Assuming you're handling the image upload separately
        fieldId: $('#fieldSelect').val(),
        cropId: $('#cropSelect').val(),
        staffId: $('#staffSelect').val()
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "POST",
        data: JSON.stringify(logData),
        contentType: "application/json",
        success: function () {
            loadAllLogs();  // Reload logs after adding
            $('#monitoring-log-form')[0].reset();  // Reset form
        },
        error: function (error) {
            console.error("Error adding log:", error);
        }
    });
});

// Clear Form
$('#clearButton').click(function () {
    $('#monitoring-log-form')[0].reset();  // Reset form fields
})
;
