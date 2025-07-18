document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDateInput = document.getElementById('taskDate'); // Get the new date input
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Set today's date as default for the date input
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    taskDateInput.value = `${yyyy}-${mm}-${dd}`;


    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li');

        if (!listItem) return;

        if (target.classList.contains('complete-btn')) {
            toggleComplete(listItem);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(listItem);
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value; // Get the date value (YYYY-MM-DD)

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        // Optional: Add validation for date if needed, though type="date" handles basic format

        const listItem = document.createElement('li');
        // Include the date in the innerHTML for display
        listItem.innerHTML = `
            <span>${taskText} <span class="task-date">(${formatDateForDisplay(taskDate)})</span></span>
            <div class="task-actions">
                <button class="complete-btn" title="Mark as Complete">✔️</button>
                <button class="delete-btn" title="Delete Task">✖️</button>
            </div>
        `;
        listItem.dataset.completed = 'false';
        // Store the date directly in a dataset attribute for easy retrieval
        listItem.dataset.taskDate = taskDate;

        taskList.appendChild(listItem);
        taskInput.value = ''; // Clear task text input
        taskDateInput.value = `${yyyy}-${mm}-${dd}`; // Reset date to today

        saveTasks();
    }

    function toggleComplete(listItem) {
        listItem.classList.toggle('completed');
        listItem.dataset.completed = listItem.classList.contains('completed').toString();
        saveTasks();
    }

    function deleteTask(listItem) {
        taskList.removeChild(listItem);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(listItem => {
            tasks.push({
                text: listItem.querySelector('span').firstChild.textContent.trim(), // Get only task text
                completed: listItem.classList.contains('completed'),
                date: listItem.dataset.taskDate // Save the date
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            // Reconstruct innerHTML with the stored date
            listItem.innerHTML = `
                <span>${task.text} <span class="task-date">(${formatDateForDisplay(task.date)})</span></span>
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
            // Set the dataset.taskDate when loading from storage
            listItem.dataset.taskDate = task.date;
            taskList.appendChild(listItem);
        });
    }

    // Helper function to format date for display (e.g., YYYY-MM-DD to DD/MM/YYYY)
    function formatDateForDisplay(dateString) {
        if (!dateString) return 'No Date';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
});