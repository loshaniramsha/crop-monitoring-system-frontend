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



