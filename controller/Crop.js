initializeCrops()
function initializeCrops(){
    loadAllCrops();
    loadAllFields();
    loadAllLogs();
}
function loadAllCrops(){
    $.ajax({
        url: "http://localhost:8080/api/v1/crops",
        type: "GET",
        success: function (data) {
            data.map((crop) => {
                addCropToTable(crop);
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function loadAllFields(){
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
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
        success: function (data) {
            const logSelect = document.getElementById('logId');
            $('#logId').empty();
            $('#logId').append(`<option value="">Select</option>`);
            data.forEach(log => {
                const option = document.createElement('option');
                option.value = log.logId;
                option.textContent = log.logId;
                logSelect.appendChild(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    const crops = [];

    // Add Crop
    // Clear Form

    $("#crop-form").submit(function (e) {
        e.preventDefault(); // Prevent page reload

        // Collect the data from form fields
        const crop = {
            cropCode: $("#cropCode").val(),
            cropName: $("#cropName").val(),
            scientificName: $("#scientificName").val(),
            cropImage: $("#cropImage")[0].files[0] ? URL.createObjectURL($("#cropImage")[0].files[0]) : '',  // Use the file object URL if available
            category: $("#category").val(),
            cropSeason: $("#cropSeason").val(),
            fieldCode: $("#fieldCode").val(),
            logId: $("#logId").val()
        };

        // Add the crop to the array and update the table
        crops.push(crop);
        addCropToTable(crop);

        // Clear the form after adding
        clearForm();
    });
    $("#clearFormBtn-crop").click(function () {
        clearForm();
    });







    // Ensure all the DOM elements exist before attaching events
    $(function () {
        if ($("#crop-form").length && $("#clearFormBtn-crop").length) {
            $("#crop-form").submit(function (e) {
                e.preventDefault();
            });
        }
    });

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
window.deleteCrop = function (cropCode) {
    const index = crops.findIndex(c => c.cropCode === cropCode);
    if (index !== -1) {
        crops.splice(index, 1);
        $(`#crop-${cropCode}`).remove();
    }
};

// Clear form
function clearForm() {
    $("#crop-form")[0].reset();
    $("#cropImage").val(''); // Reset the file input
}
