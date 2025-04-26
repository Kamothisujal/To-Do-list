const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeSwitcher = document.getElementById('themeSwitcher');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeSwitcher.checked = true;
    }
});

themeSwitcher.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed);
    else if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <div class="task-actions">
                <i class="fas fa-check" onclick="toggleTask(${index})" title="Mark as Done"></i>
                <i class="fas fa-trash-alt" onclick="deleteTask(${index})" title="Delete"></i>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
