document.addEventListener("DOMContentLoaded", () => {
    const logTableBody = document.getElementById("logTableBody");
    const form = document.getElementById("monitoring-log-form");
    const editModal = new bootstrap.Modal(document.getElementById("editModal-log"));
    let editingRow = null;
    let uploadedImage = null;

    const fieldsData = [
        { id: 1, name: "Field A" },
        { id: 2, name: "Field B" },
        { id: 3, name: "Field C" }
    ];
    const cropsData = [
        { id: 1, name: "Rice" },
        { id: 2, name: "Wheat" },
        { id: 3, name: "Corn" }
    ];
    const staffData = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "James Brown" }
    ];

    function populateDropdown(selectElement, data) {
        selectElement.innerHTML = '';
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select an option";
        selectElement.appendChild(defaultOption);

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
    }

    const fieldSelect = document.getElementById("fieldSelect");
    const cropSelect = document.getElementById("cropSelect");
    const staffSelect = document.getElementById("staffSelect");
    populateDropdown(fieldSelect, fieldsData);
    populateDropdown(cropSelect, cropsData);
    populateDropdown(staffSelect, staffData);

    // Add Monitoring Log
    document.getElementById("addButton").addEventListener("click", () => {
        const logCode = document.getElementById("logCode").value;
        const logDate = document.getElementById("logDate").value;
        const logDetails = document.getElementById("logDetails").value;
        const field = document.getElementById("fieldSelect").value;
        const crop = document.getElementById("cropSelect").value;
        const staff = document.getElementById("staffSelect").value;

        const image = uploadedImage ? uploadedImage : "No Image";

        if (!logCode || !logDate || !logDetails || !field || !crop || !staff) {
            alert("All fields are required!");
            return;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${logCode}</td>
            <td>${logDate}</td>
            <td>${logDetails}</td>
            <td><img src="${image}" alt="Log Image" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${fieldsData.find(f => f.id == field)?.name}</td>
            <td>${cropsData.find(c => c.id == crop)?.name}</td>
            <td>${staffData.find(s => s.id == staff)?.name}</td>
            <td>
                <button class="btn btn-primary btn-sm editBtn">Edit</button>
                <button class="btn btn-danger btn-sm deleteBtn">Delete</button>
            </td>
        `;
        logTableBody.appendChild(row);
        form.reset();
        uploadedImage = null;
    });

    // Handle Image Upload
    document.getElementById("observedImage").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedImage = URL.createObjectURL(file);
        }
    });

    document.getElementById("clearButton").addEventListener("click", () => {
        form.reset();
        uploadedImage = null;
    });

    logTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("editBtn")) {
            editingRow = target.closest("tr");
            const logCode = editingRow.cells[0].textContent;
            const logDate = editingRow.cells[1].textContent;
            const logDetails = editingRow.cells[2].textContent;
            const field = fieldsData.find(f => f.name === editingRow.cells[4].textContent)?.id;
            const crop = cropsData.find(c => c.name === editingRow.cells[5].textContent)?.id;
            const staff = staffData.find(s => s.name === editingRow.cells[6].textContent)?.id;
            const image = editingRow.cells[3].querySelector("img")?.src;

            document.getElementById("editLogCode").value = logCode;
            document.getElementById("editLogDate").value = logDate;
            document.getElementById("editLogDetails").value = logDetails;
            document.getElementById("editFieldSelect").value = field;
            document.getElementById("editCropSelect").value = crop;
            document.getElementById("editStaffSelect").value = staff;

            document.getElementById("editObservedImage").src = image || "";

            editModal.show();
        }
    });

    document.getElementById("saveEditButton").addEventListener("click", () => {
        if (editingRow) {
            const logCode = document.getElementById("editLogCode").value;
            const logDate = document.getElementById("editLogDate").value;
            const logDetails = document.getElementById("editLogDetails").value;
            const field = document.getElementById("editFieldSelect").value;
            const crop = document.getElementById("editCropSelect").value;
            const staff = document.getElementById("editStaffSelect").value;
            const image = document.getElementById("editObservedImage").src || "No Image";

            editingRow.cells[1].textContent = logDate;
            editingRow.cells[2].textContent = logDetails;
            editingRow.cells[4].textContent = fieldsData.find(f => f.id == field)?.name;
            editingRow.cells[5].textContent = cropsData.find(c => c.id == crop)?.name;
            editingRow.cells[6].textContent = staffData.find(s => s.id == staff)?.name;
            editingRow.cells[3].innerHTML = `<img src="${image}" alt="Log Image" style="width: 50px; height: 50px; object-fit: cover;">`;

            editModal.hide();
        }
    });

    logTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("deleteBtn")) {
            const row = target.closest("tr");
            row.remove();
        }
    });
});
