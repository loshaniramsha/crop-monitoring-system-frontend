

/*Chart*/
 const chart=document.querySelector('#chart').getContext('2d');

 new Chart(chart,{
     type:'line',
     data:{
         labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
         datasets:[{
             label:'Rainfall',
             data:[12,19,11,15,10,3,12,19,3,5,2,3],
             backgroundColor:'rgb(237,8,68)',
             borderColor:'rgb(147,25,66)',
         },
             {
                 label:'Temperature',
                 data:[13,15,12,13,12,19,3,5,2,3,12,19],
                 backgroundColor:'rgb(5,31,90)',
                 borderColor:'rgb(20,87,209)',
             }]
     },
     options:{
         scales:{
             y:{
                 beginAtZero:true


             },
             x:{
                 beginAtZero:true
             }
            /* yAxes:[{
                 ticks:{
                     beginAtZero:true
                 }
             }]*/
         }
     }
 })


/*media query*/
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const closeSidebarBtn = document.querySelector(".sidebar_close-btn");
    const openSidebarBtn = document.querySelector(".nav_menu-btn");

    // Open sidebar
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener("click", () => {
            sidebar.classList.add("open");
        });
    }

    // Close sidebar
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const openSidebarBtn = document.querySelector(".nav_menu-btn");
    const closeSidebarBtn = document.querySelector(".sidebar_close-btn");

    // Open sidebar
    openSidebarBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    // Close sidebar
    closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
});
/*$$$$$$$$$$*/
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const openSidebarBtn = document.querySelector(".nav_menu-btn");
    const closeSidebarBtn = document.querySelector(".sidebar_close-btn");

    // Open sidebar
    openSidebarBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    // Close sidebar
    closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
});

/*moon button*/
const themeBtn=document.querySelector(".nav_theme-btn");
themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains('dark-theme')){
        themeBtn.innerHTML='<i class="uil uil-sun"></i>';
        localStorage.setItem('current-theme','dark');
    }
    else {
        themeBtn.innerHTML='<i class="uil uil-moon"></i>';
        localStorage.setItem('current-theme','light');
    }
})



$('#user').hide();
$('#crop-section').hide();
$('#vehicle-section').hide();
$('#equipment-section').hide();
$('#field-section').hide();
$('#staff-section').hide();
$('#monitoring-log-section').hide();


$("#user-btn").on("click", function () {
    $("#user").show();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#crop-section").hide();
    $("#equipment-section").hide();
    $("#field-section").hide();
    $("#log").hide();
    $("#staff-section").hide();
    $("#vehicle-section").hide();
})
$("#dashboard-btn").on("click", function () {
    $(".main_header").show();
    $(".main_card").show();
    $(".fast_payment").show();
    $("#chart").show();
    $("#user").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#field").hide();
    $("#log").hide();
    $("#staff").hide();
    $("#vehicle-btn").hide();
})
$("#vehicle-btn").on("click", function () {
    $("#vehicle-section").show();
    $("#user").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
})
$("#crop-btn").on("click", function () {
    $('#crop-section').show();
    $("#user").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#equipment").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#staff-section").hide();
    $("#vehicle-section").hide();
})
$("#equipment-btn").on("click", function () {
    $("#equipment-section").show();
    $("#user").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#crop-section").hide();
    $("#field-section").hide();
    $("#log").hide();
    $("#staff-section").hide();
    $("#vehicle-section").hide();
})
$("#field-btn").on("click", function () {
    $("#field-section").show();
    $("#user").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#log").hide();
    $("#staff-section").hide();
    $("#vehicle-section").hide();
    $("#equipment-section").hide();
})
$("#staff-btn").on("click",function (){
    $("#staff-section").show();
    $("#user").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#field-section").hide();
    $("#monitoring-log-section").hide();
    $("#vehicle-section").hide();
    $("#equipment-section").hide();
})
$("#log-btn").on("click",function (){
    $("#monitoring-log-section").show();
    $("#user").hide();
    $(".main_header").show();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
    $("#crop-section").hide();
    $("#equipment").hide();
    $("#field-section").hide();
    $("#staff-section").hide();
    $("#vehicle-section").hide();
    $("#equipment-section").hide();
})

