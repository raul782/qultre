/**
 * Google Apps Script Webhook with Authorization
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet.
 * 2. Click on "Extensions" -> "Apps Script".
 * 3. Delete any code in the editor and paste this code.
 * 4. Define your secret authorization token on line 21 (replace "CHANGE_ME_SECRET_TOKEN").
 * 5. Rename the project to "Qultre Waitlist Webhook".
 * 6. Click "Deploy" -> "New deployment".
 * 7. Select Type: "Web app".
 * 8. Set "Execute as": "Me" (so the script runs using your permissions to write to the spreadsheet).
 * 9. Set "Who has access": "Anyone" (required so your website API server can hit it without a Google login session).
 * 10. Click "Deploy", authorize the permissions, and copy the Web App URL.
 * 11. Add the Web App URL and the same secret token to your qultre project `.env` file.
 */

// Define the token that must match the one sent by your website API
const SHARED_SECRET_TOKEN = "CHANGE_ME_SECRET_TOKEN";

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    
    // Authorization Check
    if (!data.token || data.token !== SHARED_SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unauthorized access / Acceso no autorizado" }))
                           .setMimeType(ContentService.MimeType.JSON)
                           .setStatusCode(401);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row is set up if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["id", "name", "email", "created_at", "updated_at"]);
    }
    
    const uuid = Utilities.getUuid();
    const name = data.name || "";
    const email = data.email || "";
    const now = new Date().toISOString();
    
    sheet.appendRow([uuid, name, email, now, now]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setStatusCode(500);
  }
}
