initializeLog()
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
            console.log("Logs data:", data);
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
            const cropSelect = $('#cropSelect');
            cropSelect.empty().append('<option value="">Select Crop</option>');
            data.forEach(crop => {
                cropSelect.append(`<option value="${crop.cropId}">${crop.cropName}</option>`);
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
            const fieldSelect = $('#fieldSelect');
            fieldSelect.empty().append('<option value="">Select Field</option>');
            data.forEach(field => {
                fieldSelect.append(`<option value="${field.fieldId}">${field.fieldName}</option>`);
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
            const staffSelect = $('#staffSelect');
            staffSelect.empty().append('<option value="">Select Staff</option>');
            data.forEach(staff => {
                staffSelect.append(`<option value="${staff.staffId}">${staff.staffName}</option>`);
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
        <td><img src="${log.observedImage}" alt="Observed Image" width="100"></td>
        <td>${log.fieldId}</td>
        <td>${log.cropCode}</td>
        <td>${log.staffId}</td>
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
            $('#editFieldSelect').val(log.fieldId || '');
            $('#editCropSelect').val(log.cropId || '');
            $('#editStaffSelect').val(log.staffId || '');
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
        url: `http://localhost:8080/api/v1/monitoringlog/${logData.logCode}`,
        type: "PUT",
        data: JSON.stringify(logData),
        contentType: "application/json",
        success: function () {
            $('#editModal-log').modal('hide');
            loadAllLogs();  // Refresh the log table
        },
        error: function (error) {
            console.error("Error saving changes:", error);
        }
    });
}

function deleteLog(logCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "DELETE",
        success: function () {
            loadAllLogs(); // Refresh the log table
        },
        error: function (error) {
            console.error("Error deleting log:", error);
        }
    });
}

$('#addButton').click(function() {
    const newLog = {
        logCode: $('#logCode').val(),
        logDate: $('#logDate').val(),
        logDetails: $('#logDetails').val(),
        fieldId: $('#fieldSelect').val(),
        cropId: $('#cropSelect').val(),
        staffId: $('#staffSelect').val()
    };
    $.ajax({
        url: 'http://localhost:8080/api/v1/monitoringlog',
        type: 'POST',
        data: JSON.stringify(newLog),
        contentType: 'application/json',
        success: function () {
            loadAllLogs();  // Refresh the log table after adding
        },
        error: function (error) {
            console.error("Error adding new log:", error);
        }
    });
});

$('#clearButton').click(function() {
    $('#monitoring-log-form')[0].reset();  // Reset the form fields
});
