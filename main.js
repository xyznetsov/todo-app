const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

document.addEventListener('DOMContentLoaded', function() {
    inputBox.focus();
});

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = '';
    saveData();
}
listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");  // если кликнули на li, то поставиться чекбокс
        saveData();
    }
    else if(e.target.tagName === "SPAN") {
        e.target.parentElement.remove(); // если кликнули на span(крестик), то элемент удалится
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
inputBox.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        addTask();
    }
    });
showTask();

// clock
function updateClock(){ 
    const now  =  new Date(); 
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let session = hours >= 12 ? "PM" : "AM" ;


    hours = hours % 12 ; 
    hours = hours ? hours : 12 ;

    document.getElementById("hours").textContent = hours.toString().padStart(2 , '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2 , '0');
    document.getElementById("secondes").textContent = seconds.toString().padStart(2 , '0');
    document.getElementById("session").textContent = session;

}    

setInterval(updateClock , 1000); 
updateClock();