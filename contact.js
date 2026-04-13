document.getElementById('contactBtn').addEventListener('click', function () {
    // If a popup already exists, don't create another
    if (document.getElementById('contactPopup')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'contactPopupOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.25)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Create popup
    const popup = document.createElement('div');
    popup.id = 'contactPopup';
    popup.style.background = '#fff';
    popup.style.padding = '28px 32px 20px 32px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 32px rgba(34,34,34,0.14)';
    popup.style.minWidth = '270px';
    popup.style.maxWidth = '700px';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.gap = '12px';

    // Title
    const title = document.createElement('h2');
    title.textContent = "Report Issue";
    title.style.marginTop = '0';
    title.style.marginBottom = '8px';
    title.style.fontSize = '1.25rem';
    popup.appendChild(title);

    /* Description / Purpose
    const desc = document.createElement('h4');
    desc.textContent = "This contact form is strictly for informing the developer about mistakes for Pokemon information. Example: if Bulbasaur's color says 'red' but Bulbasaur is Green, enter 'Bulbasaur' in the first field, and some clarifying message such as 'Color should be green' in the second field."
    title.style.marginTop = '0';
    title.style.marginBottom = '8px';
    title.style.fontSize = '1.25rem';
    popup.appendChild(desc); */

    // Input 1
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Pokemon';
    input1.style.padding = '7px';
    input1.style.marginBottom = '7px';
    input1.style.borderRadius = '6px';
    input1.style.border = '1px solid #ccc';
    input1.style.fontSize = '1rem';
    input1.style.fontFamily = 'Gen1';
    popup.appendChild(input1);

    // Input 2
    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.placeholder = 'Problem';
    input2.style.padding = '7px';
    input2.style.marginBottom = '7px';
    input2.style.borderRadius = '6px';
    input2.style.border = '1px solid #ccc';
    input2.style.fontSize = '1rem';
    input2.style.fontFamily = 'Gen1';
    popup.appendChild(input2);

    // Buttons container
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '10px';
    btnRow.style.marginTop = '7px';

    // Cancel Button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.background = 'linear-gradient(90deg, #2288dd 0%, #55aaff 100%)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '7px';
    cancelBtn.style.padding = '7px 16px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.fontFamily = 'Gen1';
    cancelBtn.addEventListener('click', function () {
        document.body.removeChild(overlay);
    });
    btnRow.appendChild(cancelBtn);

    // Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit";
    submitBtn.style.background = 'linear-gradient(90deg, #f4ff55 0%, #dd3822 100%)';
    submitBtn.style.color = '#fff';
    submitBtn.style.border = 'none';
    submitBtn.style.borderRadius = '7px';
    submitBtn.style.padding = '7px 16px';
    submitBtn.style.cursor = 'pointer';
    submitBtn.style.fontFamily = 'Gen1';

    submitBtn.addEventListener('click', function () {
        // Basic validation
        if (!input1.value.trim() || !input2.value.trim()) {
            submitBtn.textContent = "Fill both fields!";
            setTimeout(() => { submitBtn.textContent = "Submit"; }, 1500);
            return;
        }
        else{
            sendContactToSheet(input1.value.trim(), input2.value.trim());
        }        
        submitBtn.textContent = "Submitted!";
        setTimeout(() => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
        }, 900);
    });
    btnRow.appendChild(submitBtn);

    popup.appendChild(btnRow);

    // Close pop-up on overlay click (but not pop-up click)
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Autofocus first input
    input1.focus();
});



/**
 * Send contact form data to Google Sheets via an Apps Script Web App endpoint.
 *
 * NOTE: For security, you can't POST directly to a Google Sheet solely from client-side JavaScript
 * due to CORS and authentication restrictions.
 * You MUST create a Google Apps Script Web App deployed as "Anyone, even anonymous" and use its URL below.
 * 
 * Instructions for setup:
 * 1. Go to your Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this sample script:
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.openById('1hNbpu5dcRcdzy-M1NdpwGgxtFe66CgxP2AklVYckKXk').getSheets()[0];
 *      var name = e.parameter.name || '';
 *      var message = e.parameter.message || '';
 *      sheet.appendRow([new Date(), name, message]);
 *      return ContentService.createTextOutput("OK");
 *    }
 * 4. Save and Deploy > New deployment > "Web app"
 *    - Who has access: Anyone
 *    - Copy the Web App URL.
 * 5. Replace the "YOUR_WEB_APP_URL" below with your actual web app URL.
 */

function sendContactToSheet(name, message) {
    const endpoint = "https://script.google.com/macros/s/AKfycbz-J6v8KLnTyVOJnLhppKhaUquXj425mGEd6wP_6KUsJTKGa6rqX0NeatLHMZOZnFFv/exec" // <-- Replace with your Apps Script Web App URL
    const body = new URLSearchParams({ name, message });

    fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body
    })
    .then(() => {
        // "no-cors" responses are opaque, so success here just means the request was sent.
    })
    .catch(err => {
        // Optionally handle errors
        //alert("Error sending message: " + err);
    });
}