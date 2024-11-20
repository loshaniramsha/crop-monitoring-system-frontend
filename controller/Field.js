document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const fieldForm = document.getElementById("field-form");
    const fieldTableBody = document.querySelector("#field-table tbody");
    const clearFormButton = document.getElementById("clearFormBtn-field");

    // Mock Data for Populating the Select Dropdowns
    const fields = [
        { id: "F001", name: "Field 1" },
        { id: "F002", name: "Field 2" },
        { id: "F003", name: "Field 3" }
    ];

    const staff = [
        { id: "S001", name: "Staff 1" },
        { id: "S002", name: "Staff 2" },
        { id: "S003", name: "Staff 3" }
    ];

    const crops = [
        { id: "C001", name: "Crop 1" },
        { id: "C002", name: "Crop 2" },
        { id: "C003", name: "Crop 3" }
    ];

    const equipment = [
        { id: "E001", name: "Equipment 1" },
        { id: "E002", name: "Equipment 2" },
        { id: "E003", name: "Equipment 3" }
    ];

    // Function to populate select options dynamically
    function populateSelectOptions() {
        const logSelect = document.getElementById("logId-field");
        const staffSelect = document.getElementById("staffId-field");
        const cropSelect = document.getElementById("cropId-field");
        const equipmentSelect = document.getElementById("equipmentId-field");

        // Populate Log ID dropdown
        fields.forEach(field => {
            const option = document.createElement("option");
            option.value = field.id;
            option.textContent = field.name;
            logSelect.appendChild(option);
        });

        // Populate Staff ID dropdown
        staff.forEach(member => {
            const option = document.createElement("option");
            option.value = member.id;
            option.textContent = member.name;
            staffSelect.appendChild(option);
        });

        // Populate Crops ID dropdown
        crops.forEach(crop => {
            const option = document.createElement("option");
            option.value = crop.id;
            option.textContent = crop.name;
            cropSelect.appendChild(option);
        });

        // Populate Equipment ID dropdown
        equipment.forEach(eq => {
            const option = document.createElement("option");
            option.value = eq.id;
            option.textContent = eq.name;
            equipmentSelect.appendChild(option);
        });
    }

    // Function to clear the form
    function clearForm() {
        fieldForm.reset();
    }

    // Function to handle image file upload and return a data URL
    function handleImageUpload(fileInput) {
        return new Promise((resolve, reject) => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    resolve(reader.result); // Return the base64 data URL of the image
                };
                reader.onerror = reject;
                reader.readAsDataURL(file); // Read the file as a data URL
            } else {
                resolve(null); // No file selected
            }
        });
    }

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

        // Validation check
        if (!fieldCode || !fieldName || !fieldLocation || !extentSize || !logId || !staffId || !cropId || !equipmentId) {
            alert("Please fill out all required fields!");
            return;
        }

        // Create new row for the table
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

        // Append the row to the table body
        fieldTableBody.appendChild(newRow);

        // Clear the form after submission
        clearForm();
    });

    // Event delegation for Edit and Delete
    fieldTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("deleteBtn")) {
            if (confirm("Are you sure you want to delete this record?")) {
                target.closest("tr").remove();
            }
        }

        if (target.classList.contains("editBtn")) {
            const row = target.closest("tr");
            const cells = row.querySelectorAll("td");

            // Populate the form with values from the table row for editing
            document.getElementById("fieldCode-field").value = cells[0].textContent;
            document.getElementById("fieldName").value = cells[1].textContent;
            document.getElementById("fieldLocation").value = cells[2].textContent;
            document.getElementById("extentSize").value = cells[3].textContent;
            document.getElementById("logId-field").value = cells[4].textContent;
            document.getElementById("staffId-field").value = cells[5].textContent;
            document.getElementById("cropId-field").value = cells[6].textContent;
            document.getElementById("equipmentId-field").value = cells[7].textContent;

            // Remove the row for updating
            row.remove();
        }
    });

    // Clear form button
    clearFormButton.addEventListener("click", clearForm);

    // Populate the select dropdowns on page load
    populateSelectOptions();
});
