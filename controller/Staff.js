$(document).ready(function() {
    initializeStaff();

    // Initialize all components and load data
    function initializeStaff() {
        loadAllStaff();
        loadAllFields();
        loadAllLogsInStaff();
        loadAllVehicles();
        loadAllEquipment();
        nextId();
        loadAllFieldsInStaff();
    }

    function loadAllLogsInStaff() {
        $.ajax({
            url: "http://localhost:8080/api/v1/monitoringlog",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (data) {
                const logSelect = $('#logId-staff');
                logSelect.empty();
                logSelect.append('<option selected>Select Log</option>');
                data.forEach(log => {
                    logSelect.append(`<option value="${log.logCode}">${log.logCode}</option>`);
                });
            },
            error: function (error) {
                console.error("Error loading logs:", error);
            }
        });
    }

    function nextId() {
        $.ajax({
            url: "http://localhost:8080/api/v1/staff/generateId", // API endpoint for generating the next Staff ID
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (data) {
                if (data) {
                    // Check if data is the expected ID or part of a structured response
                    const nextStaffId = typeof data === "object" ? data.id || data.nextId : data;
                    $('#staffId-staff').val(nextStaffId);
                    console.log("Next ID:", nextStaffId); // Log the extracted ID for debugging
                } else {
                    console.warn("Received empty response for next ID.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error generating next ID:", xhr.responseText || error);
            }
        });
    }

    // Load all staff records from the backend
    function loadAllStaff() {
        $.ajax({
            url: "http://localhost:8080/api/v1/staff",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (data) {
                console.log("Staff data:", data); // Add this line to check the structure of the data
                $('#staff-table tbody').empty();
                data.forEach((staff) => {
                    addStaffToTable(staff);
                });
            },
            error: function (error) {
                console.error("Error loading staff:", error);
            }
        });
    }

    // Add staff data to the table
    function addStaffToTable(staff) {
        const staffRow = `
            <tr data-staff-id="${staff.staffId}">
                <td>${staff.staffId}</td>
                <td>${staff.firstName}</td>
                <td>${staff.lastName}</td>
                <td>${staff.designation}</td>
                <td>${staff.gender}</td>
                <td>${staff.birthDate}</td>
                <td>${staff.joiningDate}</td>
                <td>${staff.addressLine5}</td>
                <td>${staff.phoneNumber}</td>
                <td>${staff.email}</td>
                <td>${staff.role}</td>
                <td>${staff.logCode}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editStaff(${staff.staffId})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStaff(${staff.staffId})">Delete</button>
                </td>
            </tr>
        `;
        $('#staff-table tbody').append(staffRow);
    }

    // Add new staff
    $(document).ready(function () {
        // Submit new staff form
        $('#staff-form').submit(function (e) {
            e.preventDefault(); // Prevent default form submission

            let newStaff = null

            console.log("log id: "+ $('#logId-staff').val())

            if ($('#logId-staff').val() === "Select Log") {
                newStaff = {
                    staffId: $('#staffId-staff').val(),
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    designation: $('#designation').val(),
                    gender: $('#gender').val(),
                    birthDate: $('#birthDate').val(),
                    joiningDate: $('#joiningDate').val(),
                    addressLine1: $('#addressLine1').val(),
                    addressLine2: $('#addressLine2').val(),
                    addressLine3: $('#addressLine3').val(),
                    addressLine4: $('#addressLine4').val(),
                    addressLine5: $('#addressLine5').val(),
                    phoneNumber: $('#phoneNumber').val(),
                    role: $('#role').val(),
                    email: $('#email-staff').val(),
                };
            } else {
                newStaff = {
                    staffId: $('#staffId-staff').val(),
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    designation: $('#designation').val(),
                    gender: $('#gender').val(),
                    birthDate: $('#birthDate').val(),
                    joiningDate: $('#joiningDate').val(),
                    addressLine1: $('#addressLine1').val(),
                    addressLine2: $('#addressLine2').val(),
                    addressLine3: $('#addressLine3').val(),
                    addressLine4: $('#addressLine4').val(),
                    addressLine5: $('#addressLine5').val(),
                    phoneNumber: $('#phoneNumber').val(),
                    role: $('#role').val(),
                    logCode: $('#logId-staff').val(),
                    email: $('#email-staff').val(),
                };
            }

            let staff_field = null

            if ($('#fieldId-staff').val() != "Select Field") {
                staff_field = {
                    staffId: $('#staffId-staff').val(),
                    fieldCode: $('#fieldId-staff').val()
                }
            }

            // Send the new staff data to the backend
            $.ajax({
                url: "http://localhost:8080/api/v1/staff", // Backend endpoint
                type: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify(newStaff),
                contentType: "application/json",
                success: function (response) {
                    console.log("Staff added successfully:", response);

                    if (staff_field != null){
                        saveAssosiate(staff_field)
                    }

                    loadAllStaff()

                    swal.fire({
                        title: "Successful!",
                        text: "Staff added successfully.",
                        icon: "success"
                    })
                    // Reset the form fields
                    $('#staff-form')[0].reset();
                },
                error: function (error) {
                    console.error("Error adding staff:", error);
                }
            });
        });

        function saveAssosiate(staff_field) {

            const formData = new FormData()

            formData.append("staffId", staff_field.staffId)
            formData.append("fieldCode", staff_field.fieldCode)

            $.ajax({
                url: "http://localhost:8080/api/v1/staff",
                type: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("Staff added successfully:", response);
                    alert("saved in assosiate")
                },
                error: function (error) {
                    console.error("Error adding staff:", error);
                }
            })
        }

        // Add a new staff row to the table
        function addStaffToTable(staff) {
            const staffRow = `
            <tr data-staff-id="${staff.staffId}">
                <td>${staff.staffId}</td>
                <td>${staff.firstName}</td>
                <td>${staff.lastName}</td>
                <td>${staff.designation}</td>
                <td>${staff.gender}</td>
                <td>${staff.birthDate}</td>
                <td>${staff.joiningDate}</td>
                <td>${staff.address.addressLine5}</td>
                <td>${staff.phoneNumber}</td>
                <td>${staff.email}</td>
                <td>${staff.role}</td>
                <td>${staff.logId}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editStaff('${staff.staffId}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStaff('${staff.staffId}')">Delete</button>
                </td>
            </tr>
        `;
            $('#staff-table tbody').append(staffRow);
        }
    });


    // Clear form on "Clear" button click
    $('#clearFormBtn-staff').click(function() {
        $('#staff-form')[0].reset();
    });
});

function loadAllFieldsInStaff() {

    $.ajax({
        url: "http://localhost:8080/api/v1/field", // Backend endpoint
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            const fieldSelect = $('#fieldId-staff');
            fieldSelect.empty();
            fieldSelect.append(`<option selected>Select Field</option>`);
            data.forEach(field => {
                fieldSelect.append(`<option value="${field.fieldCode}">${field.fieldCode}</option>`);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

}

// Function to delete staff record
function deleteStaff(staffId) {
    console.log("Deleting staff with ID:", staffId); // Debugging line
    // Show confirmation dialog before deletion
    if (confirm("Are you sure you want to delete this staff member?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${staffId}`, // API endpoint to delete the staff member
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function () {
                console.log(`Staff with ID ${staffId} deleted successfully.`);
                // Remove the row from the table
                $(`tr[data-staff-id="${staffId}"]`).remove(); // This will remove the staff row from the table
            },
            error: function (error) {
                console.error(`Error deleting staff with ID ${staffId}:`, error);
            }
        });
    }
}

// Delegate event for dynamically generated delete buttons
$(document).on('click', '.btn-danger', function() {
    const staffId = $(this).closest('tr').data('staff-id');
    deleteStaff(staffId);
});

// Delegate event for dynamically generated edit buttons
$(document).on('click', '.btn-primary', function() {
    const staffId = $(this).closest('tr').data('staff-id');
    editStaff(staffId);
});
/************/
function editStaff(staffId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${staffId}`, // Backend API to fetch staff details
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (staff) {
            if (staff) {
                // Populate modal fields with fetched staff data
                $('#editStaffId-staff').val(staff.staffId);
                $('#editFirstName').val(staff.firstName);
                $('#editLastName').val(staff.lastName);
                $('#editDesignation').val(staff.designation);
                $('#editGender').val(staff.gender);
                $('#editBirthDate').val(staff.birthDate);
                $('#editJoiningDate').val(staff.joiningDate);
                $('#editAddressLine5').val(staff.addressLine5);
                $('#editPhoneNumber').val(staff.phoneNumber);
                $('#editEmail-staff').val(staff.email);
                $('#editRole').val(staff.role);
                $('#editLogId').val(staff.logCode);

                // Show the modal
                $('#editStaffModal').modal('show');
            } else {
                console.error("No data found for the staff ID:", staffId);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching staff details:", xhr.responseText || error);
        }
    });
}

$('#edit-staff-form').submit(function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect updated staff data from the modal form
    const updatedStaff = {
        staffId: $('#editStaffId-staff').val(),
        firstName: $('#editFirstName').val(),
        lastName: $('#editLastName').val(),
        designation: $('#editDesignation').val(),
        gender: $('#editGender').val(),
        birthDate: $('#editBirthDate').val(),
        joiningDate: $('#editJoiningDate').val(),
        addressLine5: $('#editAddressLine5').val(),
        phoneNumber: $('#editPhoneNumber').val(),
        email: $('#editEmail-staff').val(),
        role: $('#editRole').val(),
        logId: $('#editLogId').val()
    };

    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${updatedStaff.staffId}`, // Backend API to update staff details
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: JSON.stringify(updatedStaff),
        contentType: "application/json", // JSON payload
        success: function (response) {
            console.log("Staff updated successfully:", response);

            // Reload staff data into the table
            loadAllStaff();

            // Hide the modal
            $('#editStaffModal').modal('hide');
        },
        error: function (xhr, status, error) {
            console.error("Error updating staff:", xhr.responseText || error);
            alert(`Failed to update staff: ${xhr.responseText || error}`);
        }
    });
});

function loadAllStaff() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // Backend API to fetch all staff
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            $('#staff-table tbody').empty(); // Clear the table body
            data.forEach((staff) => {
                addStaffToTable(staff); // Add each staff row to the table
            });
        },
        error: function (error) {
            console.error("Error loading staff data:", error);
        }
    });
}

function addStaffToTable(staff) {
    const staffRow = `
        <tr data-staff-id="${staff.staffId}">
            <td>${staff.staffId}</td>
            <td>${staff.firstName}</td>
            <td>${staff.lastName}</td>
            <td>${staff.designation}</td>
            <td>${staff.gender}</td>
            <td>${staff.birthDate}</td>
            <td>${staff.joiningDate}</td>
            <td>${staff.addressLine5}</td>
            <td>${staff.phoneNumber}</td>
            <td>${staff.email}</td>
            <td>${staff.role}</td>
            <td>${staff.logCode}</td>
            <td>
                <button class="btn btn-primary btn-sm" style="background-color: #4CAF50; border-color: #4CAF50;"  onclick="editStaff('${staff.staffId}')">Edit</button>
                <button class="btn btn-danger btn-sm" style="background-color: #f44336; border-color: #f44336;"  onclick="deleteStaff('${staff.staffId}')">Delete</button>
            </td>
        </tr>
    `;
    $('#staff-table tbody').append(staffRow);
}

$("#editStaffModal").hide();

$("#clearFormBtn-staff").click(clearStaffForm)
function clearStaffForm() {
    $('#editFirstName').val('');
    $('#editLastName').val('');
    $('#editDesignation').val('');
    $('#editGender').val('');
    $('#editBirthDate').val('');
    $('#editJoiningDate').val('');
    $('#editAddressLine5').val('');
    $('#editPhoneNumber').val('');
    $('#editEmail-staff').val('');
    $('#editRole').val('');
    $('#editLogId').val('');
}



/*Search*/
// Function to populate Staff IDs in the dropdown
function populateStaffIds() {
    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // Replace with your actual backend API
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token") // Ensure token is correctly stored
        },
        success: function (data) {
            const searchDropdown = $("#searchStaffId");
            searchDropdown.empty(); // Clear existing options
            searchDropdown.append('<option value="">Select Staff ID</option>'); // Default option

            // Populate dropdown with staff IDs
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(staff => {
                    searchDropdown.append(`<option value="${staff.staffId}">${staff.staffId}</option>`);
                });
            } else {
                console.warn("No staff data found.");
                alert("No Staff IDs available.");
            }
        },
        error: function (error) {
            console.error("Error loading Staff IDs:", error);
            alert("Failed to load Staff IDs. Check your network or API.");
        }
    });
}

// Function to highlight the selected row based on Staff ID
$("#searchButtonStaff").click(function () {
    const selectedStaffId = $("#searchStaffId").val();
    if (!selectedStaffId) {
        alert("Please select a Staff ID.");
        return;
    }

    // Remove any previous highlights
    $("#staff-table tbody tr").removeClass("highlight-row");

    // Highlight the relevant row by matching data-staff-id
    const targetRow = $(`tr[data-staff-id="${selectedStaffId}"]`);
    if (targetRow.length > 0) {
        targetRow.addClass("highlight-row");
        // Scroll to the highlighted row
        $('html, body').animate({
            scrollTop: targetRow.offset().top - 100 // Adjust scroll position
        }, 500);
    } else {
        alert("Staff ID not found in the table.");
    }
});

// Initialize by populating Staff IDs
populateStaffIds();



