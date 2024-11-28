initializeFields()
document.addEventListener("DOMContentLoaded", () => {
    const fieldForm = document.getElementById("field-form");
    const fieldTableBody = document.querySelector("#field-table tbody");
    const clearFormButton = document.getElementById("clearFormBtn-field");

    // Initialize fields and populate dropdowns
    initializeFields();

    // Handle form submission
    fieldForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form values
        const fieldCode = document.getElementById("fieldCode-field").value.trim();
        const fieldName = document.getElementById("fieldName").value.trim();
        const fieldLocation = document.getElementById("fieldLocation").value.trim();
        const extentSize = document.getElementById("extentSize").value.trim();
        const logId = document.getElementById("logId-field").value.trim();
        const staffId = document.getElementById("staffId-field").value.trim();
        const cropId = document.getElementById("cropId-field").value.trim();
        const equipmentId = document.getElementById("equipmentId-field").value.trim();

        // Get image files (if any)
        const fieldImage1 = document.getElementById("fieldImage1");
        const fieldImage2 = document.getElementById("fieldImage2");

        // Handle image uploads
        const image1Url = await handleImageUpload(fieldImage1);
        const image2Url = await handleImageUpload(fieldImage2);

        // Validation
        if (!fieldCode || !fieldName || !fieldLocation || !extentSize || !logId || !staffId || !cropId || !equipmentId) {
            alert("Please fill out all required fields!");
            return;
        }

        // Add the new field to the table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${fieldCode}</td>
            <td>${fieldName}</td>
            <td>${fieldLocation}</td>
            <td>${extentSize}</td>
            <td>${logId}</td>
            <td>${staffId}</td>
            <td>${cropId}</td>
            <td>${equipmentId}</td>
            <td>${image1Url ? `<img src="${image1Url}" alt="Image 1" width="100">` : '-'}</td>
            <td>${image2Url ? `<img src="${image2Url}" alt="Image 2" width="100">` : '-'}</td>
            <td>
                <button class="btn btn-success btn-sm editBtn">Edit</button>
                <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
            </td>
        `;
        fieldTableBody.appendChild(newRow);

        // Clear the form
        clearForm();
    });

    // Clear form
    clearFormButton.addEventListener("click", clearForm);

    // Handle delete and edit button actions
    fieldTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("deleteBtn")) {
            if (confirm("Are you sure you want to delete this record?")) {
                target.closest("tr").remove();
            }
        } else if (target.classList.contains("editBtn")) {
            const row = target.closest("tr");
            const cells = row.querySelectorAll("td");

            // Populate the form with values for editing
            document.getElementById("fieldCode-field").value = cells[0].textContent;
            document.getElementById("fieldName").value = cells[1].textContent;
            document.getElementById("fieldLocation").value = cells[2].textContent;
            document.getElementById("extentSize").value = cells[3].textContent;
            document.getElementById("logId-field").value = cells[4].textContent;
            document.getElementById("staffId-field").value = cells[5].textContent;
            document.getElementById("cropId-field").value = cells[6].textContent;
            document.getElementById("equipmentId-field").value = cells[7].textContent;

            row.remove();
        }
    });
});

// Function to initialize all fields
function initializeFields() {
    loadAllFields();
    loadStaffIds();
    loadCropIds();
    loadEquipmentIds();
    loadLogIds();
    FieldNextId();
}
function FieldNextId() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field/generateId",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            document.getElementById("fieldCode-field").value = data;
        },
        error: function (error) {
            console.error(error);
        },
    });
}

// Load all fields
function loadAllFields() {
    $.ajax({
        url: "http://localhost:8080/api/v1/field",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const fieldTableBody = document.querySelector("#field-table tbody");
            fieldTableBody.innerHTML = "";
            data.forEach((field) => {

                let location = field.fieldLocation.x + ", " + field.fieldLocation.y;
                fieldTableBody.innerHTML += `
                <tr>
                    <td>${field.fieldCode}</td>
                    <td>${field.fieldName}</td>
                    <td>${location}</td>
                    <td>${field.extentSize}</td>
                    <td>${field.logCode}</td>
                    <td>${'-'}</td>
                    <td>${'-'}</td>
                    <td>
                        <button class="btn btn-success btn-sm editBtn">Edit</button>
                        <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
                    </td>
                </tr>`;
            });
        },
        error: function (error) {
            console.error(error);
        },
    });
}

// Load options for dropdowns
function loadStaffIds() {
    loadDropdown("http://localhost:8080/api/v1/staff", "staffId-field", "staffId");
}

function loadCropIds() {
    loadDropdown("http://localhost:8080/api/v1/crops", "cropId-field", "cropId");
}

function loadEquipmentIds() {
    loadDropdown("http://localhost:8080/api/v1/equipment", "equipmentId-field", "equipmentId");
}

function loadLogIds() {
    loadDropdown("http://localhost:8080/api/v1/monitoringlog", "logId-field", "logCode");
}

function loadDropdown(url, selectId, key) {
    $.ajax({
        url: url,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log(data);
            const select = document.getElementById(selectId);
            select.innerHTML = `<option value="">Select</option>`;
            data.forEach((item) => {
                const option = document.createElement("option");
                option.value = item[key];
                option.textContent = item[key];
                select.appendChild(option);
            });
        },
        error: function (error) {
            console.error(error);
        },
    });
}

// Image upload handling
function handleImageUpload(fileInput) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } else {
            resolve(null);
        }
    });
}

/*
document.addEventListener("DOMContentLoaded", () => {
    const fieldForm = document.getElementById("field-form");
    const fieldTableBody = document.querySelector("#field-table tbody");
    const clearFormButton = document.getElementById("clearFormBtn-field");

    initializeFields();

    // Handle form submission
    fieldForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form values
        const fieldCode = document.getElementById("fieldCode-field").value.trim();
        const fieldName = document.getElementById("fieldName").value.trim();
        const fieldLocation = document.getElementById("fieldLocation").value.trim();
        const extentSize = document.getElementById("extentSize").value.trim();
        const logId = document.getElementById("logId-field").value.trim();

        // Validate form inputs
        if (!fieldCode || !fieldName || !fieldLocation || !extentSize || !logId) {
            alert("Please fill out all required fields!");
            return;
        }

        // Prepare the field object
        const fieldData = {
            fieldCode: fieldCode,
            fieldName: fieldName,
            fieldLocation: fieldLocation,
            extentSize: parseFloat(extentSize),
            logCode: logId,
        };

        // Make AJAX request to save field
        $.ajax({
            url: "http://localhost:8080/api/v1/field", // Adjust URL based on your API endpoint
            type: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            data: JSON.stringify(fieldData),
            success: function () {
                alert("Field added successfully!");
                loadAllFields(); // Reload all fields
                clearForm(); // Clear the form inputs
            },
            error: function (error) {
                console.error("Error adding field:", error);
                alert("Failed to add field. Please check your input or server configuration.");
            },
        });
    });

    // Clear form
    clearFormButton.addEventListener("click", clearForm);
});*/

$("#field-form")

// Clear form function
function clearForm() {
    $('#fieldName').val('');
    $('#fieldLocation').val('');
    $('#extentSize').val('');
    $('#logId-field').val('');
    $('#fieldImage1').val('');
    $('#fieldImage2').val('');

}

