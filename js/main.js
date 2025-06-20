/**
 * main.js
 *
 * Handles sitewide functionality including:
 * - Dark mode theme switching with localStorage persistence.
 * - User notification system.
 * - Accessibility features (skip links).
 */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing main.js...');
    
    // --- DOM ELEMENT REFERENCES ---
    const darkModeToggleButton = document.getElementById('darkModeToggle');
    const documentBody = document.body;

    console.log('Dark mode toggle button found:', darkModeToggleButton);
    console.log('Document body found:', documentBody);

    // --- INITIALIZATION ---
    if (darkModeToggleButton) {
        console.log('Initializing dark mode functionality...');
        initializeDarkMode();
    } else {
        console.error('Dark mode toggle button not found!');
    }
    addAccessibilitySkipLink();
    
    // --- DARK MODE LOGIC ---
    function initializeDarkMode() {
        console.log('Setting up dark mode...');
        
        // Apply saved theme on page load
        const savedDarkMode = localStorage.getItem('darkMode');
        console.log('Saved dark mode preference:', savedDarkMode);
        
        if (savedDarkMode === 'true') {
            documentBody.classList.add('dark-mode');
            updateDarkModeButtonIcon(true);
            console.log('Dark mode applied from localStorage');
        }

        // Add click event listener
        darkModeToggleButton.addEventListener('click', switchDarkModeTheme);
        console.log('Click event listener added to dark mode toggle');
    }

    function switchDarkModeTheme() {
        console.log('Dark mode toggle clicked!');
        const isDarkModeActive = documentBody.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkModeActive);
        updateDarkModeButtonIcon(isDarkModeActive);
        console.log('Dark mode toggled to:', isDarkModeActive);
    }

    function updateDarkModeButtonIcon(isDarkModeActive) {
        const toggleIcon = darkModeToggleButton.querySelector('i');
        console.log('Updating button icon, dark mode active:', isDarkModeActive);
        console.log('Toggle icon found:', toggleIcon);
        
        if (toggleIcon) {
            if (isDarkModeActive) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
                console.log('Changed to sun icon');
            } else {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
                console.log('Changed to moon icon');
            }
        }
    }

    // --- ACCESSIBILITY ---
    function addAccessibilitySkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        documentBody.prepend(skipLink);
    }

    // --- NOTIFICATION SYSTEM ---
    /**
     * Shows a temporary popup message to the user.
     * @param {string} messageText - The message to display.
     * @param {string} messageType - 'success', 'warning', 'danger', 'info'.
     */
    function showUserNotification(messageText, messageType = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${messageType} notification`;
        notification.textContent = messageText;
        notification.setAttribute('role', 'alert');
        
        documentBody.append(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Expose the notification function to the global scope
    window.showNotification = showUserNotification;
    
    console.log('main.js initialization complete');
});