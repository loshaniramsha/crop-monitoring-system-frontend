
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'Revenue',
            data: [5000, 10000, 7500, 12000, 15000],
            backgroundColor: '#0f3a0c'
        }]
    },
    options: {
        responsive: true,
    }
});

const trafficCtx = document.getElementById('trafficChart').getContext('2d');
new Chart(trafficCtx, {
    type: 'doughnut',
    data: {
        labels: ['Direct', 'Referral', 'Social', 'Email'],
        datasets: [{
            label: 'Crops',
            data: [40, 30, 20, 10],
            backgroundColor: ['#0f3a0c', '#22c55e', '#ef4444', '#fbbf24']
        }]
    },
    options: {
        responsive: true,
    }
});

// Clock and Calendar
function updateClockAndCalendar() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;
}

setInterval(updateClockAndCalendar, 1000);
updateClockAndCalendar();


$('#user').hide();
$('#crop-section').hide();
$('#vehicle-section').hide();
$('#equipment-section').hide();
$('#field-section').hide();
$('#staff-section').hide();
$('#monitoring-log-section').hide();


$("#dashboard-btn").on("click", function () {
    $("#user").hide();
    $("#crop-section").hide();
    $("#vehicle-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").show();
    $("#chart").show();
    $("#card").show();
})
$("#vehicle-btn").on("click", function () {
    $("#vehicle-section").show();
    $("#user").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();

})
$("#user-btn").on("click", function () {
    $("#user").show();
    $("#vehicle-section").hide();
    $("#crop-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})
$("#crop-btn").on("click", function () {
    $("#crop-section").show();
    $("#user").hide();
    $("#vehicle-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})
$("#equipment-btn").on("click", function () {
    $("#equipment-section").show();
    $("#user").hide();
    $("#vehicle-section").hide();
    $("#crop-section").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})
$("#field-btn").on("click", function () {
    $("#field-section").show();
    $("#user").hide();
    $("#vehicle-section").hide();
    $("#crop-section").hide();
    $("#equipment-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})
$("#log-btn").on("click", function () {
    $("#monitoring-log-section").show();
    $("#user").hide();
    $("#vehicle-section").hide();
    $("#crop-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#staff-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})
$("#staff-btn").on("click", function () {
    $("#staff-section").show();
    $("#user").hide();
    $("#vehicle-section").hide();
    $("#crop-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#extras").hide();
    $("#chart").hide();
    $("#card").hide();
})



$("#logout").on("click", function () {
    console.log("click log-out button")
    window.location.href = "index.html";
})

