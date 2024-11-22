$(document).ready(function() {
    initializeStaff();

    // Initialize all components and load data
    function initializeStaff() {
        loadAllStaff();
        loadAllFields();
        loadAllLogs();
        loadAllVehicles();
        loadAllEquipment();
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
                <td>${staff.address}</td>
                <td>${staff.phoneNumber}</td>
                <td>${staff.email}</td>
                <td>${staff.role}</td>
                <td>${staff.logId}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editStaff(${staff.staffId})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStaff(${staff.staffId})">Delete</button>
                </td>
            </tr>
        `;
        $('#staff-table tbody').append(staffRow);
    }

    // Edit staff record (Open Modal)
    function editStaff(staffId) {
        $.ajax({
            url: `http://localhost:8080/api/v1/staff/${staffId}`,
            type: "GET",
            success: function (staff) {
                // Populate the modal with the staff's data
                $('#editStaffId-staff').val(staff.staffId);
                $('#editFirstName').val(staff.firstName);
                $('#editLastName').val(staff.lastName);
                $('#editDesignation').val(staff.designation);
                $('#editGender').val(staff.gender);
                $('#editBirthDate').val(staff.birthDate);
                $('#editJoiningDate').val(staff.joiningDate);
                $('#editAddressLine1').val(staff.address.addressLine1);
                $('#editAddressLine2').val(staff.address.addressLine2);
                $('#editAddressLine3').val(staff.address.addressLine3);
                $('#editAddressLine4').val(staff.address.addressLine4);
                $('#editAddressLine5').val(staff.address.addressLine5);
                $('#editPhoneNumber').val(staff.phoneNumber);
                $('#editEmail-staff').val(staff.email);
                $('#editRole').val(staff.role);
                $('#editLogId').val(staff.logId);

                // Show the modal
                $('#editStaffModal').modal('show');
            },
            error: function (error) {
                console.error("Error loading staff data for edit:", error);
            }
        });
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

    // Delete staff record
    function deleteStaff(staffId) {
        if (confirm("Are you sure you want to delete this staff member?")) {
            $.ajax({
                url: `http://localhost:8080/api/v1/staff/${staffId}`,
                type: "DELETE",
                success: function () {
                    console.log("Staff deleted successfully.");
                    loadAllStaff(); // Reload the staff list
                },
                error: function (error) {
                    console.error("Error deleting staff:", error);
                }
            });
        }
    }

    // Add new staff
    $('#staff-form').submit(function (e) {
        e.preventDefault();

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
            email: $('#email-staff').val(),
            role: $('#role').val(),
            logId: $('#logId-staff').val(),
        };

        $.ajax({
            url: "http://localhost:8080/api/v1/staff",
            type: "POST",
            data: JSON.stringify(newStaff),
            contentType: "application/json",
            success: function () {
                console.log("Staff added successfully.");
                loadAllStaff(); // Reload the staff list
                $('#staff-form')[0].reset(); // Clear the form
            },
            error: function (error) {
                console.error("Error adding staff:", error);
            }
        });
    });

    // Clear form on "Clear" button click
    $('#clearFormBtn-staff').click(function() {
        $('#staff-form')[0].reset();
    });
});
