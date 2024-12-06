initializeAllFields();

function initializeAllFields() {
    loadAllField();
    loadAllLogsFields();
    nextIdField();
}

function nextIdField() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field/generateId",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
           $('#fieldCode-field').val(data);
        },
        error: function (error) {
            console.error("Error generating field code:", error);
        }
    });
}


function loadAllLogsFields() {
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const logSelect = document.getElementById('logId-field');
            $('#logId-field').empty();
            $('#logId-field').append(`<option value="">Select</option>`);
            data.forEach(log => {
                const option = document.createElement('option');
                option.value = log.logCode;
                option.textContent = log.logCode;
                logSelect.appendChild(option);
            });
        },
        error: function (error) {
            console.error("Error loading logs:", error);
        }
    });
}

function loadAllField() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $("#field-table tbody").empty();
            data.forEach((field) => {
                addFieldToTable(field);
            });
        },
        error: function (error) {
            console.error("Error loading fields:", error);
        }
    });
}


function clearFieldForm() {
    $("#logId-field").val("");
   // $("#fieldCode-field").val("");
    $("#fieldName").val("");
    $("#fieldLocation").val("");
    $("#extentSize").val("");
    $("#fieldImage1").val("");
    $("#fieldImage2").val("");
}

// Attach the function to the button click event
$("#clearFormBtn-field").click(clearFieldForm);

$("#fieldModal").hide();

function parseCoordinates(input) {
    const [x, y] = input.split(',').map(Number); // Split the string and convert to numbers
    return { x, y }; // Return as an object
}

$(document).ready(function () {
    // Handle Add Field form submission
    $("#field-form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission behavior



        // Gather form data
        const fieldData = {
            fieldName: $("#fieldName").val(),
            fieldLocation: parseCoordinates($("#fieldLocation").val()),
            extentSize: $("#extentSize").val(),
            logId: $("#logId-field").val(),
        };

        const formData = new FormData();

        // Add field data to FormData individually
        for (const [key, value] of Object.entries(fieldData)) {
            formData.append(key, value);
        }

        // Add files if they are selected
        if ($("#fieldImage1")[0].files.length > 0) {
            formData.append("fieldImage1", $("#fieldImage1")[0].files[0]);
        }
        if ($("#fieldImage2")[0].files.length > 0) {
            formData.append("fieldImage2", $("#fieldImage2")[0].files[0]);
        }

        // Send the data to the backend API
        $.ajax({
            url: "http://localhost:8080/api/v1/field",
            type: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                alert("Field added successfully!");

                // Clear the form
                clearFieldForm();

                loadAllField()
                // Generate the next field ID
                nextIdField();
            },
            error: function (xhr) {
                console.error("Error adding field:", xhr);
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    alert("Failed to add field: " + xhr.responseJSON.message);
                } else {
                    alert("Failed to add field. Check input data and try again.");
                }
            },
        });
    });
});

// Function to dynamically add a field to the table


/*function addFieldToTable(field) {
    const tableBody = document.querySelector("#field-table tbody");

    // Create a new table row
    const row = document.createElement("tr");


    // Populate the row with field data
    row.innerHTML = `
        <td>${field.fieldCode}</td>
        <td>${field.fieldName}</td>
        <td>${field.fieldLocation.x + ", " + field.fieldLocation.y}</td>
        <td>${field.extentSize}</td>
        <td>${field.logCode}</td>
        <td>
            ${
        field.fieldImage1
            ? `<img src="${field.fieldImage1.startsWith("data:image") ? field.fieldImage1 : `data:image/png;base64,${field.fieldImage1}`}" 
                           alt="Field Image 1" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
            : `<img src="https://via.placeholder.com/50?text=No+Image" alt="Placeholder Image" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
    }
        </td>
        <td>
            ${
        field.fieldImage2
            ? `<img src="${field.fieldImage2.startsWith("data:image") ? field.fieldImage2 : `data:image/png;base64,${field.fieldImage2}`}" 
                           alt="Field Image 2" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
            : `<img src="https://via.placeholder.com/50?text=No+Image" alt="Placeholder Image" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
    }
        </td>
        <td class="actions">
            <button class="btn btn-primary editBtn" onclick="editField('${field.fieldCode}')">Edit</button>
            <button class="btn btn-danger deleteBtn" onclick="deleteField('${field.fieldCode}')">Delete</button>
        </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
}*/
function addFieldToTable(field) {
    const tableBody = document.querySelector("#field-table tbody");

    // Create a new table row
    const row = document.createElement("tr");

    // Add the fieldCode as a data attribute to the row
    row.setAttribute("data-field-id", field.fieldCode);

    // Populate the row with field data
    row.innerHTML = `
        <td>${field.fieldCode}</td>
        <td>${field.fieldName}</td>
        <td>${field.fieldLocation.x + ", " + field.fieldLocation.y}</td>
        <td>${field.extentSize}</td>
        <td>${field.logCode}</td>
        <td>
            ${
        field.fieldImage1
            ? `<img src="${field.fieldImage1.startsWith("data:image") ? field.fieldImage1 : `data:image/png;base64,${field.fieldImage1}`}" 
                               alt="Field Image 1" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
            : `<img src="https://via.placeholder.com/50?text=No+Image" alt="Placeholder Image" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
    }
        </td>
        <td>
            ${
        field.fieldImage2
            ? `<img src="${field.fieldImage2.startsWith("data:image") ? field.fieldImage2 : `data:image/png;base64,${field.fieldImage2}`}" 
                               alt="Field Image 2" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
            : `<img src="https://via.placeholder.com/50?text=No+Image" alt="Placeholder Image" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`
    }
        </td>
        <td class="actions">
            <button class="btn btn-primary editBtn" onclick="editField('${field.fieldCode}')">Edit</button>
            <button class="btn btn-danger deleteBtn" onclick="deleteField('${field.fieldCode}')">Delete</button>
        </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
}




$(document).ready(function () {
    // Attach event listeners for dynamically created elements
    $("#field-table").on("click", ".deleteBtn", function () {
        const row = $(this).closest("tr");
        const fieldCode = row.find("td:first").text();

        if (confirm(`Are you sure you want to delete the field with code ${fieldCode}?`)) {
            $.ajax({
                url: `http://localhost:8080/api/v1/field/${fieldCode}`,
                type: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
                success: function () {
                    alert("Field deleted successfully!");
                    row.remove(); // Remove row from table
                },
                error: function (error) {
                    console.error("Error deleting field:", error);
                    alert("Failed to delete the field. Please try again.");
                },
            });
        }
    });

/*    $("#field-table").on("click", ".editBtn", function () {
        const row = $(this).closest("tr");
        const fieldData = {
            fieldCode: row.find("td:eq(0)").text(),
            fieldName: row.find("td:eq(1)").text(),
            fieldLocation: row.find("td:eq(2)").text(),
            extentSize: row.find("td:eq(3)").text(),
            logId: row.find("td:eq(4)").text(),
        };

        // Populate modal fields with existing values
        $("#fieldCodeModal").val(fieldData.fieldCode).prop("disabled", true); // Disable field code editing
        $("#fieldNameModal").val(fieldData.fieldName);
        $("#fieldLocationModal").val(fieldData.fieldLocation);
        $("#extentSizeModal").val(fieldData.extentSize);
        $("#logIdModal").val(fieldData.logId);

        // Open the modal
        $("#fieldModal").modal("show");
    });

    // Handle Edit Modal Save Changes
    $("#edit-field-form").submit(function (event) {
        event.preventDefault();

        const fieldData = {
            fieldName: $("#fieldNameModal").val(),
            fieldLocation: $("#fieldLocationModal").val(),
            extentSize: $("#extentSizeModal").val(),
            logId: $("#logIdModal").val(),
        };

        const fieldCode = $("#fieldCodeModal").val(); // Get the field code (not editable)

        $.ajax({
            url: `http://localhost:8080/api/v1/field/${fieldCode}`,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            contentType: "application/json",
            data: JSON.stringify(fieldData),
            success: function (updatedField) {
                alert("Field updated successfully!");

                // Update the table row with new data
                const row = $(`#field-table tbody tr:has(td:contains(${fieldCode}))`);
                row.find("td:eq(1)").text(updatedField.fieldName);
                row.find("td:eq(2)").text(updatedField.fieldLocation);
                row.find("td:eq(3)").text(updatedField.extentSize);
                row.find("td:eq(4)").text(updatedField.logId);

                // Close the modal
                $("#fieldModal").modal("hide");
            },
            error: function (error) {
                console.error("Error updating field:", error);
                alert("Failed to update the field. Please try again.");
            },
        });
    });

    // Handle Modal Close
    $("#fieldModal").on("hidden.bs.modal", function () {
        $("#edit-field-form")[0].reset(); // Reset form when modal is closed
    });*/
});


$(document).ready(function () {
    // Attach event listeners for dynamically created elements
    $("#field-table").on("click", ".editBtn", function () {
        const row = $(this).closest("tr");
        const fieldData = {
            fieldCode: row.find("td:eq(0)").text(),
            fieldName: row.find("td:eq(1)").text(),
            fieldLocation: row.find("td:eq(2)").text(),
            extentSize: row.find("td:eq(3)").text(),
            logId: row.find("td:eq(4)").text(),
        };

        // Populate modal fields with existing values
        $("#fieldCodeModal").val(fieldData.fieldCode).prop("disabled", true); // Disable field code editing
        $("#fieldNameModal").val(fieldData.fieldName);
        $("#fieldLocationModal").val(fieldData.fieldLocation);
        $("#extentSizeModal").val(fieldData.extentSize);

        // Load all logs into the logIdModal dropdown
        $.ajax({
            url: "http://localhost:8080/api/v1/monitoringlog",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            success: function (logs) {
                const logSelect = $("#logIdModal");
                logSelect.empty(); // Clear existing options
                logSelect.append(`<option value="">Select</option>`); // Add default option

                logs.forEach((log) => {
                    const isSelected = log.logCode === fieldData.logId ? "selected" : "";
                    logSelect.append(
                        `<option value="${log.logCode}" ${isSelected}>${log.logCode}</option>`
                    );
                });

                // Open the modal after the log dropdown is populated
                $("#fieldModal").modal("show");
            },
            error: function (error) {
                console.error("Error loading logs:", error);
                alert("Failed to load log options. Please try again.");
            },
        });
    });

    // Handle Edit Modal Save Changes
    $("#edit-field-form").submit(function (event) {
        event.preventDefault();

        const fieldData = {
            fieldName: $("#fieldNameModal").val(),
            fieldLocation: $("#fieldLocationModal").val(),
            extentSize: $("#extentSizeModal").val(),
            logId: $("#logIdModal").val(),
        };

        const fieldCode = $("#fieldCodeModal").val(); // Get the field code (not editable)

        $.ajax({
            url: `http://localhost:8080/api/v1/field/${fieldCode}`,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            contentType: "application/json",
            data: JSON.stringify(fieldData),
            success: function (updatedField) {
                alert("Field updated successfully!");

                // Update the table row with new data
                const row = $(`#field-table tbody tr:has(td:contains(${fieldCode}))`);
                row.find("td:eq(1)").text(updatedField.fieldName);
                row.find("td:eq(2)").text(updatedField.fieldLocation);
                row.find("td:eq(3)").text(updatedField.extentSize);
                row.find("td:eq(4)").text(updatedField.logId);

                // Close the modal
                $("#fieldModal").modal("hide");
            },
            error: function (error) {
                console.error("Error updating field:", error);
                alert("Failed to update the field. Please try again.");
            },
        });
    });

    // Handle Modal Close
    $("#fieldModal").on("hidden.bs.modal", function () {
        $("#edit-field-form")[0].reset(); // Reset form when modal is closed
    });
});


// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Marker variable
let marker;

// Add click event listener to the map
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    // Update the coordinates in the text
    document.getElementById('fieldLocation').value = `${lat},${lng}`;

    // Add or update the marker
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }
});

// Set location based on input coordinates
function setLocation() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);

    if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);

        // Add or update the marker
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }
    } else {
        alert('Please enter valid coordinates');
    }
}


/*Search*/
document.addEventListener("DOMContentLoaded", function () {
    const fieldIdDropdown = document.getElementById("searchFieldId");
    const searchButton = document.getElementById("searchButton-field");
    const fieldTableBody = document.querySelector("#field-table tbody");

    // Fetch and populate Field ID dropdown
    function populateFieldIds() {
        $.ajax({
            url: "http://localhost:8080/api/v1/field", // Replace with your API endpoint
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token") // Replace token mechanism as per your setup
            },
            success: function (data) {
                fieldIdDropdown.innerHTML = '<option value="">Select Field</option>'; // Reset options
                data.forEach(field => {
                    const option = document.createElement("option");
                    option.value = field.fieldCode; // Use appropriate field code
                    option.textContent = field.fieldCode; // Display field code
                    fieldIdDropdown.appendChild(option);
                });
            },
            error: function (error) {
                console.error("Error loading Field IDs:", error);
            }
        });
    }

    $(document).ready(function () {
        $("#searchButton-field").click(function (event) {
            event.preventDefault(); // Prevent default form submission

            const selectedFieldId = $("#searchFieldId").val(); // Get selected Field ID

            if (!selectedFieldId) {
                alert("Please select a Field ID.");
                return;
            }

            // Remove any previous highlights
            $("#field-table tbody tr").removeClass("highlight-row");

            // Highlight the selected row
            const targetRow = $(`#field-table tbody tr[data-field-id="${selectedFieldId}"]`);
            if (targetRow.length > 0) {
                targetRow.addClass("highlight-row");

                // Scroll to the row
                $("html, body").animate({
                    scrollTop: targetRow.offset().top - 100
                }, 500);
            } else {
                alert("Field ID not found in the table.");
            }
        });
    });

    // Call to populate Field IDs on page load
    populateFieldIds();
});

$(document).ready(function () {
    // Attach event listeners for dynamically created elements
    $("#searchButton-field").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        const selectedFieldId = $("#searchFieldId").val(); // Get selected Field ID

        if (!selectedFieldId) {
            alert("Please select a Field ID.");
            return;
        }

        // Remove any previous highlights
        $("#field-table tbody tr").removeClass("highlight-row");

        // Highlight the selected row by searching for the `data-field-id` attribute
        const targetRow = $(`#field-table tbody tr[data-field-id="${selectedFieldId}"]`);
        if (targetRow.length > 0) {
            targetRow.addClass("highlight-row");

            // Scroll to the row
            $("html, body").animate({
                scrollTop: targetRow.offset().top - 100
            }, 500);
        } else {
            alert("Field ID not found in the table.");
        }
    });
});





