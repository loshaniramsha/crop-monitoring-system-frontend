document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.querySelector("#sign-in-btn");
    const signUpBtn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    signUpBtn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });

    signInBtn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
    });
});

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



/*
$('#from').hide();
$("#crop-btn").on("click", function () {
    $("#from").show();
    $(".main_header").hide();
    $(".main_card").hide();
    $(".fast_payment").hide();
    $("#chart").hide();
})*/

$('.main_header').hide();
$('.main_card').hide();
$('.fast_payment').hide();
$('#chart').hide();
