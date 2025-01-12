const Util = {
  getDateStr(date = null) { if (date == null) date = new Date(); return Utilities.formatDate(date, 'JST', 'yyyy-MM-dd HH:mm:ss'); },
  output(range, value) { return range.setNumberFormat('@').setValue(value); },
};

function doPost(e) {
  return doMain(e.parameters);
}

function doMain(args = null) {
  if (args == null) args = {};

  const params = {
    name: args.name ?? '',
    subject: args.subject ?? '',
    body: args.body ?? '',
  };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const form = {};
  form.sheet = ss.getSheetByName('form');
  form.newRow = form.sheet.getLastRow() + 1;
  form.getCell = (col) => form.sheet.getRange(`${col}${form.newRow}`);
  form.output = (col, value) => Util.output(form.getCell(col), value);

  form.output('A', Util.getDateStr());
  form.output('B', params.name);
  form.output('C', params.subject);
  form.output('D', params.body);

  const content = JSON.stringify({ params }, null, 2);
  const mimeType = ContentService.MimeType.JSON;
  const response = ContentService.createTextOutput(content).setMimeType(mimeType);

  return response;
}
