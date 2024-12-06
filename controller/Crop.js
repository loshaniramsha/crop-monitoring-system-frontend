initializeCrops()
function initializeCrops(){
    loadAllCrops();
    loadAllFields();
    loadAllLogs();
    populateCropSearch()
    nextId();
}

function nextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/crops/generateId", // Adjusted to match the generateCropId endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            // Assuming the endpoint returns the next ID as a plain string
            $('#cropCode').val(data);
        },
        error: function (error) {
            console.error("Error generating next ID:", error);
        }
    });
}

function loadAllCrops() {
    $.ajax({
        url: "http://localhost:8080/api/v1/crops",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $("#crop-table tbody").empty(); // Clear the table before adding new rows
            data.forEach((crop) => {
                /*addCropToTable(crop);*/
                addCropTable(crop)
            });
        },
        error: function (error) {
            console.log("Error loading crops:", error);
        }
    });
}

function loadAllFields(){
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const fieldSelect = document.getElementById('fieldCode');
            $('#fieldCode').empty();
            $('#fieldCode').append(`<option value="">Select</option>`);
            data.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                fieldSelect.appendChild(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function loadAllLogs(){
    $.ajax({
        url: "http://localhost:8080/api/v1/monitoringlog",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log("Logs:", data); // Ensure data contains `logId`
            /*const logSelect = $("#logId,#editLogId");*/
            const  logSelect=document.getElementById('logId');
            logSelect.innerHTML = '<option value="">Select</option>';
            data.forEach(log => {
                const option = document.createElement('option');
               option.value=log.logCode;
                option.textContent = log.logCode;
                logSelect.appendChild(option);
            });
        },
        error: function (error) {
            console.log("Error loading logs:", error);
        }
    });
}


function deleteCrop(cropCode) {
    // Show confirmation alert
    const confirmed = confirm("Are you sure you want to delete this crop?");

    if (confirmed) {
        $.ajax({
            url: `http://localhost:8080/api/v1/crops/${cropCode}`, // Correct API endpoint for DELETE request
            type: 'DELETE',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token") // Ensure the token is valid
            },
            success: function() {
                // Remove crop row from the table
                $(`#crop-${cropCode}`).remove();
                alert("Crop deleted successfully.");
            },
            error: function(xhr, status, error) {
                console.error("Error deleting crop:", error);

                if (xhr.status === 404) {
                    alert("Crop not found. It may have already been deleted.");
                } else if (xhr.status === 403) {
                    alert("Unauthorized. You do not have permission to delete this crop.");
                } else if (xhr.status === 500) {
                    alert("Server error occurred while deleting the crop.");
                } else {
                    alert("Failed to delete the crop. Please try again.");
                }
            }
        });
    } else {
        alert("Crop deletion canceled.");
    }
}

// Edit Crop
window.editCrop = function (cropCode) {
    const crop = crops.find(c => c.cropCode === cropCode);
    if (crop) {
        $("#cropCode").val(crop.cropCode);
        $("#cropName").val(crop.cropName);
        $("#scientificName").val(crop.scientificName);
        $("#category").val(crop.category);
        $("#cropSeason").val(crop.cropSeason);
        $("#fieldCode").val(crop.fieldCode);
        $("#logId").val(crop.logCode);
        // Show crop image if exists (Optional)
        if (crop.cropImage) {
            // Add an image preview if necessary
        }
        $("#editCropModal").modal("show");
    }
};

// Function to handle crop data update
function updateCropData() {
    const crop = {
        cropCode: $("#modalCropCode").val(),
        cropName: $("#modalCropName").val(),
        scientificName: $("#modalScientificName").val(),
        cropImage: $("#modalCropImage")[0].files[0] ? $("#modalCropImage")[0].files[0] : null,
        category: $("#modalCategory").val(),
        cropSeason: $("#modalCropSeason").val(),
        fieldCode: $("#modalFieldCode").val(),
        logId: $("#modalLogId").val()
    };

    let formData = new FormData();
    for (let key in crop) {
        if (crop[key] !== null) {
            formData.append(key, crop[key]);
        }
    }

    // Send the updated data via AJAX PUT request
    $.ajax({
        url: `http://localhost:8080/api/v1/crops/${crop.cropCode}`,
        type: 'PUT',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log('Crop updated successfully:', data);
            // Update the table row with new data
            updateTableRow(crop);
            $('#updateCropModal').modal('hide'); // Close the modal
        },
        error: function(xhr, status, error) {
            console.log('Error updating crop:', error);
        }
    });
}

// Function to update the table row after a successful update
function updateTableRow(crop) {
    const row = $(`#crop-${crop.cropCode}`);
    row.find('td:nth-child(2)').text(crop.cropName);
    row.find('td:nth-child(3)').text(crop.scientificName);
    row.find('td:nth-child(4)').html(crop.cropImage ? `<img src="${URL.createObjectURL(crop.cropImage)}" alt="Crop Image" style="width: 50px;">` : '');
    row.find('td:nth-child(5)').text(crop.category);
    row.find('td:nth-child(6)').text(crop.cropSeason);
    row.find('td:nth-child(7)').text(crop.fieldCode);
    row.find('td:nth-child(8)').text(crop.logCode);
}

// Handle form submission inside the modal
$('#update-crop-form').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    updateCropData(); // Call the function to update the crop
});

// Close the modal
$('.close').on('click', function() {
    $('#updateCropModal').modal('hide'); // Closes the modal when the close button is clicked
});


window.editCrop = function (cropCode) {
    // Find the crop by its cropCode from the crops array
    const crop = crops.find(c => c.cropCode === cropCode);
    if (crop) {
        // Populate the modal fields with the crop data
        $("#modalCropCode").val(crop.cropCode); // Assuming you have an input with id="modalCropCode"
        $("#modalCropName").val(crop.cropName); // Assuming you have an input with id="modalCropName"
        $("#modalScientificName").val(crop.scientificName); // Assuming you have an input with id="modalScientificName"
        $("#modalCategory").val(crop.category); // Assuming you have an input with id="modalCategory"
        $("#modalCropSeason").val(crop.cropSeason); // Assuming you have an input with id="modalCropSeason"
        $("#modalFieldCode").val(crop.fieldCode); // Assuming you have an input with id="modalFieldCode"
        $("#modalLogId").val(crop.logCode); // Assuming you have an input with id="modalLogId"

        // If there is a crop image, show it in the modal
        if (crop.cropImage) {
            $("#modalCropImagePreview").attr("src", crop.cropImage); // Assuming you have an img element with id="modalCropImagePreview"
        } else {
            $("#modalCropImagePreview").attr("src", 'default-image.png'); // Set to default if no image exists
        }

        // Show the modal after populating the data
        $('#updateCropModal').modal('show');
    }
};

$("#updateCropModal").hide();

function ClearFoem(){
    $("#cropName").val("");
    $("#scientificName").val("");
    $("#category").val("");
    $("#cropSeason").val("");
    $("#fieldCode").val("");
    $("#logId").val("");
    $("#cropImage").val("");
}

$("#clearFormBtn-crop").click(function() {
    ClearFoem();
});


$("#crop-form").submit(function (e) {
    e.preventDefault(); // Prevent page reload

    // Prepare crop object to send to backend
    const crop = {
        cropName: $("#cropName").val(),
        scientificName: $("#scientificName").val(),
        cropImage: $("#cropImage")[0].files[0], // Getting the image file object
        category: $("#category").val(),
        cropSeason: $("#cropSeason").val(),
        fieldCode: $("#fieldCode").val(),
        logId: $("#logId").val() // Ensure the selected LogId is captured
    };

    // Check if LogId is selected
    if (!crop.logId) {
        alert("Please select a Log ID.");
        return; // Stop if LogId is not selected
    }

    // Create a FormData object to send data (including image) to the backend
    const formData = new FormData();
    for (const key in crop) {
        if (crop[key]) {
            formData.append(key, crop[key]);
        }
    }

    // Send the data to the backend via AJAX
    $.ajax({
        url: "http://localhost:8080/api/v1/crops", // Backend API endpoint
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        processData: false, // Don't process the data
        contentType: false, // Set content type to false so jQuery doesn't set it automatically
        data: formData,
        success: function (response) {
            alert("Crop saved successfully.");

            // Add the new crop to the table using the server response
            if (response) {
                addCropToTable({
                    cropCode: response.cropCode, // Ensure these keys match the server response
                    cropName: response.cropName,
                    scientificName: response.scientificName,
                    cropImage: response.cropImage,
                    category: response.category,
                    cropSeason: response.cropSeason,
                    fieldCode: response.fieldCode,
                    logCode: response.logId // Adjust if logId is returned differently
                });
            }

            ClearForm(); // Clear the form
        },
        error: function (xhr, status, error) {
            if (xhr.status === 400) {
                alert("Bad Request: Please check the data you entered.");
            } else if (xhr.status === 500) {
                alert("Internal Server Error. Please try again.");
            } else {
                alert("Error saving crop.");
            }
        }
    });
});

// Function to dynamically add a crop to the table
function addCropTable(crop) {
    const row = `
        <tr id="crop-${crop.cropCode}">
            <td>${crop.cropCode}</td>
            <td>${crop.cropName}</td>
            <td>${crop.scientificName || "N/A"}</td>
            <td>
                ${
        crop.cropImage
            ? `<img src="data:image/png;base64,${crop.cropImage}" alt="Crop Image" style="width: 50px;">`
            : "No Image"
    }
            </td>
            <td>${crop.category || "Uncategorized"}</td>
            <td>${crop.cropSeason || "Unknown"}</td>
            <td>${crop.fieldCode || "Not Assigned"}</td>
            <td>${crop.logCode || "Not Assigned"}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm" style="background-color: #4CAF50; border-color: #4CAF50;" 
                    onclick="loadCropData('${crop.cropCode}')">Edit</button>
                <button class="btn btn-danger btn-sm" style="background-color: #f44336; border-color: #f44336;" 
                    onclick="deleteCrop('${crop.cropCode}')">Delete</button>
            </td>
        </tr>`;
    $("#crop-table tbody").append(row);
}

// Function to clear the form
function ClearForm() {
   // $("#cropCode").val("");
    $("#cropName").val("");
    $("#scientificName").val("");
    $("#category").val("");
    $("#cropSeason").val("");
    $("#fieldCode").val("");
    $("#logId").val("");
    $("#cropImage").val("");
}


const row = `
    <tr id="crop-${crop.cropCode}">
        <td>${crop.cropCode}</td>
        <td>${crop.cropName}</td>
        <td>${crop.scientificName || "N/A"}</td>
        <td>
            ${
    crop.cropImage
        ? `<img src="data:image/png;base64,${crop.cropImage}" alt="Crop Image" style="width: 50px;">`
        : "No Image"
}
        </td>
        <td>${crop.category || "Uncategorized"}</td>
        <td>${crop.cropSeason || "Unknown"}</td>
        <td>${crop.fieldCode || "Not Assigned"}</td>
        <td>${crop.logCode || "Not Assigned"}</td>
        <td class="actions">
            <button class="btn btn-primary btn-sm" 
                style="background-color: #4CAF50; border-color: #4CAF50;" 
                onclick="loadCropData('${crop.cropCode}')">Edit</button>
            <button class="btn btn-danger btn-sm" 
                style="background-color: #f44336; border-color: #f44336;" 
                onclick="deleteCrop('${crop.cropCode}')">Delete</button>
        </td>
    </tr>`;
$("#crop-table tbody").append(row);


function loadCropData(cropCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/crops/${cropCode}`, // Adjust API endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (crop) {
            // Populate modal fields with fetched data
            $("#modalCropCode").val(crop.cropCode);
            $("#modalCropName").val(crop.cropName);
            $("#modalScientificName").val(crop.scientificName);
            $("#modalCategory").val(crop.category);
            $("#modalCropSeason").val(crop.cropSeason);

            // Populate fieldCode dropdown
            $("#modalFieldCode").val(crop.fieldCode).change(); // Ensure the value is selected in the dropdown
            if (!$("#modalFieldCode option[value='" + crop.fieldCode + "']").length) {
                // If the fieldCode is not in the dropdown, add it dynamically
                $("#modalFieldCode").append(
                    `<option value="${crop.fieldCode}">${crop.fieldCode}</option>`
                );
            }

            // Populate logId dropdown
            $("#modalLogId").val(crop.logCode).change(); // Ensure the value is selected in the dropdown
            if (!$("#modalLogId option[value='" + crop.logCode + "']").length) {
                // If the logId is not in the dropdown, add it dynamically
                $("#modalLogId").append(
                    `<option value="${crop.logCode}">${crop.logCode}</option>`
                );
            }

            // If there is a crop image, show a preview
            if (crop.cropImage) {
                $("#modalCropImagePreview").attr("src", `data:image/png;base64,${crop.cropImage}`);
            } else {
                $("#modalCropImagePreview").attr("src", "default-image.png"); // Use a placeholder image
            }

            // Show the modal
            $("#updateCropModal").modal("show");
        },
        error: function (error) {
            console.error("Error loading crop data:", error);
            alert("Failed to load crop data. Please try again.");
        }
    });
}

function populateCropSearch() {
    $.ajax({
        url: "http://localhost:8080/api/v1/crops", // Replace with your endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const searchSelect = $('#searchCropId');
            searchSelect.empty().append('<option value="">Select Crop Code</option>');
            data.forEach(crop => {
                searchSelect.append(`<option value="${crop.cropCode}">${crop.cropCode}</option>`);
            });
        },
        error: function (error) {
            console.error("Error loading crop codes for search:", error);
        }
    });
}

// Search button click event listener
$("#searchButton-crop").click(function () {
    const selectedCropCode = $("#searchCropId").val();

    if (!selectedCropCode) {
        alert("Please select a Crop Code.");
        return;
    }
    $("#crop-table tbody tr").removeClass("highlight-row");
    const targetRow = $(`#crop-table tbody tr:has(td:contains('${selectedCropCode}'))`);
    if (targetRow.length > 0) {
        targetRow.addClass("highlight-row");
        // Scroll to the row smoothly
        $('html, body').animate({
            scrollTop: targetRow.offset().top - 100
        }, 500);
    } else {
        alert("Crop ID not found in the table.");
    }
});


