var SHEET_NAME = 'Waitlist';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = (data.email || '').trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return jsonResponse(400, { error: 'Invalid email address.' });
    }

    var sheet = getOrCreateSheet();
    if (isDuplicate(sheet, email)) {
      return jsonResponse(409, { error: 'This email is already on the waitlist.' });
    }

    sheet.appendRow([email, new Date().toISOString(), 'waitlist']);
    return jsonResponse(200, { message: 'Success' });
  } catch (err) {
    return jsonResponse(500, { error: 'Server error. Please try again.' });
  }
}

function doGet() {
  return jsonResponse(200, { status: 'ok' });
}

function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email) && email.length <= 254;
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Email', 'Signed Up', 'Source']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isDuplicate(sheet, email) {
  var emails = sheet.getRange('A:A').getValues();
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).toLowerCase() === email) return true;
  }
  return false;
}

function jsonResponse(statusCode, payload) {
  payload.statusCode = statusCode;
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
