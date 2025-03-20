const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

document.addEventListener('DOMContentLoaded', function() {
    inputBox.focus();
});

function addTask(){
    if(inputBox.value.trim() === ''){
        alert("You must write something!");
        return;
    }
    
    const li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    
    li.style.opacity = '0';
    requestAnimationFrame(() => {
        li.style.transition = 'opacity 0.3s ease';
        li.style.opacity = '1';
    });
    
    inputBox.value = '';
    saveData();
}
listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if (!e.target.classList.contains('editing')) {
            const isSpanClick = e.target.querySelector('span').contains(e.target);
            if (!isSpanClick) {
                e.target.classList.toggle("checked");
                saveData();
            }
        }
    }
    else if(e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

listContainer.addEventListener("dblclick", function(e) {
    if(e.target.tagName === "LI") {
        const li = e.target;
        const span = li.querySelector('span');
        const text = li.childNodes[0].textContent;
        
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        input.className = "edit-input";
        
        li.dataset.originalText = text;
        
        li.textContent = '';
        li.appendChild(input);
        li.appendChild(span);
        li.classList.add('editing');
        
        input.focus();
        
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                saveEdit(li, input);
            } else if (event.key === 'Escape') {
                cancelEdit(li);
            }
        });
        
        input.addEventListener('blur', function() {
            saveEdit(li, input);
        });
    }
});

function saveEdit(li, input) {
    const newText = input.value.trim();
    if (newText) {
        const span = li.querySelector('span');
        li.textContent = newText;
        li.appendChild(span);
    } else {
        cancelEdit(li);
    }
    li.classList.remove('editing');
    saveData();
}

function cancelEdit(li) {
    const span = li.querySelector('span');
    li.textContent = li.dataset.originalText;
    li.appendChild(span);
    li.classList.remove('editing');
}

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        listContainer.innerHTML = savedData;
        const items = listContainer.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            item.style.opacity = '1';
        });
    }
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