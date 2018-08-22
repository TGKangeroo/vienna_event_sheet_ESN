



//Add Triggers --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeTriggers(){



  ScriptApp.newTrigger('onEdit')
  .forSpreadsheet(ss)
  .onEdit()
  .create();

  ScriptApp.newTrigger('onSubmit')
  .forSpreadsheet(ss)
  .onFormSubmit()
  .create();



  var enddate =  Utilities.formatDate(new Date(getFieldValue('script_registration_close_date')), "Europe/Vienna", "dd-yyyy-MM");
  var today =  Utilities.formatDate(new Date(), "Europe/Vienna", "dd-yyyy-MM");

  if(today !=enddate && today <enddate){
    ScriptApp.newTrigger("checkEndDate")
    .timeBased()
    .atHour(12)
    .everyDays(1) // Frequency is required if you are using atHour() or nearMinute()
    .create();
  }

}




//Remove Triggers --------------------------------------------------------------------------------------------------------------------------------------------------------//
function removeTriggers(){
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}




//on Sheet Edit Trigger --------------------------------------------------------------------------------------------------------------------------------------------------------//
function onEdit(e){
  var paid = getColumnId("Paid");
  var range = e.range
  var row = range.getRow(); // row used for inserting into the google sheet
  var row_script=row-1 // counting started from 1 instead of from 0 dirty fix to make it look like an array usable for every function in this sheet.
  var editedSheet = e.source.getActiveSheet();
  var answer = "yes";
  var script_form_fields_amount= getFieldValue('script_form_fields_amount'); 
  var event_max_participants= getFieldValue('event_max_participants'); 
  var script_color_on_paid = getFieldValue('script_color_on_paid');
  var script_auto_confirm_mails = getFieldValue('script_auto_confirm_mails');
  var script_close_form_max_part = getFieldValue('script_close_form_max_part');
  var amount_total_part=0;
  //check if the changed value is on the paid row and if it's changed to yes
  if(range.getColumn() == script_form_fields_amount + 2 && e.value =="yes" && editedSheet.getName()==registerSheet.getName()){
    
    
    setFieldValue('amount_total_part',countParticipants());
    amount_total_part = getFieldValue('amount_total_part');
    
    if(amount_total_part > event_max_participants){
      answer = showAlert('Warning max participants reached',"If you accept this person you're over your max amount of participants!");
    }
    
  }
  
  if(answer=="yes"){
    if(range.getColumn() == paid && paid !=-1 ){
      
      switch (e.value) {
        case "yes":
          if(amount_total_part == event_max_participants){
            showAlert('Warning, last participant!','This is the last person you can accept before you reach the max amount of participants');
          }
          
          if(script_color_on_paid == "yes"){
            
            registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("MediumSeaGreen");
            var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
            
          }
          
          if(script_auto_confirm_mails=="yes"){
            sendconfirmationEmail(row_script);
          }
          addToPrintList(row_script)
          break;
        case "no":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("white");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          
          removeFromPrintList(row_script)
          
          break;
        case "cancelled":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("red");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          removeFromPrintList(row_script)
          break;
        case "refunded":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("lightBlue");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          removeFromPrintList(row_script)
          break;
          
          
      }
   
    }
    
    
    
    if(amount_total_part == event_max_participants && event_max_participants != "0" && script_close_form_max_part == "yes" ){
      closeForm();
    }
    
  }else{
    
    registerSheet.getRange(row, script_form_fields_amount + 2 ).setValue('no');
    
  }
  
 
  
  if(editedSheet.getName()=='Registrations'){
   totalPriceToBePaid(row_script);
  }
 
  updatePrices();
  
}






//on Form Submit Trigger --------------------------------------------------------------------------------------------------------------------------------------------------------//
function onSubmit(e){
  var script_form_fields_amount = getFieldValue('script_form_fields_amount');
  var script_paid_row_added = getFieldValue('script_paid_row_added');
  var paidRange = registerSheet.getRange(2, script_form_fields_amount +1, registerSheet.getMaxRows(), script_form_fields_amount + 2);
  if(script_paid_row_added !="yes"){
    
    makePayAndEditedRow();
    
  }
  
  var range = e.range;
  var row = range.getRow(); // row used for inserting into the google sheet
  var row_script=row-1 // counting started from 1 instead of from 0 dirty fix to make it look like an array usable for every function in this sheet.
  var editedSheet = e.source.getActiveSheet();
  var cell= paidRange.getCell(row_script,2);
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(['yes', 'no','cancelled','refunded'], false).build();
  cell.setDataValidation(rule);
  var event_max_participants = getFieldValue('event_max_participants');
  var script_auto_confirm_mails = getFieldValue('script_auto_confirm_mails');
  var script_auto_registration_mails = getFieldValue('script_auto_registration_mails');
  var script_close_form_max_part = getFieldValue('script_close_form_max_part');
  var event_isPaid = getFieldValue('event_isPaid');
  var amount_total_part=0;
  amount_total_part = getFieldValue('amount_total_part');
  if(event_isPaid=="yes"){
    if(cell.getValue() !="cancelled" && cell.getValue() !="refunded"){
      cell.setValue('no');
      SpreadsheetApp.flush();
    }
  }else{
    cell.setValue('yes');
    
    //setFieldValue('event_max_participants',countParticipants()); 
    
    if(script_auto_confirm_mails=="yes"){
      sendconfirmationEmail(row_script);
    }
    
    addToPrintList(row_script)
    
    if((amount_total_part == event_max_participants || amount_total_part > event_max_participants)  && event_max_participants != "0" && script_close_form_max_part == "yes" ){
      closeForm();
    }
    
    SpreadsheetApp.flush();
  }
  
  
  if(script_auto_registration_mails=="yes" && event_isPaid =="yes"){
    
    sendRegisterEmail(row_script);
  }
  
  
   totalPriceToBePaid(row_script);
  
 
  SpreadsheetApp.flush();
  
}


function letsSubmit(){

registerSheet.getRange('B35').setValue('hello');


}
//reset the triggers --------------------------------------------------------------------------------------------------------------------------------------------------------//
function resetTriggers(){
  removeTriggers();
  makeTriggers();
}
