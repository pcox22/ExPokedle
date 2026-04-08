
// Info card functionality
document.addEventListener('DOMContentLoaded', () => {
    // Helper to close the popup
    function closeInfoCardPopup() {
        const existingPopup = document.querySelector('.infoCardPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
        document.removeEventListener('mousedown', handleGlobalClick);
    }

    function handleGlobalClick(e) {
        // If click is outside the popup and not the button, close it
        const popup = document.querySelector('.infoCardPopup');
        if (!popup) return;
        if (!popup.contains(e.target) && !e.target.classList.contains('PkmnInfo')) {
            closeInfoCardPopup();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('PkmnInfo')) {
            event.stopPropagation();
            closeInfoCardPopup(); // Close any open popups first

            // Get button position
            const button = event.target;
            const rect = button.getBoundingClientRect();

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'infoCardPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '2000';
            popup.style.minWidth = '180px';
            popup.style.maxWidth = '350px';
            popup.style.background = '#fffbe9';
            popup.style.color = '#222';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.23)';
            popup.style.borderRadius = '10px';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '12px 16px';
            
            popup.style.fontSize = '13px';
            popup.style.left = (window.scrollX + rect.left + rect.width + 8) + 'px';
            popup.style.top = (window.scrollY + rect.top - 18) + 'px';

            popup.innerHTML = `
                Pokemon that have been guessed.
            `;

            document.body.appendChild(popup);

            // Make sure it doesn't overflow viewport
            const popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = Math.max(8, window.innerWidth - popupRect.width - 8) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                popup.style.top = Math.max(8, window.innerHeight - popupRect.height - 8) + 'px';
            }

            setTimeout(() => {
                // attach as async to not trigger on this click
                document.addEventListener('mousedown', handleGlobalClick);
            }, 0);
        }
    });
});


// Type 1 Info Card
document.addEventListener('DOMContentLoaded', () => {
    // Helper to close the popup
    function closeInfoCardPopup() {
        const existingPopup = document.querySelector('.infoCardPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
        document.removeEventListener('mousedown', handleGlobalClick);
    }

    function handleGlobalClick(e) {
        // If click is outside the popup and not the button, close it
        const popup = document.querySelector('.infoCardPopup');
        if (!popup) return;
        if (!popup.contains(e.target) && !e.target.classList.contains('type1Info')) {
            closeInfoCardPopup();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('type1Info')) {
            event.stopPropagation();
            closeInfoCardPopup(); // Close any open popups first

            // Get button position
            const button = event.target;
            const rect = button.getBoundingClientRect();

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'infoCardPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '2000';
            popup.style.minWidth = '180px';
            popup.style.maxWidth = '350px';
            popup.style.background = '#fffbe9';
            popup.style.color = '#222';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.23)';
            popup.style.borderRadius = '10px';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '12px 16px';
            
            popup.style.fontSize = '13px';
            popup.style.left = (window.scrollX + rect.left + rect.width + 8) + 'px';
            popup.style.top = (window.scrollY + rect.top - 18) + 'px';

            popup.innerHTML = `
                First type of the Pokemon.
                <br> <strong>Ex:</strong> Charizard is Fire/Flying type -> Type 1 is Fire.

                <br><br>If Type 1 is equal to the correct Pokemon's Type 2, it will appear 'Partial' (Yellow).
            `;

            document.body.appendChild(popup);

            // Make sure it doesn't overflow viewport
            const popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = Math.max(8, window.innerWidth - popupRect.width - 8) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                popup.style.top = Math.max(8, window.innerHeight - popupRect.height - 8) + 'px';
            }

            setTimeout(() => {
                // attach as async to not trigger on this click
                document.addEventListener('mousedown', handleGlobalClick);
            }, 0);
        }
    });
});

// Type 2 Info Card
document.addEventListener('DOMContentLoaded', () => {
    // Helper to close the popup
    function closeInfoCardPopup() {
        const existingPopup = document.querySelector('.infoCardPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
        document.removeEventListener('mousedown', handleGlobalClick);
    }

    function handleGlobalClick(e) {
        // If click is outside the popup and not the button, close it
        const popup = document.querySelector('.infoCardPopup');
        if (!popup) return;
        if (!popup.contains(e.target) && !e.target.classList.contains('type2Info')) {
            closeInfoCardPopup();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('type2Info')) {
            event.stopPropagation();
            closeInfoCardPopup(); // Close any open popups first

            // Get button position
            const button = event.target;
            const rect = button.getBoundingClientRect();

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'infoCardPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '2000';
            popup.style.minWidth = '180px';
            popup.style.maxWidth = '350px';
            popup.style.background = '#fffbe9';
            popup.style.color = '#222';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.23)';
            popup.style.borderRadius = '10px';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '12px 16px';
            
            popup.style.fontSize = '13px';
            popup.style.left = (window.scrollX + rect.left + rect.width + 8) + 'px';
            popup.style.top = (window.scrollY + rect.top - 18) + 'px';

            popup.innerHTML = `
                Second type of the Pokemon.
                <br> <strong>Ex:</strong> Venusaur is Grass/Poison type -> Type 2 is Poison.

                <br><br>If Type 2 is equal to the correct Pokemon's Type 1, it will appear 'Partial' (Yellow).

                <br><br>If the guessed Pokemon does not have a second type, "None" will appear.
            `;

            document.body.appendChild(popup);

            // Make sure it doesn't overflow viewport
            const popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = Math.max(8, window.innerWidth - popupRect.width - 8) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                popup.style.top = Math.max(8, window.innerHeight - popupRect.height - 8) + 'px';
            }

            setTimeout(() => {
                // attach as async to not trigger on this click
                document.addEventListener('mousedown', handleGlobalClick);
            }, 0);
        }
    });
});


// Stage Info Card
document.addEventListener('DOMContentLoaded', () => {
    // Helper to close the popup
    function closeInfoCardPopup() {
        const existingPopup = document.querySelector('.infoCardPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
        document.removeEventListener('mousedown', handleGlobalClick);
    }

    function handleGlobalClick(e) {
        // If click is outside the popup and not the button, close it
        const popup = document.querySelector('.infoCardPopup');
        if (!popup) return;
        if (!popup.contains(e.target) && !e.target.classList.contains('stageInfo')) {
            closeInfoCardPopup();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('stageInfo')) {
            event.stopPropagation();
            closeInfoCardPopup(); // Close any open popups first

            // Get button position
            const button = event.target;
            const rect = button.getBoundingClientRect();

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'infoCardPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '2000';
            popup.style.minWidth = '180px';
            popup.style.maxWidth = '350px';
            popup.style.background = '#fffbe9';
            popup.style.color = '#222';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.23)';
            popup.style.borderRadius = '10px';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '12px 16px';
            
            popup.style.fontSize = '13px';
            popup.style.left = (window.scrollX + rect.left + rect.width + 8) + 'px';
            popup.style.top = (window.scrollY + rect.top - 18) + 'px';

            popup.innerHTML = `
                The stage of evolution that the Pokemon is in.

                <br><br><strong>Ex: </strong> 
                <br>Squirtle -> Stage 1
                <br>Wartortle -> Stage 2
                <br>Blastoise -> Stage 3
            `;

            document.body.appendChild(popup);

            // Make sure it doesn't overflow viewport
            const popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = Math.max(8, window.innerWidth - popupRect.width - 8) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                popup.style.top = Math.max(8, window.innerHeight - popupRect.height - 8) + 'px';
            }

            setTimeout(() => {
                // attach as async to not trigger on this click
                document.addEventListener('mousedown', handleGlobalClick);
            }, 0);
        }
    });
});


// Color Info Card
document.addEventListener('DOMContentLoaded', () => {
    // Helper to close the popup
    function closeInfoCardPopup() {
        const existingPopup = document.querySelector('.infoCardPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
        document.removeEventListener('mousedown', handleGlobalClick);
    }

    function handleGlobalClick(e) {
        // If click is outside the popup and not the button, close it
        const popup = document.querySelector('.infoCardPopup');
        if (!popup) return;
        if (!popup.contains(e.target) && !e.target.classList.contains('colorInfo')) {
            closeInfoCardPopup();
        }
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('colorInfo')) {
            event.stopPropagation();
            closeInfoCardPopup(); // Close any open popups first

            // Get button position
            const button = event.target;
            const rect = button.getBoundingClientRect();

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'infoCardPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '2000';
            popup.style.minWidth = '180px';
            popup.style.maxWidth = '350px';
            popup.style.background = '#fffbe9';
            popup.style.color = '#222';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.23)';
            popup.style.borderRadius = '10px';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '12px 16px';
            
            popup.style.fontSize = '13px';
            popup.style.left = (window.scrollX + rect.left + rect.width + 8) + 'px';
            popup.style.top = (window.scrollY + rect.top - 18) + 'px';

            popup.innerHTML = `
                Primary Colors of the Pokemon, up to 2 colors each.

                <br><br>If the one of the colors of the guessed Pokemon match one of the colors of the target Pokemon, 
                it will appear Partial (Yellow).

                <br><br><strong>Ex:</strong>
                <br>Guessed Kabutops -> Brown
                <br> Target Alakazam -> Yellow, Brown

                <br><br>Brown is partially correct, appears Partial (Yellow).
            `;

            document.body.appendChild(popup);

            // Make sure it doesn't overflow viewport
            const popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = Math.max(8, window.innerWidth - popupRect.width - 8) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                popup.style.top = Math.max(8, window.innerHeight - popupRect.height - 8) + 'px';
            }

            setTimeout(() => {
                // attach as async to not trigger on this click
                document.addEventListener('mousedown', handleGlobalClick);
            }, 0);
        }
    });
});