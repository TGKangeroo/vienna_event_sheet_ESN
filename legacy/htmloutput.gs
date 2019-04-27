// Function for processing the data from eventInformationForm.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheetEventInformation(e){
 setFieldValue('event_title',e.event_title);
  setFieldValue('event_description',e.event_description);
  setFieldValue('event_start_date',e.event_start_date);
  setFieldValue('event_end_date',e.event_end_date);
  setFieldValue('event_end_time',e.event_end_time);
  setFieldValue('event_start_time',e.event_start_time);
  setFieldValue('event_meetingpoint',e.event_meetingpoint);
  setFieldValue('event_max_participants',e.event_max_participants);
  setFieldValue('event_isPaid',e.event_isPaid);
  setFieldValue('event_section',e.event_section);
  setFieldValue('cancellation_policy',e.cancellation_policy);
  setFieldValue('dsgvo_policy',e.dsgvo_policy);
 setFieldValue('script_registration_close_date',e.script_registration_close_date);

  //opens makeAnEvent.html
 openMakeAnEvent();
}


// Function for processing test data from test.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheettest(e){
  

for(var key in e) {

Logger.log(key); // logs property name
Logger.log(e[key]); //logs value for the property


}
  
//  optionSheet.getRange(3, 4).setValue(e.price & i+1 & _description);
  // Create a 'Responses' sheet if it does not exist.

 

 
}

// Function for processing the data from prices.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheetPrices(e){
  // Replace with your spreadsheet's ID.
 var ss = SpreadsheetApp.getActiveSpreadsheet();

var optionSheet = ss.getSheetByName("Options");
var keyrow=1;
var oldrow=1;
var row=1;
var column=0;
for(var key in e) {
  oldrow=keyrow;
  keyrow=key.substring(key.indexOf("_") -1,key.indexOf("_") );
  
  if(oldrow!=keyrow)
  {
    row= row+1;
    column=1;
  }
  else
  {
  column=column+1;
  }
  
  if (column==3)
  {
    column=4;
  }
  
  optionSheet.getRange(2 + row, 3 + column).setValue(e[key]);
  
  
}
//opens makeAnEvent.html
openMakeAnEvent();
 
}

// Function for processing the data from questions.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheetQuestions(e){
  // Replace with your spreadsheet's ID.
 var ss = SpreadsheetApp.getActiveSpreadsheet();

var optionSheet = ss.getSheetByName("Options");
var keyrow=1;
var oldrow=1;
var row=1;
var column=0;
for(var key in e) {
  oldrow=keyrow;
  keyrow=key.substring(key.indexOf("_") -1,key.indexOf("_") );
  
  if(oldrow!=keyrow)
  {
    row= row+1;
    column=1;
  }
  else
  {
  column=column+1;
  }
  
 
  
  //optionSheet.getRange(3 + row, 9 + column).setValue(e[key]);
  Logger.log(e[key]);
  
}
  //opens makeAnEvent.html
  openMakeAnEvent();
}

// Function for processing the data from scripting_options.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheetScriptingOptions(e){

  // Create a 'Responses' sheet if it does not exist.
 setFieldValue('script_auto_confirm_mails',e.script_auto_confirm_mails);
  setFieldValue('script_confirm_mail_name',e.script_confirm_mail_name);
  setFieldValue('script_auto_registration_mails',e.script_auto_registration_mails);
  setFieldValue('script_registration_mail_name',e.script_registration_mail_name);
  setFieldValue('script_register_on_pay',e.script_register_on_pay);
  setFieldValue('script_extra_mail_name',e.script_extra_mail_name);
  setFieldValue('script_extra_mail_on_pay',e.script_extra_mail_on_pay);
  setFieldValue('script_sticky_names',e.script_sticky_names);
  setFieldValue('script_close_form_max_part',e.script_close_form_max_part);
  setFieldValue('script_color_on_paid',e.script_color_on_paid);
 

 //opens makeAnEvent.html
openMakeAnEvent();
 
}

// Function for processing the data from finance.html -----------------------------------------------------------------------------------------------------------------------------------
function postFormDataToSheetFinanceOptions(e){

  // Create a 'Responses' sheet if it does not exist.
 setFinanceValue('paypal_allowed', e.paypal_allowed);
 setFinanceValue('paypal_email_address', e.paypal_email_address);
 setFinanceValue('paypal_business_percentage', e.paypal_business_percentage);
 setFinanceValue('paypal_description', e.paypal_description);
 setFinanceValue('banktransfer_allowed', e.banktransfer_allowed);
 setFinanceValue('banktransfer_account_owner', e.banktransfer_account_owner);
 setFinanceValue('banktransfer_bank_name', e.banktransfer_bank_name);
 setFinanceValue('banktransfer_iban', e.banktransfer_iban);
 setFinanceValue('banktransfer_bic', e.banktransfer_bic);
 setFinanceValue('banktransfer_description', e.banktransfer_description);
 setFinanceValue('cash_allowed', e.cash_allowed);
 setFinanceValue('cash_office_address', e.cash_office_address);
 setFinanceValue('cash_office_days', e.cash_office_days);
 setFinanceValue('cash_office_hours', e.cash_office_hours);
 

 // opens home.html
openHome();
 
}
