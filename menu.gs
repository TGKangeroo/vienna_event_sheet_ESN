function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Registrations')
      .addItem('Show Application', 'openHome')
      .addItem('Generate printlist', 'refreshPrintList')
      .addSeparator()
      .addSubMenu(ui.createMenu('Form')
          .addItem('Generate form', 'makeForm')
          .addItem('Open', 'openForm')
          .addItem('Close', 'closeForm'))
      .addSubMenu(ui.createMenu('Emails')
          .addItem('Send registration emails', 'registerEmail')   
          .addItem('Send confirmation emails', 'confirmationEmail')
          .addItem('Send extra emails', 'sendExtraEmail')
          .addItem('Email shortcuts','emailShortcuts'))
      .addSubMenu(ui.createMenu('Tutorials')
          .addItem('Event information', 'tutorial_event_fields')
          .addItem('Form questions', 'tutorial_form_questions')
          .addItem('Price fields', 'tutorial_price_fields')
          .addItem('Script options', 'tutorial_script_options')
          .addItem('Finance options', 'tutorial_finance_options'))
                  
      .addToUi();
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('home');
}
function getContent(filename) {

var return1= HtmlService.createTemplateFromFile(filename).getRawContent();
return return1;
}

function openHome() {
  
  var html = HtmlService.createTemplateFromFile('home')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Event UI 1.0');
  
 
}
function openFinanceForm() {
  
  var html = HtmlService.createTemplateFromFile('finance')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Finance information');
  
 
}

function openTest() {
  
  var html = HtmlService.createTemplateFromFile('test')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Event UI 1.0');
  
 
}

function openEmail() {
  
  var html = HtmlService.createTemplateFromFile('emails')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Email Shortcuts');
  
 
}

function openEventInformationForm() {
  
  var html = HtmlService.createTemplateFromFile('eventInformationForm')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Event information');
  
 
}
function openPricesForm() {
  
  var html = HtmlService.createTemplateFromFile('prices')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Price list');
  
 
}

function openQuestionsForm() {
  
  var html = HtmlService.createTemplateFromFile('questions')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Question list');
  
 
}
function openScriptingForm() {
  
  var html = HtmlService.createTemplateFromFile('scripting_options')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Scripting options');
  
 
}

function openMakeAnEvent(){
var html = HtmlService.createTemplateFromFile('makeAnEvent')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Make an Event');
}

function multi_payment(){
var html = HtmlService.createTemplateFromFile('multi_payment')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Payment methods');
  

}
function openPrintlist(){
var html = HtmlService.createTemplateFromFile('printlist')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(500).setWidth(800);

  SpreadsheetApp.getUi().showModalDialog(html, 'Make a print list');
  

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}
