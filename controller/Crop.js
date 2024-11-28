initializeCrops()
function initializeCrops(){
    loadAllCrops();
    loadAllFields();
    loadAllLogs();
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
                addCropToTable(crop);
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
        $("#logId").val(crop.logId);
        // Show crop image if exists (Optional)
        if (crop.cropImage) {
            // Add an image preview if necessary
        }
        $("#editCropModal").modal("show");
    }
};
// Delete Crop

$(document).ready(function () {
    const crops = [];

    // Add Crop
    $("#crop-form").submit(function (e) {
        e.preventDefault(); // Prevent page reload

        const crop = {
            cropCode: $("#cropCode").val(),
            cropName: $("#cropName").val(),
            scientificName: $("#scientificName").val(),
            cropImage: $("#cropImage")[0].files[0] ? URL.createObjectURL($("#cropImage")[0].files[0]) : '',
            category: $("#category").val(),
            cropSeason: $("#cropSeason").val(),
            fieldCode: $("#fieldCode").val(),
            logId: $("#logId").val(),
        };

        crops.push(crop);
        addCropToTable(crop);
        clearForm();
    });

    // Clear Form Button
    $("#clearFormBtn-crop").click(function () {
        clearForm();
    });

    // Add Crop to Table
    function addCropToTable(crop) {
        const row = `
            <tr id="crop-${crop.cropCode}">
                <td>${crop.cropCode}</td>
                <td>${crop.cropName}</td>
                <td>${crop.scientificName}</td>
                <td>${crop.cropImage ? `<img src="${crop.cropImage}" alt="Crop Image" style="width: 50px;">` : ''}</td>
                <td>${crop.category}</td>
                <td>${crop.cropSeason}</td>
                <td>${crop.fieldCode}</td>
                <td>${crop.logId}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="editCrop('${crop.cropCode}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCrop('${crop.cropCode}')">Delete</button>
                </td>
            </tr>`;
        $("#crop-table tbody").append(row);
    }

    // Clear form function
    function clearForm() {
        $("#crop-form")[0].reset();
    }
});

//delete
function deleteCrop(cropCode) {
    // Show confirmation alert
    const confirmed = confirm("Are you sure you want to delete this crop?");

    if (confirmed) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/crops/' + cropCode, // Ensure correct URL for delete request
            type: 'DELETE',
            success: function () {
                // Remove crop row from the table
                $('#crop-' + cropCode).remove();
                alert("Crop deleted successfully.");
            },
            error: function (xhr, status, error) {
                console.log("Error deleting crop:", error);
                alert("Failed to delete crop.");
            }
        });
    } else {
        alert("Crop deletion canceled.");
    }
}

function loadCropData(cropCode) {
    $.ajax({
        url: `http://localhost:8080/api/v1/crops/${cropCode}`, // API endpoint to fetch crop details
        type: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function(data) {
            $('#modalCropCode').val(data.cropCode);
            $('#modalCropName').val(data.cropName);
            $('#modalScientificName').val(data.scientificName);
            $('#modalCategory').val(data.category);
            $('#modalCropSeason').val(data.cropSeason);
            $('#modalFieldCode').val(data.fieldCode);
            $('#modalLogId').val(data.logCode); // Populate Log ID in the modal dropdown
            $('#updateCropModal').modal('show');
        },
        error: function(xhr, status, error) {
            console.log('Error fetching crop data:', error);
        }
    });
}

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

// Add crop to table after it's added or updated
function addCropToTable(crop) {

    const img = document.createElement('img');
    img.src = crop.observedImage ? "data:image/png;base64," + crop.observedImage : 'default-image.png'; // Use a default image if log.image is null
    img.alt = 'Log Image';
    img.style.width = '50px'; // Adjust size as needed
    img.style.height = '50px';

    const tblBody= document.querySelector('#crop-table tbody');

    console.log("Added crop:", crop);
    const row = `
        <tr id="crop-${crop.cropCode}">
            <td>${crop.cropCode}</td>
            <td>${crop.cropName}</td>
            <td>${crop.scientificName || "N/A"}</td>
            <td>${crop.cropImage ? `<img src="${crop.cropImage}" alt="Crop Image" style="width: 50px;">` : "No Image"}</td>
            <td>${crop.category || "Uncategorized"}</td>
            <td>${crop.cropSeason || "Unknown"}</td>
            <td>${crop.fieldCode || "Not Assigned"}</td>
            <td>${crop.logCode || "Not Assigned"}</td> <!-- Handle missing logId -->
            <td class="actions">
                <button class="btn btn-primary btn-sm" onclick="loadCropData('${crop.cropCode}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCrop('${crop.cropCode}')">Delete</button>
            </td>
        </tr>`;
    $("#crop-table tbody").append(row);
}


// Close the modal
$('.close').on('click', function() {
    $('#updateCropModal').modal('hide'); // Closes the modal when the close button is clicked
});

$("#crop-form").submit(function (e) {
    e.preventDefault(); // Prevent page reload

    // Prepare crop object to send to backend
    const crop = {
        cropCode: $("#cropCode").val(),
        cropName: $("#cropName").val(),
        scientificName: $("#scientificName").val(),
        cropImage: $("#cropImage")[0].files[0], // Getting the image file object
        category: $("#category").val(),
        cropSeason: $("#cropSeason").val(),
        fieldCode: $("#fieldCode").val(),
        logId: $("#logId").val(), // Ensure the selected LogId is captured
    };

    // Check if LogId is selected
    if (!crop.logId) {
        alert("Please select a Log ID.");
        return; // Stop if LogId is not selected
    }

    // Create a FormData object to send data (including image) to the backend
    const formData = new FormData();
    formData.append("cropName", crop.cropName);
    formData.append("scientificName", crop.scientificName);
    formData.append("cropImage", crop.cropImage); // Send the image file
    formData.append("category", crop.category);
    formData.append("cropSeason", crop.cropSeason);
    formData.append("fieldCode", crop.fieldCode);
    formData.append("logId", crop.logId);

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
        success: function(response) {
            alert("Crop saved successfully.");
            // After successful save, you can refresh the table or UI with the new crop
            crops.push(crop);
            addCropToTable(crop);
            clearForm(); // Clear the form
        },
        error: function(xhr, status, error) {
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

