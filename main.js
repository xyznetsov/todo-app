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
    
    inputBox.value = ''; // Очищаем поле ввода
    inputBox.focus(); // Возвращаем фокус на поле ввода
    
    saveData();
    updateProgress(); // Добавляем обновление прогресса
}

listContainer.addEventListener("click", function(e) {
    if(e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        updateProgress();
    }
    else if(e.target.tagName === "SPAN") {
        const li = e.target.parentElement;
        const isLastItem = listContainer.querySelectorAll('li').length === 1;
        
        li.classList.add('removing');
        
        if (isLastItem) {
            const todoApp = document.querySelector('.todo-app');
            const progressContainer = document.querySelector('.progress-container');
            
            li.addEventListener('animationend', function(e) {
                if (e.animationName === 'collapseHeight') {
                    li.remove();
                    listContainer.classList.add('empty');
                    todoApp.classList.add('empty');
                    
                    // Добавляем задержку перед скрытием прогресс-бара
                    setTimeout(() => {
                        progressContainer.classList.add('hidden');
                        saveData();
                        updateProgress();
                    }, 200); // Задержка в 200мс
                }
            });
        } else {
            li.addEventListener('animationend', function(e) {
                if (e.animationName === 'collapseHeight') {
                    li.remove();
                    saveData();
                    updateProgress();
                }
            });
        }
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
    updateProgress(); // Добавляем обновление прогресса при загрузке
}

inputBox.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        addTask();
    }
    });

showTask();

// clock
function updateDateTime() {
    const now = new Date();
    
    // Обновляем время
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("secondes").textContent = seconds.toString().padStart(2, '0');
    
    // Обновляем дату
    const options = { 
        day: 'numeric', 
        month: 'long'
    };
    const dateStr = now.toLocaleDateString('ru-RU', options);
    document.getElementById("current-date").textContent = dateStr;
}

setInterval(updateDateTime, 1000);
updateDateTime();

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

// Функция обновления прогресса
function updateProgress() {
    const totalTasks = listContainer.querySelectorAll('li').length;
    const completedTasks = listContainer.querySelectorAll('li.checked').length;
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    
    const progressContainer = document.querySelector('.progress-container');
    const todoApp = document.querySelector('.todo-app');
    
    // Обновляем классы для пустого состояния
    if (totalTasks === 0) {
        progressContainer.classList.add('hidden');
        listContainer.classList.add('empty');
        todoApp.classList.add('empty');
    } else {
        progressContainer.classList.remove('hidden');
        listContainer.classList.remove('empty');
        todoApp.classList.remove('empty');
    }
    
    // Обновляем статистику
    document.getElementById('tasks-completed').textContent = completedTasks;
    document.getElementById('tasks-total').textContent = totalTasks;
    
    const progressFill = document.querySelector('.progress-fill');
    
    // Определяем цвет
    let progressColor;
    if (totalTasks === 0) {
        progressColor = '#888';
    } else if (progressPercent === 100) {
        progressColor = '#2ecc71';
    } else if (progressPercent >= 75) {
        progressColor = '#3498db';
    } else if (progressPercent >= 50) {
        progressColor = '#f1c40f';
    } else if (progressPercent >= 25) {
        progressColor = '#e67e22';
    } else {
        progressColor = '#e74c3c';
    }

    // Обновляем прогресс-бар
    progressFill.style.width = `${progressPercent}%`;
    progressFill.style.backgroundColor = progressColor;
}