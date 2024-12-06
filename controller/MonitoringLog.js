initializeLog()
function initializeLog() {
    loadAllLogs();
    loadAllCrops();
    loadAllFields();
    loadStaffIds();
    nextId();
}
function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog/generateId",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $('#logCode').val(data);
        },
        error: function (error) {
            console.error("Error generating next ID:", error);
        }
    });
}

function loadAllLogs() {
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
    const img = document.createElement('img');
    img.src = log.observedImage ? "data:image/png;base64," + log.observedImage : 'default-image.png';
    img.alt = 'Log Image';
    img.style.width = '50px';
    img.style.height = '50px';

    const tableBody = document.getElementById('logTableBody');
    const row = document.createElement('tr');

    // Assign an ID to the row based on the log code
    row.id = `row-${log.logCode}`;

    row.innerHTML = `
        <td>${log.logCode}</td>
        <td>${log.logDate}</td>
        <td>${log.logDetails}</td>
        <td></td>
        <td>
            <button class="btn btn-primary btn-sm" style="background-color: #4CAF50; border-color: #4CAF50;" onclick="editLog('${log.logCode}')">Edit</button>
            <button class="btn btn-danger btn-sm" style="background-color: #f44336; border-color: #f44336;" onclick="deleteLog('${log.logCode}')">Delete</button>
        </td>
    `;

    // Append the image to the third cell
    row.cells[3].appendChild(img);

    // Add the row to the table body
    tableBody.appendChild(row);
}


function editLog(logCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
    const confirmed = confirm("Are you sure you want to delete this log?");
    if (confirmed) { // Ensure the delete action proceeds only if confirmed
        $.ajax({
            url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function () {
                console.log(`Log with code ${logCode} deleted successfully.`);
                loadAllLogs(); // Refresh the log table after deletion
            },
            error: function (error) {
                console.error("Error deleting log:", error);
            }
        });
    }
}

$('#addButton').click(function() {
    // Collect form data
    const logCode = $('#logCode').val();
    const logDate = $('#logDate').val();
    const logDetails = $('#logDetails').val();
    const observedImage = $('#observedImage')[0].files[0];  // For file input

    // Check if all required fields are filled
    if (!logCode || !logDate || !logDetails || !observedImage) {
        alert("Please fill in all fields and upload an image.");
        return;
    }

    // Prepare the FormData object to handle both file and text data
    const formData = new FormData();
    formData.append('logCode', logCode);
    formData.append('logDate', logDate);
    formData.append('logDetails', logDetails);
    formData.append('observedImage', observedImage);

    // Send the data to the server
    $.ajax({
        url: 'http://localhost:8080/api/v1/monitoringlog',
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: formData,
        contentType: false,  // Do not set content type, as FormData sets it automatically
        processData: false,  // Let jQuery handle the data processing
        success: function(response) {
            console.log("Monitoring log added successfully:", response);
            loadAllLogs();  // Reload the logs to display the newly added one
            $('#monitoring-log-form')[0].reset();  // Reset the form after submission
            nextId(); // Optionally, regenerate the next ID for the logCode
        },
        error: function(error) {
            console.error("Error adding new log:", error);
            alert("There was an error while adding the log.");
        }
    });
});


function clear() {
    $('#logDate').val('');
    $('#logDetails').val('');
    $('#observedImage').val('');
}

$('#clearButton').click(clear);      // Attach the clear function properly

// Function to load the data for editing
function editLog(logCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (log) {
            // Populate modal fields with the log data
            $('#editLogCode').val(log.logCode);
            $('#editLogDate').val(log.logDate);
            $('#editLogDetails').val(log.logDetails);
            // Optionally load the image preview if needed
            $('#editobservedImage-log').val(''); // Reset the file input for a new file
            $('#editModal-log').modal('show');  // Show the modal
        },
        error: function (error) {
            console.error("Error fetching log:", error);
        }
    });
}

// Save changes when the "Save Changes" button is clicked
$('#saveEditButton').click(function() {
    const logCode = $('#editLogCode').val();
    const logDate = $('#editLogDate').val();
    const logDetails = $('#editLogDetails').val();
    const observedImage = $('#editobservedImage-log')[0].files[0];  // For the image file

    if (!logDate || !logDetails || (observedImage && observedImage.size === 0)) {
        alert("Please fill in all fields.");
        return;
    }

    const formData = new FormData();
    formData.append('logCode', logCode);
    formData.append('logDate', logDate);
    formData.append('logDetails', logDetails);
    if (observedImage) {
        formData.append('observedImage', observedImage);  // Append the new image if provided
    }

    // Send the updated data to the server
    $.ajax({
        url: `http://localhost:8080/api/v1/monitoringlog/${logCode}`,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log("Log updated successfully:", response);
            loadAllLogs();  // Reload the logs to display the updated log
            $('#editModal-log').modal('hide');  // Close the modal
        },
        error: function (error) {
            console.error("Error updating log:", error);
            alert("There was an error updating the log.");
        }
    });
});

$("#editModal-log").hide();























// Function to populate Log IDs in the dropdown
function populateLogIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog", // Replace with your actual backend API endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Ensure token is correctly stored
        },
        success: function (data) {
            const searchDropdown = $("#searchLogId");
            searchDropdown.empty(); // Clear existing options
            searchDropdown.append('<option value="">Select Log ID</option>'); // Default option

            // Populate dropdown with log codes
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(log => {
                    searchDropdown.append(`<option value="${log.logCode}">${log.logCode}</option>`);
                });
            } else {
                console.warn("No log data found.");
                alert("No Log IDs available.");
            }
        },
        error: function (error) {
            console.error("Error loading Log IDs:", error);
            alert("Failed to load Log IDs. Check your network or API.");
        }
    });
}

// Function to handle search and highlight functionality
$("#searchButton-Log").click(function () {
    const selectedLogId = $("#searchLogId").val();
    if (!selectedLogId) {
        alert("Please select a Log ID.");
        return;
    }

    // Remove any previous highlights
    $("#logTableBody tr").removeClass("highlight-row");

    // Find and highlight the row with the matching ID
    const targetRow = $(`#row-${selectedLogId}`);
    if (targetRow.length > 0) {
        targetRow.addClass("highlight-row");
        // Scroll to the highlighted row
        $('html, body').animate({
            scrollTop: targetRow.offset().top - 100 // Adjust scroll position
        }, 500);
    } else {
        alert("Log ID not found in the table.");
    }
});


// Call this function to initialize the Log IDs dropdown
populateLogIds();
