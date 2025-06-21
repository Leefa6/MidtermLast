/*
============================================================
 SONG REQUESTS JAVASCRIPT - ITC4214 COURSEWORK
 Handles song request functionality with form validation and storage
============================================================
*/

// This array will store all the song requests that users submit
// We keep it in memory so we can display and manage the requests
var songRequests = [];

// This runs when the page finishes loading
// It sets up everything we need for the song request system to work
document.addEventListener('DOMContentLoaded', function() {
    // Connect the form to our JavaScript so we can handle submissions
    setupFormListener();
    
    // Load any song requests that were saved before (so they don't disappear when page refreshes)
    loadSongRequests();
    
    // Show the song requests on the page so users can see them
    displaySongRequests();
});

// This function connects our JavaScript to the form on the page
// When someone clicks "Request Song", this function will run
function setupFormListener() {
    // Find the form on the page using its ID
    var form = document.querySelector('#addSongForm');
    
    // If we found the form, tell it to call our function when submitted
    if (form) {
        form.addEventListener('submit', function(event) {
            // Stop the form from reloading the page (which would lose our data)
            event.preventDefault();
            
            // Call our function to handle the new song request
            addNewSongRequest();
        });
    }
}

// This function handles when someone submits a new song request
// It gets the data from the form, checks if it's valid, and saves it
function addNewSongRequest() {
    // Get the song title and artist from the form fields
    // trim() removes any extra spaces at the beginning or end
    var songTitle = document.querySelector('#songTitle').value.trim();
    var songArtist = document.querySelector('#songArtist').value.trim();
    
    // Check if both fields are filled in - we need both to create a valid request
    if (!songTitle || !songArtist) {
        // Show an error message to the user if they forgot to fill something
        showNotification('Please fill in both song title and artist name.', 'danger');
        return; // Stop here - don't create the request
    }
    
    // Create a new song request object with all the information we need
    var newSong = {
        id: Date.now(), // Give it a unique ID using the current time
        title: songTitle, // The song title from the form
        artist: songArtist, // The artist name from the form
        dateAdded: new Date().toLocaleDateString() // Today's date for when it was requested
    };
    
    // Add this new song request to our list
    songRequests.push(newSong);
    
    // Save all song requests to the browser's storage so they don't get lost
    saveSongRequests();
    
    // Update what's shown on the page to include the new request
    displaySongRequests();
    
    // Clear the form so it's ready for the next request
    document.querySelector('#addSongForm').reset();
    
    // Show a success message to let the user know it worked
    showNotification('Song request "' + songTitle + '" by ' + songArtist + ' added successfully!', 'success');
}

// This function saves all song requests to the browser's storage
// This way the requests don't disappear when the user refreshes the page
function saveSongRequests() {
    // Convert our array of song requests to a text format and save it
    localStorage.setItem('highStillSongRequests', JSON.stringify(songRequests));
}

// This function loads song requests from the browser's storage
// It runs when the page loads to restore any requests that were saved before
function loadSongRequests() {
    // Try to get saved song requests from browser storage
    var saved = localStorage.getItem('highStillSongRequests');
    
    // If we found saved requests, convert them back to an array
    // If not, start with an empty array
    songRequests = saved ? JSON.parse(saved) : [];
}

// This function displays all song requests on the page
// It creates cards for each request so users can see them
function displaySongRequests() {
    // Find the container on the page where we'll show the song requests
    var songListContainer = document.querySelector('#songList');
    
    // If we can't find the container, stop here (maybe we're on the wrong page)
    if (!songListContainer) return;
    
    // Clear whatever was showing before so we can show the updated list
    songListContainer.innerHTML = '';
    
    // If there are no song requests, show a friendly message
    if (songRequests.length === 0) {
        songListContainer.innerHTML = '<div class="col-12"><div class="alert alert-info text-center"><i class="fas fa-music me-2"></i>No song requests yet. Be the first to request a song!</div></div>';
        return; // Stop here - nothing more to show
    }
    
    // Go through each song request and create a card for it
    for (var i = 0; i < songRequests.length; i++) {
        // Create a card for this song request
        var songCard = createSongCard(songRequests[i]);
        
        // Add the card to the page so users can see it
        songListContainer.appendChild(songCard);
    }
}

// This function creates a single card for one song request
// Each card shows the song title, artist, date requested, and a remove button
function createSongCard(song) {
    // Create a new div element that will become our card
    var card = document.createElement('div');
    
    // Give it Bootstrap classes to make it look nice and responsive
    card.className = 'col-md-6 col-lg-4 mb-3';
    
    // Fill the card with HTML that shows the song information
    card.innerHTML = '<div class="card h-100">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + song.title + '</h5>' + // Show the song title
        '<p class="card-text"><strong>Artist:</strong> ' + song.artist + '</p>' + // Show the artist
        '<p class="card-text"><small class="text-muted"><i class="fas fa-calendar me-1"></i>Requested: ' + song.dateAdded + '</small></p>' + // Show when it was requested
        '<button class="btn btn-danger btn-sm remove-song" data-song-id="' + song.id + '"><i class="fas fa-trash me-1"></i>Remove</button>' + // Remove button
        '<button class="btn btn-primary btn-sm now-playing-btn ms-2" data-song-title="' + song.title + '" data-song-artist="' + song.artist + '"><i class="fas fa-play me-1"></i>Now Playing</button>' + // Now Playing button
        '</div></div>';
    
    // Find the remove button we just created
    var removeButton = card.querySelector('.remove-song');
    
    // Tell the remove button what to do when someone clicks it
    removeButton.addEventListener('click', function() {
        // Call our function to remove this specific song request
        removeSongRequest(song.id);
    });
    
    // Find the now playing button we just created
    var nowPlayingButton = card.querySelector('.now-playing-btn');
    
    // Tell the now playing button what to do when someone clicks it
    nowPlayingButton.addEventListener('click', function() {
        // Call our function to set this song as now playing
        setNowPlaying(song.title, song.artist);
    });
    
    // Return the completed card so it can be added to the page
    return card;
}

// This function removes a song request when someone clicks the remove button
// It asks for confirmation first to make sure they really want to delete it
function removeSongRequest(songId) {
    // Find which song request in our array has this ID
    var songIndex = -1; // Start with -1 to mean "not found"
    
    // Look through all song requests to find the one with matching ID
    for (var i = 0; i < songRequests.length; i++) {
        if (songRequests[i].id === songId) {
            songIndex = i; // Found it! Remember which position it's at
            break; // Stop looking - we found what we need
        }
    }
    
    // If we found the song request (songIndex is not -1)
    if (songIndex !== -1) {
        // Get the song details so we can show them in the confirmation message
        var songToRemove = songRequests[songIndex];
        
        // Ask the user if they're sure they want to remove this song request
        if (confirm('Are you sure you want to remove "' + songToRemove.title + '" by ' + songToRemove.artist + '?')) {
            // Remove this song request from our array
            songRequests.splice(songIndex, 1);
            
            // Save the updated list to browser storage
            saveSongRequests();
            
            // Update what's shown on the page to reflect the change
            displaySongRequests();
        }
        // If they click "Cancel", nothing happens - the song request stays
    }
}

// This function sets a song as "now playing" and updates the display
// It takes the song title and artist and shows them in the now playing section
function setNowPlaying(songTitle, songArtist) {
    // Find the now playing card on the page
    var nowPlayingCard = document.querySelector('#nowPlayingCard');
    
    // If we found the now playing section, update it with the new song
    if (nowPlayingCard) {
        // Create the new content for the now playing section
        // Format it as "🎵 Now Playing: {title} by {artist}"
        var nowPlayingContent = '<div class="card-body text-center">' +
            '<h3 class="card-title">🎵 Now Playing: ' + songTitle + ' by ' + songArtist + '</h3>' +
            '<p class="card-text">This song is currently playing at the venue</p>' +
            '</div>';
        
        // Update the now playing card with the new content
        nowPlayingCard.innerHTML = nowPlayingContent;
        
        // Show a notification to let the user know the song is now playing
        showNotification('Now playing: "' + songTitle + '" by ' + songArtist, 'success');
    }
} 