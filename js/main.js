main.js

// 	 Darkmode theme switching
 // user notificaation system
//	accessibility features (skip links)
// specific functions

// these are html elements we need to interact with 
const $darkModeToggleButton = $('#darkModeToggle'); // jquery refernv=ce to dark mode toggle button
const $documentBody = $(document.body); // jquery reference for the body element, this will swicth to the darkmode theme when toggled 


// Dark Mode
 //	Handles switching between light and dark themes using the local storage persistence 


// loads the users saved dark mode preference when the page loads , checks local storage for dark mode setting and applies it if 


function loadDarkModePreference() {  
	// this function runs as soon as the website loads and its in charge of checking if the user already had dark mode enabled
	const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true'; // checks if darkmode is enabled last time from the local storage, if true then the command below runs
	
	if (isDarkModeEnabled) { // this function adds the css class to the body (triggers the dark-mode css file)
		$documentBody.addClass('dark-mode');
		updateDarkModeButtonIcon(true); // this updates the icon to the sun icon (for visual accessibility)
	}
}


/* Switches between light and dark themes when user clicks the toggle button
 * Saves the user's preference to localStorage so it persists between visits
 */
function switchDarkModeTheme() {
    // Switches between light and dark themes when user clicks the toggle button
    const isDarkModeActive = $documentBody.toggleClass('dark-mode').hasClass('dark-mode'); // Toggles dark mode class, and checks if dark mode is now active after toggling
    
    // Save user's choice to browser storage
    localStorage.setItem('darkMode', isDarkModeActive); // Save user's choice to localStorage, in our case true if its on and false if its off. 
    
    // Update the button icon to show current theme
    updateDarkModeButtonIcon(isDarkModeActive); // Update the button icon
    
}

/**
 * Changes the toggle button icon based on current theme
 * Shows sun icon when dark mode is on, moon icon when light mode is on
 * @param {boolean} isDarkModeActive - Whether dark mode is currently enabled
 */
function updateDarkModeButtonIcon(isDarkModeActive) { // this will update the font awesome icon button
    // Changes the toggle button icon based on current theme
    const $toggleIcon = $darkModeToggleButton.find('i'); // Finds the icon inside the button, if dark mode is activared it will remove the moon icon and toggle the sun icon, if its bright then moon button.
    
    if (isDarkModeActive) {
        // Show sun icon (to indicate you can switch to light mode)
        $toggleIcon.removeClass('fa-moon').addClass('fa-sun'); // Show sun icon for dark mode
    } else {
        // Show moon icon (to indicate you can switch to dark mode)
        $toggleIcon.removeClass('fa-sun').addClass('fa-moon'); // Show moon icon for light mode
    }
}

//=================================
// NOTIFICATION SYSTEM
//====================================

/**
 * Shows a temporary popup message to the user
 * Automatically disappears after 3 seconds
 * @param {string} messageText - The message to display
 * @param {string} messageType - Type of message: 'success', 'warning', 'danger', 'info'
 */ // declares a new function named showusernotification, it takes two perameters message text, and message type 
function showUserNotification(messageText, messageType = 'Success') {
    // shows the user a temporary pop up on their screen
    const $notificationElement = $('<div></div>') // Create a new div for the notification // this function uses jquery to create an empty div, this is the box that will appear
        .addClass(`alert alert-${messageType} notification`) // Add Bootstrap alert classes
        .text(messageText) // Set the message text
        .attr('role', 'alert'); // Set ARIA role for accessibility, this is very cool because if assistive tech is connected, itll read the message first outloud notifying the user
    $documentBody.append($notificationElement); // Add notification to the page
    setTimeout(() => {
        $notificationElement.remove(); // Remove notification after 3 seconds
    }, 3000);
}

// ========================
 
 //accessibility and features
 
 // ========================. ====
 
 function addAccessibilitySkipLink() {
    // skip to main content for keyboard users // this function. is called as the page is loading
    const $skipLinkElement = $('<a></a>') // Create a new anchor element using jquery
        .attr('href', '#main-content') // Sets the destination to the element 
        .addClass('skip-link') // Add skip-link class
        .text('Skip to main content'); // Set link text, shows the users what the link does
    $documentBody.prepend($skipLinkElement); // Add skip link to the top of the page so its thefirst thing you see 	
}

//===========================
// initialization
 //===========================
 
 function initializePageFeatures() { // this function runs once the page finishes loading, it initializes features such as dark mode, accessibility links, and prepares interactive
 	loadDarkModePreference(); // 
 	
 	if ($darkModeToggleButton.length) { // checks if dark mode is on - that page // if length > 0 then it adds a click handler //already defined as const $darkmodetoggle = $(#darkmodetoggle)

 		$darkModeToggleButton.on('click', switchDarkModeTheme); // when the user clicks toggle, itll call the darkmode theme
 		}
 		
 		addAccessibilitySkipLink(); // Add accessibility features
 }
 
 $(document).ready(initializePageFeatures); //runs when the dom's  ready
 
 window.showNotification = showUserNotification; //this function is cool because it lets other scripts call it to show on their screens