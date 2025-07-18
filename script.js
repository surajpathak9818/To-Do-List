document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage when the page loads
    loadTasks();

    // Event listener for adding a task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event listener for handling clicks on task list (complete and delete)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li'); // Get the closest <li> ancestor

        if (!listItem) return; // If clicked outside an li, do nothing

        if (target.classList.contains('complete-btn')) {
            toggleComplete(listItem);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(listItem);
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim(); // Get input value and remove whitespace

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        // Create new list item
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${taskText}</span>
            <div class="task-actions">
                <button class="complete-btn" title="Mark as Complete">✔️</button>
                <button class="delete-btn" title="Delete Task">✖️</button>
            </div>
        `;
        // Initially, tasks are not completed, so add a data attribute for tracking
        listItem.dataset.completed = 'false';

        taskList.appendChild(listItem);
        taskInput.value = ''; // Clear the input field

        saveTasks(); // Save tasks to local storage
    }

    function toggleComplete(listItem) {
        listItem.classList.toggle('completed'); // Toggle the 'completed' class for styling
        // Update the data-completed attribute
        listItem.dataset.completed = listItem.classList.contains('completed').toString();
        saveTasks(); // Save updated state
    }

    function deleteTask(listItem) {
        taskList.removeChild(listItem); // Remove the list item from the DOM
        saveTasks(); // Save updated list
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(listItem => {
            tasks.push({
                text: listItem.querySelector('span').textContent,
                completed: listItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Store as JSON string
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Parse JSON or default to empty array
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" title="Mark as Complete">✔️</button>
                    <button class="delete-btn" title="Delete Task">✖️</button>
                </div>
            `;
            if (task.completed) {
                listItem.classList.add('completed');
                listItem.dataset.completed = 'true';
            } else {
                 listItem.dataset.completed = 'false';
            }
            taskList.appendChild(listItem);
        });
    }
});