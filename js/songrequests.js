/*
============================================================
 🎵 HIGH STILL - SONG REQUESTS JAVASCRIPT MODULE
============================================================
 Handles all song request functionality including:
 - Form validation and submission
 - Local storage management
 - Dynamic card creation and display
 - Song removal with confirmation
 - Now playing status updates
============================================================
*/

/* ===== GLOBAL VARIABLES ===== */
// This array stores all song requests in memory for easy access and manipulation
// Each request contains: id, title, artist, and dateAdded properties
var songRequests = [];

/* ===== PAGE INITIALIZATION ===== */
// This event listener runs when the DOM is fully loaded and ready
// It sets up all the necessary functionality for the song request system
document.addEventListener('DOMContentLoaded', function() {
    // Connect the form submission to our JavaScript handler
    setupFormListener();
    
    // Restore any previously saved song requests from browser storage
    loadSongRequests();
    
    // Display all song requests on the page for users to see
    displaySongRequests();
});

/* ===== FORM EVENT HANDLING ===== */
// This function connects our JavaScript to the song request form
// It prevents the default form submission and handles it with our custom logic
function setupFormListener() {
    // Find the song request form on the page using its unique ID
    var form = document.querySelector('#addSongForm');
    
    // Only proceed if we successfully found the form element
    if (form) {
        // Add an event listener that triggers when the form is submitted
        form.addEventListener('submit', function(event) {
            // Prevent the browser's default form submission behavior
            // This stops the page from reloading and losing our data
            event.preventDefault();
            
            // Call our custom function to handle the song request submission
            addNewSongRequest();
        });
    }
}

/* ===== SONG REQUEST PROCESSING ===== */
// This function handles the complete process of adding a new song request
// It validates input, creates the request object, saves it, and updates the display
function addNewSongRequest() {
    // Extract and clean the form data by removing leading/trailing whitespace
    // This prevents issues with accidental spaces in song titles or artist names
    var songTitle = document.querySelector('#songTitle').value.trim();
    var songArtist = document.querySelector('#songArtist').value.trim();
    
    // Validate that both required fields are filled in
    // We need both song title and artist name to create a valid request
    if (!songTitle || !songArtist) {
        // Show an error notification to inform the user what's missing
        showNotification('Please fill in both song title and artist name.', 'danger');
        return; // Exit early - don't create an incomplete request
    }
    
    // Create a new song request object with all necessary information
    // Using Date.now() ensures each request has a unique identifier
    var newSong = {
        id: Date.now(), // Unique timestamp-based ID for this request
        title: songTitle, // The song title from the form input
        artist: songArtist, // The artist name from the form input
        dateAdded: new Date().toLocaleDateString() // Current date formatted for display
    };
    
    // Add the new song request to our in-memory array
    // This makes it immediately available for display and manipulation
    songRequests.push(newSong);
    
    // Persist the updated song requests to browser's local storage
    // This ensures requests survive page refreshes and browser restarts
    saveSongRequests();
    
    // Refresh the display to show the newly added song request
    // This updates the page without requiring a full reload
    displaySongRequests();
    
    // Reset the form to its initial state for the next request
    // This provides a clean slate for users to enter another song
    document.querySelector('#addSongForm').reset();
    
    // Show a success notification confirming the song was added
    // This gives users immediate feedback that their action was successful
    showNotification('Song request "' + songTitle + '" by ' + songArtist + ' added successfully!', 'success');
}

/* ===== LOCAL STORAGE MANAGEMENT ===== */
// This function saves all song requests to the browser's local storage
// Local storage persists data even when the browser is closed and reopened
function saveSongRequests() {
    // Convert the songRequests array to a JSON string for storage
    // JSON.stringify() serializes our JavaScript objects into a text format
    localStorage.setItem('highStillSongRequests', JSON.stringify(songRequests));
}

// This function loads song requests from browser's local storage
// It restores any previously saved requests when the page loads
function loadSongRequests() {
    // Attempt to retrieve saved song requests from local storage
    // The key 'highStillSongRequests' identifies our specific data
    var saved = localStorage.getItem('highStillSongRequests');
    
    // If saved data exists, parse it back into a JavaScript array
    // If no saved data exists, start with an empty array
    // JSON.parse() converts the stored text back into JavaScript objects
    songRequests = saved ? JSON.parse(saved) : [];
}

/* ===== DISPLAY MANAGEMENT ===== */
// This function manages the display of all song requests on the page
// It creates a visual representation of each request using Bootstrap cards
function displaySongRequests() {
    // Find the container element where song request cards will be displayed
    // This container should have the ID 'songList' in the HTML
    var songListContainer = document.querySelector('#songList');
    
    // Safety check: if the container doesn't exist, exit early
    // This prevents errors if the function is called on the wrong page
    if (!songListContainer) return;
    
    // Clear the existing content to prepare for the updated display
    // This ensures we don't have duplicate or outdated cards
    songListContainer.innerHTML = '';
    
    // Handle the case when there are no song requests to display
    // Show a friendly message encouraging users to make the first request
    if (songRequests.length === 0) {
        songListContainer.innerHTML = '<div class="col-12"><div class="alert alert-info text-center"><i class="fas fa-music me-2"></i>No song requests yet. Be the first to request a song!</div></div>';
        return; // Exit early - nothing more to display
    }
    
    // Iterate through each song request and create a visual card for it
    // This loop processes all requests and adds them to the page
    for (var i = 0; i < songRequests.length; i++) {
        // Create a card element for this specific song request
        var songCard = createSongCard(songRequests[i]);
        
        // Add the completed card to the page so users can see it
        songListContainer.appendChild(songCard);
    }
}

/* ===== CARD CREATION ===== */
// This function creates a single card element for displaying a song request
// Each card shows the song information and provides action buttons
function createSongCard(song) {
    // Create a new div element that will become our song request card
    var card = document.createElement('div');
    
    // Apply Bootstrap classes for responsive layout and styling
    // col-md-6: 2 cards per row on medium screens, col-lg-4: 3 cards per row on large screens
    card.className = 'col-md-6 col-lg-4 mb-3';
    
    // Build the HTML content for the card using the song data
    // This creates a structured layout with title, artist, date, and action buttons
    card.innerHTML = '<div class="card h-100">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + song.title + '</h5>' + // Display the song title prominently
        '<p class="card-text"><strong>Artist:</strong> ' + song.artist + '</p>' + // Show the artist name
        '<p class="card-text"><small class="text-muted"><i class="fas fa-calendar me-1"></i>Requested: ' + song.dateAdded + '</small></p>' + // Show when it was requested
        '<button class="btn btn-danger btn-sm remove-song" data-song-id="' + song.id + '"><i class="fas fa-trash me-1"></i>Remove</button>' + // Remove button with song ID
        '<button class="btn btn-primary btn-sm now-playing-btn ms-2" data-song-title="' + song.title + '" data-song-artist="' + song.artist + '"><i class="fas fa-play me-1"></i>Now Playing</button>' + // Now Playing button
        '</div></div>';
    
    // Find the remove button within this specific card
    var removeButton = card.querySelector('.remove-song');
    
    // Add click event listener to the remove button
    // This allows users to delete individual song requests
    removeButton.addEventListener('click', function() {
        // Call the removal function with this song's unique ID
        removeSongRequest(song.id);
    });
    
    // Find the now playing button within this specific card
    var nowPlayingButton = card.querySelector('.now-playing-btn');
    
    // Add click event listener to the now playing button
    // This allows users to mark songs as currently playing
    nowPlayingButton.addEventListener('click', function() {
        // Call the function to set this song as now playing
        setNowPlaying(song.title, song.artist);
    });
    
    // Return the completed card element for addition to the page
    return card;
}

/* ===== SONG REMOVAL FUNCTIONALITY ===== */
// This function handles the removal of song requests with user confirmation
// It ensures users don't accidentally delete requests they want to keep
function removeSongRequest(songId) {
    // Initialize index variable to track the position of the song in our array
    var songIndex = -1; // -1 indicates "not found" - a safe default value
    
    // Search through all song requests to find the one with matching ID
    // This loop compares each request's ID with the target ID
    for (var i = 0; i < songRequests.length; i++) {
        if (songRequests[i].id === songId) {
            songIndex = i; // Found the matching song - remember its position
            break; // Exit the loop early since we found what we're looking for
        }
    }
    
    // Only proceed if we successfully found the song request
    if (songIndex !== -1) {
        // Get the song details for use in the confirmation message
        var songToRemove = songRequests[songIndex];
        
        // Show a confirmation dialog to prevent accidental deletions
        // The message includes the song title and artist for clarity
        if (confirm('Are you sure you want to remove "' + songToRemove.title + '" by ' + songToRemove.artist + '?')) {
            // Remove the song request from our array using splice
            // splice() removes elements and returns the removed elements
            songRequests.splice(songIndex, 1);
            
            // Save the updated song requests list to local storage
            // This ensures the deletion persists across page refreshes
            saveSongRequests();
            
            // Update the display to reflect the removal
            // This removes the card from the page immediately
            displaySongRequests();
        }
        // If user clicks "Cancel", do nothing - the song request remains
    }
}

/* ===== NOW PLAYING STATUS ===== */
// This function updates the "Now Playing" display when a song is selected
// It provides visual feedback about which song is currently playing at the venue
function setNowPlaying(songTitle, songArtist) {
    // Find the now playing card element on the page
    var nowPlayingCard = document.querySelector('#nowPlayingCard');
    
    // Only proceed if the now playing section exists on the page
    if (nowPlayingCard) {
        // Create the HTML content for the now playing display
        // This shows the song title and artist in a prominent format
        var nowPlayingContent = '<div class="card-body text-center">' +
            '<h3 class="card-title">🎵 Now Playing: ' + songTitle + ' by ' + songArtist + '</h3>' +
            '<p class="card-text">This song is currently playing at the venue</p>' +
            '</div>';
        
        // Update the now playing card with the new song information
        // This immediately shows the change to users
        nowPlayingCard.innerHTML = nowPlayingContent;
        
        // Show a notification to confirm the now playing status was updated
        // This provides immediate feedback about the action taken
        showNotification('Now playing: "' + songTitle + '" by ' + songArtist, 'success');
    }
} 