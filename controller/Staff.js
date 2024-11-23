$(document).ready(function() {
    initializeStaff();

    // Initialize all components and load data
    function initializeStaff() {
        loadAllStaff();
        loadAllFields();
        loadAllLogs();
        loadAllVehicles();
        loadAllEquipment();
        nextId();
    }
    function nextId() {
        $.ajax({
            url: "http://localhost:8080/api/v1/staff/generateId", // API endpoint for generating the next Staff ID
            type: "GET",
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


    // Save changes for editing staff
    $('#edit-staff-form').submit(function (e) {
        e.preventDefault();

        const updatedStaff = {
            staffId: $('#editStaffId-staff').val(),
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            designation: $('#editDesignation').val(),
            gender: $('#editGender').val(),
            birthDate: $('#editBirthDate').val(),
            joiningDate: $('#editJoiningDate').val(),
            address: {
                addressLine1: $('#editAddressLine1').val(),
                addressLine2: $('#editAddressLine2').val(),
                addressLine3: $('#editAddressLine3').val(),
                addressLine4: $('#editAddressLine4').val(),
                addressLine5: $('#editAddressLine5').val()
            },
            phoneNumber: $('#editPhoneNumber').val(),
            email: $('#editEmail-staff').val(),
            role: $('#editRole').val(),
            logId: $('#editLogId').val(),
        };

        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${updatedStaff.staffId}`,
            type: "PUT",
            data: JSON.stringify(updatedStaff),
            contentType: "application/json",
            success: function () {
                console.log("Staff updated successfully.");
                loadAllStaff(); // Reload the staff list
                $('#editStaffModal').modal('hide'); // Close the modal
            },
            error: function (error) {
                console.error("Error updating staff:", error);
            }
        });
    });


    // Add new staff
    $(document).ready(function () {
        // Submit new staff form
        $('#staff-form').submit(function (e) {
            e.preventDefault(); // Prevent default form submission

            // Create a new staff object from the form inputs
            const newStaff = {
                staffId: $('#staffId-staff').val(),
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                designation: $('#designation').val(),
                gender: $('#gender').val(),
                birthDate: $('#birthDate').val(),
                joiningDate: $('#joiningDate').val(),
                address: {
                    addressLine1: $('#addressLine1').val(),
                    addressLine2: $('#addressLine2').val(),
                    addressLine3: $('#addressLine3').val(),
                    addressLine4: $('#addressLine4').val(),
                    addressLine5: $('#addressLine5').val()
                },
                phoneNumber: $('#phoneNumber').val(),
                role: $('#role').val(),
                logId: $('#logId-staff').val(),
                email: $('#email-staff').val(),
            };

            // Send the new staff data to the backend
            $.ajax({
                url: "http://localhost:8080/api/v1/staff", // Backend endpoint
                type: "POST",
                data: JSON.stringify(newStaff),
                contentType: "application/json",
                success: function (response) {
                    console.log("Staff added successfully:", response);

                    // Add the new staff to the table
                    addStaffToTable(newStaff);

                    // Reset the form fields
                    $('#staff-form')[0].reset();
                },
                error: function (error) {
                    console.error("Error adding staff:", error);
                }
            });
        });

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

// Function to delete staff record
function deleteStaff(staffId) {
    console.log("Deleting staff with ID:", staffId); // Debugging line
    // Show confirmation dialog before deletion
    if (confirm("Are you sure you want to delete this staff member?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${staffId}`, // API endpoint to delete the staff member
            type: "DELETE",
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

function editStaff(staffId) {
    // You should populate the form fields with the staff data from the API
    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${staffId}`,
        type: "GET",
        success: function (data) {
            // Populate modal fields with the data
            $('#editStaffId-staff').val(data.staffId);
            $('#editFirstName').val(data.firstName);
            $('#editLastName').val(data.lastName);
            $('#editDesignation').val(data.designation);
            $('#editGender').val(data.gender);
            $('#editBirthDate').val(data.birthDate);
            $('#editJoiningDate').val(data.joiningDate);
            $('#editAddressLine1').val(data.addressLine1);
            $('#editAddressLine2').val(data.addressLine2);
            $('#editAddressLine3').val(data.addressLine3);
            $('#editAddressLine4').val(data.addressLine4);
            $('#editAddressLine5').val(data.addressLine5);
            $('#editPhoneNumber').val(data.phoneNumber);
            $('#editRole').val(data.role);
            $('#editLogId-staff').val(data.logId);
            $('#editEmail-staff').val(data.email);
            // Populate other fields similarly
            $('#editStaffModal').modal('show');
        },
        error: function (error) {
            console.error("Error loading staff data for editing:", error);
        }
    });
}

