document.addEventListener("DOMContentLoaded", () => {
    let taskInput = document.querySelector('#taskInput');
    let addBtn = document.querySelector('#addTaskBtn');
    let taskList = document.querySelector('#taskList');

    class Task {
        constructor(id, title, isDone, createdAt) {
            this.id = id;
            this.title = title;
            this.isDone = isDone;
            this.createdAt = createdAt;
        }
        toggleDone() {
            this.isDone = !this.isDone;
        }
    }

    class TaskManager {
        constructor() {
            this.tasks = [];
            this.currentId = 1;
        }

        addTask(title) {
            const newTask = new Task(this.currentId++, title, false, new Date().toLocaleString());
            this.tasks.push(newTask);
        }

        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
        }

        toggleTask(id) {
            const task = this.tasks.find(task => task.id === id);
            if (task) task.toggleDone();
        }

        getAllTasks() {
            return this.tasks;
        }
    }

    // Event listener for Enter key in input field
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
    
    // Initialize TaskManager
    // and render existing tasks if any


    let taskManager = new TaskManager();

    addBtn.addEventListener('click', () => {
        let title = taskInput.value.trim();
        if (title) {
            taskManager.addTask(title);
            renderTask();
            taskInput.value = ''; // Clear input
        }
    });

    taskList.addEventListener('click', (event) => {
        let parentLi = event.target.closest('li');
        if (!parentLi) return;
        let taskId = parseInt(parentLi.getAttribute('data-id'));
        if (event.target.classList.contains('deleteBtn')) {
            taskManager.deleteTask(taskId);
            renderTask();
        } else if (event.target.classList.contains('toggleBtn')) {
            taskManager.toggleTask(taskId);
            renderTask();
        }
    });

    function renderTask() {
        taskList.innerHTML = '';
        const tasks = taskManager.getAllTasks();

        tasks.forEach(task => {
            let li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            if (task.isDone) li.classList.add('completed');

            let taskText = document.createElement('span');
            taskText.textContent = task.title;
            taskText.classList.add('taskText');
            li.appendChild(taskText);

            let div = document.createElement('div');
            div.classList.add('taskInfo');
            li.appendChild(div);

            let timeSpan = document.createElement('span');
            timeSpan.textContent = `Created at: ${task.createdAt}`;
            timeSpan.classList.add('timeSpan');
            div.appendChild(timeSpan);

            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.classList.add('deleteBtn');
            div.appendChild(deleteBtn);

            let toggleBtn = document.createElement('button');
            toggleBtn.textContent = task.isDone ? '↶' : '✓';
            toggleBtn.classList.add('toggleBtn');
            div.appendChild(toggleBtn);

            taskList.appendChild(li);
        });

        // Show summary
        let summary = document.createElement('div');
        summary.classList.add('taskSummary');

        let total = document.createElement('span');
        total.textContent = `Total: ${tasks.length}`;
        summary.appendChild(total);

        let completed = document.createElement('span');
        completed.textContent = `Completed: ${tasks.filter(t => t.isDone).length}`;
        summary.appendChild(completed);

        let pending = document.createElement('span');
        pending.textContent = `Pending: ${tasks.filter(t => !t.isDone).length}`;
        summary.appendChild(pending);

        taskList.appendChild(summary);
    }
});
