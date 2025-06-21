/*
============================================================
 TASK MANAGEMENT SYSTEM 
============================================================
 Handles creating, displaying, and managing events/tasks
 Uses jQuery for DOM manipulation and localStorage for data storage
============================================================
*/

// Store all tasks and current sort order
var tasks = [];
var currentSortOrder = 'date-desc';

// Initialize when page loads
$(document).ready(function() {
    loadTasksFromStorage();
    setupEventListeners();
    setupSortingControls();
    displayTasks();
    updateSummary();
});

/*
============================================================
 STORAGE AND EVENT SETUP
============================================================
*/

function loadTasksFromStorage() {
    var savedTasks = localStorage.getItem('highStillTasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
}

function saveTasksToStorage() {
    localStorage.setItem('highStillTasks', JSON.stringify(tasks));
    if (typeof window.updateLatestActivity === 'function') {
        window.updateLatestActivity();
    }
}

function setupEventListeners() {
    $('#addTaskForm').on('submit', function(event) {
        event.preventDefault();
        addNewTask();
    });
}

function setupSortingControls() {
    var sortDropdown = document.querySelector('#taskSortOrder');
    var sortButtonGroup = document.querySelector('.task-sort-buttons');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            currentSortOrder = this.value;
            displayTasks();
        });
    }
    
    if (sortButtonGroup) {
        var sortButtons = sortButtonGroup.querySelectorAll('[data-sort]');
        for (var i = 0; i < sortButtons.length; i++) {
            sortButtons[i].addEventListener('click', function() {
                currentSortOrder = this.getAttribute('data-sort');
                for (var j = 0; j < sortButtons.length; j++) {
                    sortButtons[j].classList.remove('active');
                }
                this.classList.add('active');
                displayTasks();
            });
        }
    }
}

/*
============================================================
 TASK CREATION AND MANAGEMENT
============================================================
*/

function addNewTask() {
    // Get form values
    var title = $('#taskTitle').val().trim();
    var description = $('#taskDescription').val().trim();
    var dueDate = $('#taskDueDate').val();
    var priority = $('#taskPriority').val();
    var location = $('#eventLocation').val().trim();
    
    // Validate required fields
    if (!title || !description || !dueDate || !priority || !location) {
        showNotification('Please fill in all required fields.', 'danger');
        return;
    }
    
    var editingTaskId = $('#addTaskForm').data('editing-task-id');
    
    if (editingTaskId) {
        updateExistingTask(editingTaskId, title, description, dueDate, priority, location);
    } else {
        var newTask = {
            id: Date.now(),
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
            location: location,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasksToStorage();
        clearTaskForm();
        displayTasks();
        updateSummary();
        showNotification('Task added successfully!', 'success');
    }
}

function updateExistingTask(taskId, title, description, dueDate, priority, location) {
    var taskIndex = -1;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            taskIndex = i;
            break;
        }
    }
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
            location: location
        };
        
        saveTasksToStorage();
        clearTaskForm();
        $('#addTaskForm').removeData('editing-task-id');
        $('#addTaskForm button[type="submit"]').html('<i class="fas fa-plus"></i> Add Task');
        displayTasks();
        updateSummary();
        showNotification('Task updated successfully!', 'success');
    }
}

function clearTaskForm() {
    $('#taskTitle, #taskDescription, #taskDueDate, #taskPriority, #eventLocation').val('');
    $('#addTaskForm button[type="submit"]').html('<i class="fas fa-plus"></i> Add Task');
}

/*
============================================================
 TASK DISPLAY AND SORTING
============================================================
*/

function displayTasks() {
    var taskListContainer = $('#taskList');
    taskListContainer.empty();
    
    if (tasks.length === 0) {
        taskListContainer.html('<div class="text-center py-5"><i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i><h3 class="text-muted">No tasks found</h3><p class="text-muted">Add your first task using the form above!</p></div>');
        return;
    }
    
    var sortedTasks = sortTasks(tasks, currentSortOrder);
    
    for (var i = 0; i < sortedTasks.length; i++) {
        var taskCard = createTaskCard(sortedTasks[i]);
        taskListContainer.append(taskCard);
    }
}

function sortTasks(taskArray, sortOrder) {
    var sortedArray = taskArray.slice();
    
    switch (sortOrder) {
        case 'date-asc':
            sortedArray.sort(function(a, b) { return new Date(a.dueDate) - new Date(b.dueDate); });
            break;
        case 'date-desc':
            sortedArray.sort(function(a, b) { return new Date(b.dueDate) - new Date(a.dueDate); });
            break;
        case 'title-asc':
            sortedArray.sort(function(a, b) { return a.title.localeCompare(b.title); });
            break;
        case 'title-desc':
            sortedArray.sort(function(a, b) { return b.title.localeCompare(a.title); });
            break;
        case 'priority':
            var priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            sortedArray.sort(function(a, b) { return priorityOrder[b.priority] - priorityOrder[a.priority]; });
            break;
        default:
            sortedArray.sort(function(a, b) { return b.id - a.id; });
    }
    
    return sortedArray;
}

function createTaskCard(task) {
    var priorityColors = { 'High': 'danger', 'Medium': 'warning', 'Low': 'success' };
    var formattedDate = new Date(task.dueDate).toLocaleDateString();
    
    var taskCard = $('<div class="col-md-6 col-lg-4 mb-4">' +
        '<div class="card h-100 ' + (task.completed ? 'border-success' : 'border-primary') + '">' +
        '<div class="card-header">' +
        '<h5 class="card-title mb-0 ' + (task.completed ? 'text-decoration-line-through' : '') + '">' + task.title + '</h5>' +
        '<span class="badge bg-' + priorityColors[task.priority] + '">' + task.priority + '</span>' +
        '</div>' +
        '<div class="card-body">' +
        '<p class="card-text">' + task.description + '</p>' +
        '<p class="card-text"><small class="text-muted">' +
        '<i class="fas fa-calendar"></i> Due: ' + formattedDate + '<br>' +
        '<i class="fas fa-map-marker-alt"></i> ' + task.location +
        '</small></p>' +
        '</div>' +
        '<div class="card-footer">' +
        '<div class="btn-group w-100" role="group">' +
        '<button class="btn btn-sm ' + (task.completed ? 'btn-success' : 'btn-outline-success') + ' toggle-complete" data-task-id="' + task.id + '">' +
        (task.completed ? 'Completed' : 'Mark Complete') + '</button>' +
        '<button class="btn btn-sm btn-outline-primary edit-task" data-task-id="' + task.id + '">Edit</button>' +
        '<button class="btn btn-sm btn-outline-danger delete-task" data-task-id="' + task.id + '">Delete</button>' +
        '</div></div></div></div>');
    
    // Add event listeners
    taskCard.find('.toggle-complete').on('click', function() { toggleTaskComplete(task.id); });
    taskCard.find('.edit-task').on('click', function() { editTask(task.id); });
    taskCard.find('.delete-task').on('click', function() { deleteTask(task.id); });
    
    return taskCard;
}

/*
============================================================
 TASK MODIFICATIONS
============================================================
*/

function toggleTaskComplete(taskId) {
    var taskIndex = -1;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            taskIndex = i;
            break;
        }
    }
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToStorage();
        displayTasks();
        updateSummary();
        var status = tasks[taskIndex].completed ? 'completed' : 'marked as pending';
        showNotification('Task "' + tasks[taskIndex].title + '" ' + status + '!', 'success');
    }
}

function editTask(taskId) {
    var task = null;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            task = tasks[i];
            break;
        }
    }
    
    if (task) {
        $('#taskTitle').val(task.title);
        $('#taskDescription').val(task.description);
        $('#taskDueDate').val(task.dueDate);
        $('#taskPriority').val(task.priority);
        $('#eventLocation').val(task.location);
        $('#addTaskForm').data('editing-task-id', taskId);
        $('#addTaskForm button[type="submit"]').html('<i class="fas fa-save"></i> Update Task');
        
        $('html, body').animate({ scrollTop: $('#addTaskForm').offset().top - 100 }, 500);
    }
}

function deleteTask(taskId) {
    var taskIndex = -1;
    var taskTitle = '';
    
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            taskIndex = i;
            taskTitle = tasks[i].title;
            break;
        }
    }
    
    if (taskIndex !== -1 && confirm('Are you sure you want to delete "' + taskTitle + '"?')) {
        tasks.splice(taskIndex, 1);
        saveTasksToStorage();
        displayTasks();
        updateSummary();
        showNotification('Task "' + taskTitle + '" deleted successfully!', 'success');
    }
}

/*
============================================================
 SUMMARY STATISTICS
============================================================
*/

function updateSummary() {
    var totalTasks = tasks.length;
    var completedTasks = 0;
    
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completedTasks++;
        }
    }
    
    var pendingTasks = totalTasks - completedTasks;
    
    // Update specific DOM elements if they exist
    var totalCountElement = document.querySelector('#totalCount');
    var completedCountElement = document.querySelector('#completedCount');
    var pendingCountElement = document.querySelector('#pendingCount');
    
    if (totalCountElement) totalCountElement.textContent = totalTasks;
    if (completedCountElement) completedCountElement.textContent = completedTasks;
    if (pendingCountElement) pendingCountElement.textContent = pendingTasks;
    
    // Update summary section
    $('.summary-section').remove();
    var summaryHTML = '<div class="row mb-4 summary-section"><div class="col-12"><div class="card"><div class="card-header"><h5 class="mb-0">Task Summary</h5></div><div class="card-body"><div class="row text-center">' +
        '<div class="col-md-4 mb-3"><div class="border rounded p-3"><h3 class="text-primary">' + totalTasks + '</h3><small class="text-muted">Total Tasks</small></div></div>' +
        '<div class="col-md-4 mb-3"><div class="border rounded p-3"><h3 class="text-success">' + completedTasks + '</h3><small class="text-muted">Completed</small></div></div>' +
        '<div class="col-md-4 mb-3"><div class="border rounded p-3"><h3 class="text-warning">' + pendingTasks + '</h3><small class="text-muted">Pending</small></div></div>' +
        '</div></div></div></div></div>';
    
    $('#taskList').before(summaryHTML);
}

console.log('Task management system loaded successfully!'); 