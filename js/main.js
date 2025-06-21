/**
 * main.js - Main JavaScript file for High Still website
 * Handles dark mode, notifications, latest activity, and accessibility
 */

document.addEventListener('DOMContentLoaded', function() {
    var darkModeButton = document.querySelector('#darkModeToggle');
    var pageBody = document.body;

    if (darkModeButton) {
        setupDarkMode();
    }
    
    addSkipLink();
    showLatestActivity();
    
    window.showNotification = showNotification;
    window.updateLatestActivity = showLatestActivity;
    
    function setupDarkMode() {
        var savedSetting = localStorage.getItem('darkMode');
        
        if (savedSetting === 'true') {
            pageBody.classList.add('dark-mode');
            changeButtonIcon(true);
        }

        darkModeButton.addEventListener('click', toggleDarkMode);
    }
    
    function toggleDarkMode() {
        var isDark = pageBody.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        changeButtonIcon(isDark);
    }
    
    function changeButtonIcon(isDark) {
        var iconElement = darkModeButton.querySelector('i');
        
        if (iconElement) {
            if (isDark) {
                iconElement.classList.remove('fa-moon');
                iconElement.classList.add('fa-sun');
    } else {
                iconElement.classList.remove('fa-sun');
                iconElement.classList.add('fa-moon');
    }
}
    }
    
    function addSkipLink() {
        var skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        pageBody.insertBefore(skipLink, pageBody.firstChild);
    }
    
    function showLatestActivity() {
        var activityContainer = document.querySelector('#latestActivity');
        
        if (!activityContainer) {
            return;
        }

        var storedTasks = localStorage.getItem('highStillTasks');
        var taskList = storedTasks ? JSON.parse(storedTasks) : [];
        var sortedTasks = taskList.sort(function(a, b) { return b.id - a.id; }).slice(0, 3);
        
        if (sortedTasks.length === 0) {
            activityContainer.innerHTML = '<div class="alert alert-info text-center">No recent activity. <a href="tasks.html" class="alert-link">Create your first event!</a></div>';
            return;
        }

        var htmlContent = '<ul class="list-group list-group-flush">';
        
        for (var i = 0; i < sortedTasks.length; i++) {
            var task = sortedTasks[i];
            var dateString = new Date(task.dueDate).toLocaleDateString();
            var statusText = task.completed ? 'Completed' : 'Pending';
            var statusClass = task.completed ? 'text-success' : 'text-warning';
            var statusIcon = task.completed ? 'fa-check-circle' : 'fa-clock';
            
            htmlContent += '<li class="list-group-item d-flex justify-content-between align-items-start">';
            htmlContent += '<div class="ms-2 me-auto"><div class="fw-bold">' + task.title + '</div><small class="text-muted">' + task.location + '</small></div>';
            htmlContent += '<div class="text-end"><span class="badge bg-primary rounded-pill">' + dateString + '</span><br>';
            htmlContent += '<small class="' + statusClass + '"><i class="fas ' + statusIcon + ' me-1"></i>' + statusText + '</small></div></li>';
        }
        
        htmlContent += '</ul>';
        activityContainer.innerHTML = htmlContent;
    }
    
    function showNotification(message, type) {
        if (!type) type = 'success';
        
        var notification = document.createElement('div');
        notification.className = 'alert alert-' + type + ' notification';
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        
        pageBody.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
});