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
    
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    
    // Добавляем класс для анимации и делаем элемент перетаскиваемым
    li.classList.add('adding');
    li.draggable = true;
    
    listContainer.appendChild(li);
    
    li.addEventListener('animationend', function(e) {
        if (e.animationName === 'slideIn') {
            li.classList.remove('adding');
        }
    });
    
    inputBox.value = '';
    saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName === "SPAN") {
        const li = e.target.parentElement;
        // Сохраняем текущую высоту элемента
        const height = li.offsetHeight;
        li.style.setProperty('--height', height + 'px');
        
        // Добавляем класс для анимации
        li.classList.add('removing');
        
        // Удаляем элемент после завершения анимации
        li.addEventListener('animationend', function(e) {
            if (e.animationName === 'collapseHeight') {
                li.remove();
                saveData();
            }
        });
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

function showTask() {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        listContainer.innerHTML = savedData;
        const items = listContainer.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            item.classList.remove('adding', 'removing', 'dragging');
            item.draggable = true; // Делаем элементы перетаскиваемыми после загрузки
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
    const now = new Date(); 
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Форматируем часы, минуты и секунды с ведущими нулями
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("secondes").textContent = seconds.toString().padStart(2, '0');
}    

setInterval(updateClock , 1000); 
updateClock();

// Восстанавливаем обработчики drag and drop
listContainer.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.add('dragging');
    }
});

listContainer.addEventListener('dragend', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        saveData();
    }
});

listContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'LI') {
        const draggingItem = document.querySelector('.dragging');
        const items = [...listContainer.querySelectorAll('li:not(.dragging)')];
        const nextItem = items.find(item => {
            const rect = item.getBoundingClientRect();
            return e.clientY <= rect.top + rect.height / 2;
        });
        
        if (nextItem) {
            listContainer.insertBefore(draggingItem, nextItem);
        } else {
            listContainer.appendChild(draggingItem);
        }
    }
});

// При сохранении данных будем удалять класс анимации
function saveData() {
    // Временно удаляем классы анимации перед сохранением
    const items = listContainer.getElementsByTagName('li');
    Array.from(items).forEach(item => {
        item.classList.remove('removing');
    });
    
    localStorage.setItem("data", listContainer.innerHTML);
}