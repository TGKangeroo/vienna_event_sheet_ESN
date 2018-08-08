function fields(name){
var fields=[];
//variables for event information (Blue block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
 fields['event_title']='B3';
 fields['event_description']='B4';
 fields['event_start_date']='B5';
 fields['event_start_time']='B6';
 fields['event_end_date']='B7';
 fields['event_end_time']='B8';
 fields['event_meetingpoint']='B9';
 fields['event_max_participants']='B10';
 fields['event_isPaid']='B11';
 fields['event_section']='B12';
fields['cancellation_policy']='B13';
  fields['dsgvo_policy']='B14';
//variables for script functions (red block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
 fields['script_paid_row_added']='B18';
 fields['script_form_made']='B19';
 fields['script_auto_confirm_mails']='B22';
 fields['script_confirm_mail_name']='B23';
 fields['script_auto_registration_mails']='B24';
 fields['script_registration_mail_name']='B25';
 fields['script_register_on_pay']='B26';
 fields['script_extra_mail_name']='B27';
 fields['script_extra_mail_on_pay']='B28';
 fields['script_sticky_names']='B29';
 fields['script_close_form_max_part']='B30';
 fields['script_color_on_paid']='B31';
 fields['script_form_fields_amount']='B32';
 fields['script_registration_close_date']='B33';

//variables for the event price (yellow block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
 fields['amount_total_part']='F20';
 fields['price_total_money']='F21';
 fields['price_total_amount_prices']='B22';
 
//script generated fields
  fields['printlist_added']='B17';
fields['rows_added']='B18';
fields['form_made']='B19';
// tutorial variables
fields['tutorial'] = 'B47';

//links
fields['form_view_link']='B37';
fields['form_edit_link']='B38';
fields['sheet_edit_link']='B39';
fields['form_id']='B40';

  
  return fields[name];
}



function getSectionDropdownOptions()
{
  var sections=["UW","BOKU","TU","BFI","WKW","Technikum","Vienna"];
return sections;

}
function getPaidDropdownOptions()
{
  var paid=["yes","no"];
  return paid;
}

function getDSGVODropdownOptions()
{
  var DSGVOS=["Standard","Custom"];
return DSGVOS;

}
function getcancellationPolicyDropdownOptions()
{
  var cancellations=["14","7","0","Custom"];
return cancellations;

}
function getFieldValue(field){

  return optionSheet.getRange(fields(field)).getValue();



}

function setFieldValue(field,value){

  return optionSheet.getRange(fields(field)).setValue(value);
}
