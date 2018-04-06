//sheet variables

var ss = SpreadsheetApp.getActiveSpreadsheet();

var optionSheet = ss.getSheetByName("Options");

var printSheet=ss.getSheetByName("Print list");
var financeSheet = ss.getSheetByName("Finances");
var budgetSheet = ss.getSheetByName("Budget");



var registerSheet = ss.getSheets()[0];



// event variables
var event_title = optionSheet.getRange('B3').getValue();
var event_description = optionSheet.getRange('B4').getValue();
var event_start_date = optionSheet.getRange('B5').getValue();
var event_start_time = optionSheet.getRange('B6').getValue();
var event_end_date = optionSheet.getRange('B7').getValue();
var event_end_time = optionSheet.getRange('B8').getValue();
var event_meetingpoint = optionSheet.getRange('B9').getValue();
var event_max_participants = optionSheet.getRange('B10').getValue();
var event_isPaid = optionSheet.getRange('B11').getValue();

//script questions
var script_auto_confirm_mails = optionSheet.getRange('B19').getValue();
var script_confirm_mail_name = optionSheet.getRange('B20').getValue();
var script_auto_registration_mails = optionSheet.getRange('B21').getValue();
var script_registration_mail_name = optionSheet.getRange('B22').getValue();
var script_register_on_pay = optionSheet.getRange('B23').getValue();
var script_extra_mail_name = optionSheet.getRange('B24').getValue();
var script_extra_mail_on_pay = optionSheet.getRange('B25').getValue();
var script_sticky_names = optionSheet.getRange('B26').getValue();
var script_close_form_max_part = optionSheet.getRange('B27').getValue();
var script_color_on_paid = optionSheet.getRange('B28').getValue();
var script_form_fields_amount = optionSheet.getRange('B29').getValue();
var script_registration_close_date = optionSheet.getRange('B30').getValue();
var script_paid_row_added = optionSheet.getRange('B15').getValue();
var script_form_made = optionSheet.getRange('B16').getValue(); 
// price variables
var amount_total_part = optionSheet.getRange('F17').getValue();
var price_total_money = optionSheet.getRange('F18').getValue();
var price_total_amount_prices = optionSheet.getRange('F19').getValue();
var prices = getAllPrices();


// finance variables
//PayPal
var finance_paypal_allowed = financeSheet.getRange('B5').getValue();
var finance_paypal_email = financeSheet.getRange('B6').getValue();
var finance_paypal_percentage = financeSheet.getRange('B7').getValue();
var finance_paypal_description = financeSheet.getRange('B8').getValue();

//bank transfer
var finance_bank_allowed = financeSheet.getRange('B12').getValue();
var finance_bank_owner = financeSheet.getRange('B13').getValue();
var finance_bank_name = financeSheet.getRange('B14').getValue();
var finance_bank_IBAN = financeSheet.getRange('B15').getValue();
var finance_bank_BIC = financeSheet.getRange('B16').getValue();
var finance_bank_description = financeSheet.getRange('B17').getValue();

//cash
var finance_cash_allowed = financeSheet.getRange('B21').getValue();
var finance_cash_office = financeSheet.getRange('B22').getValue();
var finance_cash_days = financeSheet.getRange('B22').getValue();
var finance_cash_hours = financeSheet.getRange('B23').getValue();


//constant variables
var CONFIRM_MAIL = "confirm sent";
var REGISTER_MAIL = "register sent";
var EXTRA_MAIL = "extra sent";

//tutorial vars
var tutorial = optionSheet.getRange('B44').getValue();



function getAllPrices(){
  
  var dataRange = optionSheet.getRange(3,4,13,5);
  
  var data = dataRange.getValues();
  
  return data;
  
}

function getAllQuestions(){
  var dataRange = optionSheet.getRange(4,10,32,5);
  
  var data = dataRange.getValues();
  
  return data;
  
  
}





function onEdit(e){
  var paid = getColumnId("Paid");
  var range = e.range
  var row = range.getRow();
  
  var answer = "yes";
  
  event_max_participants = optionSheet.getRange('B10').getValue();
  var amount_total_part=0;
  //check if the changed value is on the paid row and if it's changed to yes
  if(range.getColumn() == script_form_fields_amount + 2 && e.value =="yes"){
    optionSheet.getRange('F17').setValue(countParticipants()); 
    amount_total_part = optionSheet.getRange('F17').getValue();
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
            sendconfirmationEmail(row);
          }
          addToPrintList(row)
          break;
        case "no":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("white");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          
          removeFromPrintList(row)
          
          break;
        case "cancelled":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("red");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          removeFromPrintList(row)
          break;
        case "refunded":
          registerSheet.getRange(row,1,1,script_form_fields_amount + 3).setBackground("lightBlue");
          var cell = registerSheet.getRange(row,script_form_fields_amount + 3).setValue(new Date());
          removeFromPrintList(row)
          break;
          
          
      }
      optionSheet.getRange('F17').setValue(countParticipants()); 
    }
    
    
    
    if(amount_total_part == event_max_participants && event_max_participants != "0" && script_close_form_max_part == "yes" ){
      closeForm();
    }
    
  }else{
    
    registerSheet.getRange(row, script_form_fields_amount + 2 ).setValue('no');
    
  }
  
  updatePrices();
  
}



//close the google form
function closeForm(){
  var form = FormApp.openByUrl(optionSheet.getRange('B35').getValue());
  
  form.setAcceptingResponses(false);
  form.setCustomClosedFormMessage("I'm sorry but we're currently not taking anymore registrations. This means that either we've reached the maximum amount of participants, or the registration deadline has passed.");
  
}

//open the google form
function openForm(){
  var form = FormApp.openByUrl(optionSheet.getRange('B35').getValue());
  
  form.setAcceptingResponses(true);
}


//makes the paid and last edited row
function makePayAndEditedRow(){
  var firstcell = registerSheet.getRange(1,script_form_fields_amount +2);
  
  firstcell.setValue('Paid');
  
  var secondcell = registerSheet.getRange(1,script_form_fields_amount +3);
  secondcell.setValue('last Edited');
  
  optionSheet.getRange('B15').setValue("yes");
  
}

//function activated when someone submits a form response
function onSubmit(e){
  
  var paidRange = registerSheet.getRange(2, script_form_fields_amount +1, registerSheet.getMaxRows(), script_form_fields_amount + 2);
  if(script_paid_row_added !="yes"){
    
    makePayAndEditedRow();
    
  }
  
  var range = e.range;
  var row = range.getRow();
  
  var cell= paidRange.getCell(row-1,2);
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(['yes', 'no','cancelled','refunded'], false).build();
  cell.setDataValidation(rule);
  event_max_participants = optionSheet.getRange('B10').getValue();
  var amount_total_part=0;
  amount_total_part = optionSheet.getRange('F17').getValue();
  if(event_isPaid=="yes"){
    if(cell.getValue() !="cancelled" && cell.getValue() !="refunded"){
      cell.setValue('no');
      SpreadsheetApp.flush();
    }
  }else{
    cell.setValue('yes');
    
    optionSheet.getRange('F17').setValue(countParticipants()); 
    
    if(script_auto_confirm_mails=="yes"){
      sendconfirmationEmail(row);
    }
    
    addToPrintList(row)
    
    if((amount_total_part == event_max_participants || amount_total_part > event_max_participants)  && event_max_participants != "0" && script_close_form_max_part == "yes" ){
      closeForm();
    }
    
    SpreadsheetApp.flush();
  }
  
  
  if(script_auto_registration_mails=="yes" && event_isPaid =="yes"){
    
    sendRegisterEmail(row);
  }
  
  SpreadsheetApp.flush();
  
}




//make the form with questions
function makeForm(){
  
  if(script_form_made!="yes"){
    form = FormApp.create(event_title)
    .setDescription(event_description)
    .setConfirmationMessage('Thanks for registering!')
    .setAllowResponseEdits(false)
    .setAcceptingResponses(true)
    .setRequireLogin(false);
    
    var questions = getAllQuestions();
    
    for (var i = 0; i < questions.length; ++i) {
      
      var row = questions[i];
      row[1] = row[1].toLowerCase(); 
      var required;
      if (row[3] == "TRUE" || row[3] == "true" || row[3] == true ){
        required = true;
        
      }else{
        required = false;
      }
      if(row[1] == "text"){
        makeTextItem(form,row[0],row[4],required);
      }
      if(row[1] == "email"){
        makeEmailItem(form,row[0],row[4],required);
      }
      if(row[1] == "dropdown"){
        makeDropdownItem(form,row[0],row[4],row[2].split(','),required);
      }
      if(row[1] == "checkbox"){
        makeCheckBoxItem(form,row[0],row[4],row[2].split(','),required);
      }
      if(row[1] == "radiobutton"){
        makeRadioButtonItem(form,row[0],row[4],row[2].split(','),required);
      }
      if(row[1] == "date"){
        makeDateItem(form,row[0],row[4],required);
      }
      if(row[1] == "time"){
        makeTimeItem(form,row[0],row[4],required);
      }
      if(row[1] == "datetime"){
        makeDateTimeItem(form,row[0],row[4],required);
      }
      if(row[1] == "duration"){
        makeDurationItem(form,row[0],row[4],required);
      }
      
      
      
      
      
    }
    form.setDestination(FormApp.DestinationType.SPREADSHEET,ss.getId());
    makeTriggers();
    //sharingIsCaring(Form);
    optionSheet.getRange('B15').setValue(""); 
    optionSheet.getRange("B34").setValue(form.getPublishedUrl());
    optionSheet.getRange("B35").setValue(form.getEditUrl());
    optionSheet.getRange("B36").setValue(ss.getUrl());
    //make it refresh
    
    optionSheet.getRange('B16').setValue("yes"); 
    optionSheet.getRange('B37').setValue(form.getId());
    optionSheet.getRange('A37').setValue("Form ID");
    makePrintList();
    SpreadsheetApp.flush();
  }else{
    showAlert('form already made', "You've already made a form in this sheet. Please make a new sheet. If this sheet is already new, please delete the 'yes' in cell B16");
  }
}


//make automatic triggers
function makeTriggers(){



  ScriptApp.newTrigger('onEdit')
  .forSpreadsheet(ss)
  .onEdit()
  .create();

  ScriptApp.newTrigger('onSubmit')
  .forSpreadsheet(ss)
  .onFormSubmit()
  .create();



  var enddate =  Utilities.formatDate(new Date(optionSheet.getRange('B30').getValue()), "Europe/Vienna", "dd-yyyy-MM");
  var today =  Utilities.formatDate(new Date(), "Europe/Vienna", "dd-yyyy-MM");

  if(today !=enddate && today <enddate){
    ScriptApp.newTrigger("checkEndDate")
    .timeBased()
    .atHour(12)
    .everyDays(1) // Frequency is required if you are using atHour() or nearMinute()
    .create();
  }

}




//remove triggers
function removeTriggers(){
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
function makeEmailItem(form,title,Description,required,item){
  item = makeTextItem(form,title,Description,required,item);
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .build();
  item.setValidation(emailValidation)
}
function makeTextItem(form,title,Description,required,item){
  if(item == null){
    item = form.addTextItem();
    item.setRequired(required);
  }
  item.setTitle(title)
  .setHelpText(Description);
  return item;
}

function makeDropdownItem(form,title,Description,choices,required,item){
  var process = "update";
  if(item == null){
    var item = form.addListItem();

    process = "insert";
  }

  if(process == "update"){
    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.asListItem().createChoice(thisValue);

      arrayOfItems.push(newItem);
    }

    item.asListItem().setTitle(title)
    .setChoices(arrayOfItems)
    .setHelpText(Description);

  }else{


    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.createChoice(thisValue);

      arrayOfItems.push(newItem);
    }

    item.setTitle(title)
    .setChoices(arrayOfItems)
    .setHelpText(Description)
    .setRequired(required);


  }



}

function makeCheckBoxItem(form,title,Description,choices,required,item){
  process = "update";
  if(item == null){
    var item = form.addCheckboxItem();
    process = "insert";

  }

  if(process=="update"){
    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.asCheckboxItem().createChoice(thisValue);
      arrayOfItems.push(newItem);
    }

    item.asCheckboxItem().setTitle(title)
    .setChoices(arrayOfItems)
    .showOtherOption(false)
    .setHelpText(Description)
    .setRequired(required);}

  else{
    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.createChoice(thisValue);
      arrayOfItems.push(newItem);
    }

    item.setTitle(title)
    .setChoices(arrayOfItems)
    .showOtherOption(false)
    .setHelpText(Description)
    .setRequired(required);
  }


}

function makeRadioButtonItem(form,title,Description,choices,required,item ){
  process="update";
  if(item == null){
    var item = form.addMultipleChoiceItem();
    process = "insert";
  }

  if(process=="update"){
    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.asMultipleChoiceItem().createChoice(thisValue);
      arrayOfItems.push(newItem);
    }

    item.asMultipleChoiceItem().setTitle(title)
    .setChoices(arrayOfItems)
    .setHelpText(Description)
    .showOtherOption(false)
    .setRequired(required);
  }else{
    var arrayOfItems = [];
    for (var i=0;i<choices.length;i++) {
      var thisValue = choices[i];

      var newItem = item.createChoice(thisValue);
      arrayOfItems.push(newItem);
    }

    item.setTitle(title)
    .setChoices(arrayOfItems)
    .setHelpText(Description)
    .showOtherOption(false)
    .setRequired(required);
  }
}

function makeDateItem(form,title,Description,required,item){
  if(item == null){
    var item = form.addDateItem();
    item.setRequired(required);
  }
  item.setTitle(title)
  .setHelpText(Description);

}

function makeDateTimeItem(form,title,Description,required,item){



  if(item == null){
    var item = form.addDateTimeItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);

}

function makeTimeItem(form,title,Description,required,item){

  if(item == null){
    var item = form.addTimeItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);


}

function makeDurationItem(form,title,Description,required,item){
  if(item == null){
    var item = form.addDurationItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);

}



//share sheet with others
function sharingIsCaring(){

  var lastRow = formoptionsheet.getLastRow();
  var dataRange = formoptionsheet.getRange(2,10,lastRow); // let it read more columns than are being used, it might mess up otherwise

  var betterDatarange = formoptionsheet.getRange(3,10,dataRange.getLastRow());

  // Fetch values for each row in the Range.
  var data = betterDatarange.getValues();

  for (var i = 0; i < data.length; ++i) {
    if(data[i] !=""){
      ss.addEditor(data[i]);
      form.addEditor(data[i]);
    }
  }
}

function getColumnId(colName ) {

  var data = registerSheet.getDataRange().getValues();
  var col = data[0].indexOf(colName);
  if (col != -1) {
    return col +1;
  }else{
    return -1;
  }
}

function getByName(colName, row ) {

  var data = registerSheet.getDataRange().getValues();
  var col = data[0].indexOf(colName);
  if (col != -1) {
    if(data[row]!=null){
      if(data[row][col] != null ){
        return data[row][col];
      }else{
        return "";
      }
    }}
}

//updates the Amount column in the prices block
function updatePrices(){

  var prices = getAllPrices();
  for (var i = 0; i < prices.length;i++){
    prices[i][2] = 0;
  }

  var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() -1, script_form_fields_amount + 3); // let it read more columns than are being used, it might mess up otherwise
  var data2 = registerSheet.getDataRange().getValues();
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  for (var i = 0; i < data.length; ++i) {
    if (data[i][script_form_fields_amount+1] =="yes"){
      for (var y =0;y < prices.length;y++){

        var index = data2[0].indexOf(prices[y][3]);

        if(data[i][index] == prices[y][4]){
          prices[y][2] = prices[y][2] + 1;
        }

      }

    }
  }

  dataRange = optionSheet.getRange(3,6,14);
  data = dataRange.getValues();

  for(i = 0 ; i <data.length;i++){

    if(prices[i]!=null){
      optionSheet.getRange(i+3,6).setValue(prices[i][2]);
      SpreadsheetApp.flush();
    }
  }

}


function calculatePrice(row){

  var prices = getAllPrices();
  var pay = 0;
  for (var i =0;i < prices.length;i++){


    if(prices[i][3] == "Base Price"){
      pay = pay + prices[i][1];
    }else{

      if(getByName(prices[i][3], row-1) == prices[i][4]){
        pay = pay + prices[i][1];
      }
    }


  }


  return pay;

}
/**
* This function was adapted from YetAnotherMailMerge by Romain Vaillard.
* Given a template email message, identify any attachments that are used
* as inline images in the message, and move them from the attachments list
* to the inlineImages list, updating the body of the message accordingly.
*
* @param   {GmailMessage} template  Message to use as template
* @returns {Object}                 An object containing the updated
*                                   templateBody, attachments and inlineImages.
*/
function updateInlineImages(template) {
  //////////////////////////////////////////////////////////////////////////////
  // Get inline images and make sure they stay as inline images
  //////////////////////////////////////////////////////////////////////////////
  var templateBody = template.getBody();
  var rawContent = template.getRawContent();
  var attachments = template.getAttachments();

  var regMessageId = new RegExp(template.getId(), "g");
  if (templateBody.match(regMessageId) != null) {
    var inlineImages = {};
    var nbrOfImg = templateBody.match(regMessageId).length;
    var imgVars = templateBody.match(/<img[^>]+>/g);
    var imgToReplace = [];
    if(imgVars != null){
      for (var i = 0; i < imgVars.length; i++) {
        if (imgVars[i].search(regMessageId) != -1) {
          var id = imgVars[i].match(/realattid=([^&]+)&/);
          if (id != null) {
            var temp = rawContent.split(id[1])[1];
            temp = temp.substr(temp.lastIndexOf('Content-Type'));
            var imgTitle = temp.match(/name="([^"]+)"/);
            if (imgTitle != null) imgToReplace.push([imgTitle[1], imgVars[i], id[1]]);
          }
        }
      }
    }
    for (var i = 0; i < imgToReplace.length; i++) {
      for (var j = 0; j < attachments.length; j++) {
        if(attachments[j].getName() == imgToReplace[i][0]) {
          inlineImages[imgToReplace[i][2]] = attachments[j].copyBlob();
          attachments.splice(j, 1);
          var newImg = imgToReplace[i][1].replace(/src="[^\"]+\"/, "src=\"cid:" + imgToReplace[i][2] + "\"");
          templateBody = templateBody.replace(imgToReplace[i][1], newImg);
        }
      }
    }
  }
  var updatedTemplate = {
    templateBody: templateBody,
    attachments: attachments,
    inlineImages: inlineImages
  }
  return updatedTemplate;
}



//function that loops over all registered people to check if they received a confirmation email
function confirmationEmail(){

  if(script_auto_confirm_mails=="yes"){

    //redefine the datarange to the registerSheet values
    var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() -1, script_form_fields_amount + 7); // let it read more columns than are being used, it might mess up otherwise
    // Fetch values for each row in the Range.
    var data = dataRange.getValues();
    for (var i = 0; i < data.length; ++i) {
      var row = data[i];



      var emailSent = row[script_form_fields_amount + 5];     // column where we can check if the user already got an email
      if (emailSent != CONFIRM_MAIL && getByName("Email",i+1) !="" &&  getByName("Paid",i+1)=="yes") {  // Prevents sending duplicates
        var subject = "Confirmation " + event_title;


        //if the user has a whole confirm draft
        if(script_confirm_mail_name != ""){
          if( sendGmailConfirmTemplate(getByName("Email",i+1), subject,i+2))
            registerSheet.getRange(2 + i, script_form_fields_amount + 6).setValue(CONFIRM_MAIL);
        }


        // Make sure the cell is updated right away in case the script is interrupted
        SpreadsheetApp.flush();
      }

    }
  }
}

//function that loops over all registered people to check if they received a registration email
function registerEmail(){

  if(script_auto_registration_mails=="yes"){

    var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() -1, script_form_fields_amount + 7); // let it read more columns than are being used, it might mess up otherwise
    // Fetch values for each row in the Range.
    var data = dataRange.getValues();
    for (var i = 0; i < data.length; ++i) {

      var  row = data[i];


      var emailSent = row[script_form_fields_amount + 5];     // Third column
      if (emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL && getByName("Email",i+1) !="") {  // Prevents sending duplicates
        var subject = "Registration " + event_title;
        if(script_registration_mail_name != ""){
          if(sendGmailRegisterTemplate(getByName("Email",i+1), subject,i+2))
            registerSheet.getRange(2 + i, script_form_fields_amount + 6).setValue(REGISTER_MAIL);
        }


        // Make sure the cell is updated right away in case the script is interrupted
        SpreadsheetApp.flush();
      }

    }
  }
}
function sendExtraEmail(){



  var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() -1, script_form_fields_amount + 7); // let it read more columns than are being used, it might mess up otherwise
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  for (var i = 0; i < data.length; ++i) {

    row = data[i];


    var emailSent = row[script_form_fields_amount + 6];     // Third column
    if (emailSent != EXTRA_MAIL && getByName("Email",i+1) !="" ) {  // Prevents sending duplicates
      var subject =  event_title;
      if(script_extra_mail_name != ""){

        if(script_extra_mail_on_pay == "yes" ){
          if(getByName("Paid",i+1)=="yes"){
            if(sendGmailExtraTemplate(getByName("Email",i+1), subject,i+2)){
              registerSheet.getRange(2 + i, script_form_fields_amount + 7).setValue(EXTRA_MAIL);

            }
          }
        }else{
          if(sendGmailExtraTemplate(getByName("Email",i+2), subject,i))
            registerSheet.getRange(2 + i, script_form_fields_amount + 7).setValue(EXTRA_MAIL);
        }
      }


      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
    }

  }
}

//function that loops over all registered people to check if they received a confirmation email
function sendconfirmationEmail(row){

  if(script_auto_confirm_mails=="yes"){
    var data = registerSheet.getRange(row,script_form_fields_amount + 6 , 1, 1).getValues();


    var emailSent = data[0];



    if (emailSent != CONFIRM_MAIL && getByName("Email",row-1) !="" &&  getByName("Paid",row-1)=="yes") {  // Prevents sending duplicates
      var subject = "Confirmation " + event_title;


      //if the user has a whole confirm draft
      if(script_confirm_mail_name != ""){
        if( sendGmailConfirmTemplate(getByName("Email",row-1), subject,row))
          registerSheet.getRange(row, script_form_fields_amount + 6).setValue(CONFIRM_MAIL);
      }


      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
    }


  }
}

/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/

function sendGmailConfirmTemplate(recipient, subject,i, options) {
  options = options || {};  // default is no options

  var drafts = GmailApp.getDraftMessages();
  var found = false;

  for (var y=0; y<drafts.length && !found; y++) {
    if (drafts[y].getSubject() == script_confirm_mail_name ) {
      found = true;
      var template = drafts[y];
    }
  }
  if (!found) throw new Error( "TEMPLATE not found in drafts folder:"+script_confirm_mail_name);

  // Generate htmlBody from template, with provided text body
  var imgUpdates = updateInlineImages(template);

  var message = imgUpdates.templateBody;

  message = replaceTerms(message,i);

  options.htmlBody = message;
  options.attachments = imgUpdates.attachments;
  options.inlineImages = imgUpdates.inlineImages;
  var body = message;

  return GmailApp.sendEmail(recipient, subject, body, options);
}





function sendRegisterEmail(row){

  if(script_auto_registration_mails=="yes"){
    var data = registerSheet.getRange(row,script_form_fields_amount + 6 , 1, 1).getValues();


    var emailSent = data[0];     // column where we can check if the user already got an email
    if (emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL && getByName("Email",row-1) !="") {  // Prevents sending duplicates
      var subject = "Registration " + event_title;


      //if the user has a whole confirm draft
      if(script_registration_mail_name != ""){
        if( sendGmailRegisterTemplate(getByName("Email",row-1), subject,row))
          registerSheet.getRange(row, script_form_fields_amount + 6).setValue(REGISTER_MAIL);
      }


      // Make sure the cell is updated right away in case the script is interrupted
      SpreadsheetApp.flush();
    }


  }
}

/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailRegisterTemplate(recipient, subject,i, options) {
  options = options || {};  // default is no options

  var drafts = GmailApp.getDraftMessages();
  var found = false;

  var draftsubject = script_registration_mail_name;
  if(script_register_on_pay == "yes"){
    var paymentmethod = getByName("Payment method",i-1);
    draftsubject = draftsubject + "_" + paymentmethod;
  }
  for (var y=0; y<drafts.length && !found; y++) {
    if (drafts[y].getSubject() == draftsubject) {
      found = true;
      var template = drafts[y];
    }
  }
  if (!found) throw new Error( "TEMPLATE not found in drafts folder:" + draftsubject);

  // Generate htmlBody from template, with provided text body
  var imgUpdates = updateInlineImages(template);

  var message = imgUpdates.templateBody;

  message = replaceTerms(message,i);

  options.htmlBody = message;
  options.attachments = imgUpdates.attachments;
  options.inlineImages = imgUpdates.inlineImages;
  var body = message;


  return GmailApp.sendEmail(recipient, subject, body, options);

}







/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailExtraTemplate(recipient, subject,i, options) {
  options = options || {};  // default is no options

  var drafts = GmailApp.getDraftMessages();
  var found = false;
  for (var y=0; y<drafts.length && !found; y++) {
    if (drafts[y].getSubject() == script_extra_mail_name) {
      found = true;
      var template = drafts[y];
    }
  }
  if (!found) throw new Error( "TEMPLATE not found in drafts folder" );

  // Generate htmlBody from template, with provided text body
  var imgUpdates = updateInlineImages(template);

  var message = imgUpdates.templateBody;

  message = replaceTerms(message,i);

  options.htmlBody = message;
  options.attachments = imgUpdates.attachments;
  options.inlineImages = imgUpdates.inlineImages;
  var body = message;
  return GmailApp.sendEmail(recipient, subject, body, options);
}



//Generates a link for PayPal payments
function makePayPalLink(Firstname,lastname,row){

  var price =calculatePrice(row);
  var paypalUrl="https://www.paypal.com/cgi-bin/webscr?business=EMAIL&cmd=_xclick&currency_code=EUR&amount=PRICE&item_name=EVENT";
  var email = finance_paypal_email;
  var description = finance_paypal_description;
  description = description + " " + Firstname + " " + lastname;


  var payPalExtraCost = finance_paypal_percentage;

  price = price * payPalExtraCost + 0.35;

  description = encodeURIComponent(description);

  paypalUrl = paypalUrl.replace("EMAIL",email);
  paypalUrl = paypalUrl.replace("PRICE",price);
  paypalUrl = paypalUrl.replace("EVENT",description);

  return  paypalUrl;
}


//Generates the bank transfer details
function makeBankTransferDetails(){
  var details = "";
  var accountOwner = finance_bank_owner;
  var bankName = finance_bank_name;
  var IBAN = finance_bank_IBAN;
  var BIC = finance_bank_BIC;
  var Description = finance_bank_description;

  details = " Account owner : " + accountOwner + "<br> Bank name : " + bankName + "<br> IBAN : " + IBAN + "<br> BIC : " + BIC + "<br> Description : " + Description;

  return details;
}

//Generates the cash payment details
function makeCashDetails(){


  details = " Office address : <br>" + finance_cash_office + "<br> Opening hours : <br>" + finance_cash_days + "between " + finance_cash_hours ;

  return details;

}


function replaceTerms(message,i){

  var columnrange =registerSheet.getRange(1, 1, 1, script_form_fields_amount + 7);
  var columnvalues = columnrange.getValues();

  while ( message.indexOf("[event_meetingpoint]")>-1 ||
    message.indexOf("[event_end_date]")>-1  || 
    message.indexOf("[event_start_date]")>-1  ||
    message.indexOf("[event_title]")>-1 ||
    message.indexOf("[finance_bank_description]")>-1 ||
    message.indexOf("[price]")>-1 ||
    message.indexOf("[event_max_participants]")>-1   ){

    message = message.replace('[event_meetingpoint]', event_meetingpoint);
    message = message.replace('[event_start_date]', Utilities.formatDate(new Date(event_start_date), "Europe/Vienna", "dd/MM/YYYY"));
    message = message.replace('[event_end_date]', Utilities.formatDate(new Date(event_end_date), "Europe/Vienna", "dd/MM/YYYY"));

    message = message.replace('[event_start_time]', event_start_time);
    message = message.replace('[event_end_time]', event_end_time);
    message = message.replace('[event_title]', event_title);
    message = message.replace('[event_max_participants]', event_max_participants);

    message = message.replace('[paypal_link]',makePayPalLink( getByName("First name",i-1), getByName("Surname",i-1),i));
    message = message.replace('[bank_transfer]',makeBankTransferDetails());
    message = message.replace('[finance_bank_description]',finance_bank_description);
    message = message.replace('[price]',calculatePrice(i));
  }

  for(var j = 0; j <columnvalues[0].length; j++){


    message = message.toString().replace("[" + columnvalues[0][j] + "]",getByName(columnvalues[0][j],i-1));
    var replacer = "[" + columnvalues[0][j] +"]";
    if(replacer != "[]"){
      while ( message.indexOf(replacer)>-1){
        if(replacer == "[Date of Birth]"){
          //  var date =getByName(columnvalues[0][j],i-1)   ;

          // var birthdaydate = Utilities.formatDate(date, "GMT+0200", "dd/MM/YYYY") ;


          //message = message.toString().replace( replacer , birthdaydate);

        }else{
          message = message.toString().replace(  replacer ,getByName(columnvalues[0][j],i-1) );
        }
      }

    }
  }

  return message;

}





//tutorial button functions under here

//tutorial 1 events fields -- update in Git
function tutorial_event_fields(){
SpreadsheetApp.setActiveSheet(optionSheet);
 var range = optionSheet.getRange("B3:B11");

range.setBackground('Red');
  var answer1 = showAlert("Step 1","The first step is filling in the basic information of the event, we've marked all the fields that are still empty red. Once you're done click on tutorial again!");

  if (answer1 == "yes"){
    if(showAlert("Extra information step 1", "To get you going the first thing we need to know is do participants have to pay for your event? ")=="yes"){

      optionSheet.getRange('B11').setValue("yes");
    }
    tutorial++;
  }else{
    if(showAlert("alert", "You have to click yes to go to the next step!")=="yes")
      tutorial++;
  }


  optionSheet.getRange('B44').setValue(tutorial);

}
function tutorial_form_questions(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("J1:M35");

SpreadsheetApp.setActiveRange(range);
  var answer1 = showAlert("Step 2","Let's take a look at the questions you'd like to have in your form.");
  if (answer1 == "yes"){
    tutorial++;
    if(showAlert("Would you like us to prepare the basic questions for you like name, email,... that you need to make it all work?") == "yes"){
      optionSheet.getRange('J4:M35').clearContent();
     optionSheet.getRange('J4').setValue("First name");
    optionSheet.getRange('J5').setValue("Surname");
    optionSheet.getRange('J6').setValue("Email");
    optionSheet.getRange('K4').setValue("text");
    optionSheet.getRange('K5').setValue("text");
    optionSheet.getRange('K6').setValue("email"); // fix github
    optionSheet.getRange('M4').setValue("TRUE");
    optionSheet.getRange('M5').setValue("TRUE");
    optionSheet.getRange('M6').setValue("TRUE");
    SpreadsheetApp.flush();
    }
    var answer2 = showAlert("ESNcard","Is there a difference in payment for ESNcard and no ESNcard?");
    if(answer2 =="yes"){
      script_form_fields_amount = optionSheet.getRange('B29').getValue();
      optionSheet.getRange( script_form_fields_amount+4,10).setValue("ESNcard");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');
      optionSheet.getRange(script_form_fields_amount+4,12).setValue('yes,no');
    }
    SpreadsheetApp.flush();
    var answer3= showAlert("payment types","Are there multiple ways to pay?");

    if(answer3 =="yes"){
      script_form_fields_amount = optionSheet.getRange('B29').getValue();
      optionSheet.getRange( script_form_fields_amount+4,10).setValue("Payment method");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');

      var answer4=showPrompt("options","Which ways to pay are there? Please write them down like this : 'office,PayPal,Banktransfer'. So divided by a comma.");
      optionSheet.getRange(script_form_fields_amount+4,12).setValue(answer4);
    }
    SpreadsheetApp.flush();
    var answer6 = answer6 = showAlert("Step 2","Are there any other questions you'd like to add?");
    script_form_fields_amount = optionSheet.getRange('B29').getValue();
    if(answer6 =="yes"){
     var answer6 = answer6 = showAlert("Step 2","You have to do this in the pink area, Use the questions above as an example!");

      }
     
      SpreadsheetApp.flush();
      answer6 = showAlert("Step 2","Once you're done adding questions, click the tutorial button again to continue!");
    

  }else{
    
      tutorial++;
  }

  optionSheet.getRange('B44').setValue(tutorial);
}
function tutorial_price_fields(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("D1:H19");

SpreadsheetApp.setActiveRange(range);
  var answer1 = showAlert("Step 3", "Time to fill in the prices! Now this is a bit more complicated than step 1 so we'll do this in pieces.");

  if(answer1 =="yes"){
    tutorial++;
    var answer2 = showAlert("Step 3","Does ESNcard matter for the price of your event?");
    if(answer2 =="yes"){
      var answer3 = showPrompt("Price without ESNcard","How much does it cost for someone without ESNcard?");
      optionSheet.getRange('D3').setValue('Price without ESNcard');
      optionSheet.getRange('E3').setValue(answer3);
      var answer4 = showPrompt("Field corresponding to the price","What is the name of the question you ask in your form which tells you if the person has an ESNcard? (for example 'ESNcard')");

      optionSheet.getRange('G3').setValue(answer4);
      optionSheet.getRange('H3').setValue('no');
      optionSheet.getRange('D4').setValue('Price with ESNcard');
      optionSheet.getRange('G4').setValue(answer4);
      optionSheet.getRange('H4').setValue('yes');

      var answer5 = showPrompt("Price with ESNcard","How much does it cost with an ESNcard?");
      optionSheet.getRange('E4').setValue(answer5);




    }else{
      var answer3 = showPrompt("Price","How much does your event cost?");
      optionSheet.getRange('D3').setValue('Base Price');
      optionSheet.getRange('E3').setValue(answer3);

      optionSheet.getRange('G3').setValue('Paid');
      optionSheet.getRange('H3').setValue('yes');

    }
    var answer6 = answer6 = showAlert("Step3","Are there anymore price differences for your event? For example an activity that they can choose to pay or not?");

    if(answer6 =="yes"){
      
    

      answer6 = showAlert("Step3","You have to do this in the yellow area, use the questions above as an example! ");
    }
  }else{
    if(showAlert("alert", "You have to click yes to go to the next step!")=="yes")
      tutorial++;
  }

  optionSheet.getRange('B44').setValue(tutorial);
}

function tutorial_script_options(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("A17:B30");

SpreadsheetApp.setActiveRange(range);
  var answer1 = showAlert("Step 4","Now it's time for the scripting options, we'll go over each one so you know what to do.");

  if (answer1 == "yes"){
    var answer2= showAlert("Automatic emails", "Would you like to send an automatic email once someone has paid? Or if it's a free event, once they've registered");
    if(answer2== "yes"){
      optionSheet.getRange('B19').setValue("yes");
      optionSheet.getRange('B20').setValue(showPrompt("Automatic email","For the sheet to know which email to send, you have to make an Email in your inbox and save it as a draft. We can't do this for you, but I'm sure you can work with your own inbox! This email has to be saved on the same account as the one that will use this sheet.Please fill in the subject of the email you just made or will make afterwards"));

    }else{
      optionSheet.getRange('B19').setValue("no");
    }
    SpreadsheetApp.flush();
    var answer3= showAlert("Automatic emails","Would you like the sheet to send automatic emails once someone has registered? If your event is for free, put no here");
    if(answer3== "yes"){
      optionSheet.getRange('B21').setValue("yes");
      optionSheet.getRange('B22').setValue(showPrompt("Automatic email","For the sheet to know which email to send, you have to make an Email in your inbox and save it as a draft. We can't do this for you, but I'm sure you can work with your own inbox! This email has to be saved on the same account as the one that will use this sheet.Please fill in the subject of the email you just made or will make afterwards"));
      var answer10 = showAlert("Automatic registration Email","Do you want to send different emails for each payment option? For example a different email for the ones that would like to pay with PayPal.")
      optionSheet.getRange('B23').setValue(answer10);

      if(answer10 =="yes"){
        showAlert("different payment types","To get the different emails on payment type to work you have to make some small adjustments to the email you just saved in your inbox! You have to make one email per payment option. So for example if you called your email 'registration email' and you have a payment option called Office and PayPal. You now have to make two emails : 'registration email_Office' and 'registration email_PayPal'.");

      }

    }else{
      optionSheet.getRange('B21').setValue("no");
    }
    SpreadsheetApp.flush();
    var answer4=showAlert("Extra emails","When sending an extra email, for example a survival guide, would you like these emails to only be sent to people that paid?");
    if(answer4 =="yes"){
      optionSheet.getRange('B24').setValue(showPrompt("Extra email","The same counts for the extra email as for the previous two emails! but you can always do this later right before you send the email. But if you already have it ready, please fill in the subject name here."));
      optionSheet.getRange('B25').setValue('yes');
    }

    optionSheet.getRange('B26').setValue(showAlert("Sticky names","Would you like the names of the people that registered to be stuck to the side of the screen when scrolling through? I would advice to say no here, it's bad if you'd like to check the sheet on your mobile."));
    optionSheet.getRange('B27').setValue(showAlert("Closing the form","Would you like the registrations to be closed when reaching the max amount of participants?"));
    optionSheet.getRange('B28').setValue(showAlert("Coloring people","When someone paid, would you like them to turn green like the Hulk?"));
    SpreadsheetApp.flush();
    tutorial++;
  }else{
    
      tutorial++;
  }
  optionSheet.getRange('B44').setValue(tutorial);
}
function tutorial_finance_options(){
  SpreadsheetApp.setActiveSheet(financeSheet);

  var answer1 = showAlert("Step 5","Now let's check all the finance options. they are displayed on the finance tab!");

  if (answer1 == "yes"){
    
    
      var range = financeSheet.getRange("A19:B24");

SpreadsheetApp.setActiveRange(range);
    if(showAlert("Office","Do you allow payments in your office?") == "yes"){
      financeSheet.getRange('B21').setValue('yes');
      financeSheet.getRange('B22').setValue(showPrompt("Office payment","What is the address of your office?"));
      financeSheet.getRange('B23').setValue(showPrompt("Office payment","On which days is your office open? for example : tuesday and thursday"));
      financeSheet.getRange('B24').setValue(showPrompt("Office payment","During which hours is your office open? for example : 2.30pm - 4.00pm"));
    }


  var range = ss.financeSheet.getRange("A10:B17");
SpreadsheetApp.setActiveRange(range);
    if(showAlert("Bank transfer","Do you allow payments through Bank Transfer") == "yes"){
      financeSheet.getRange('B12').setValue('yes');
      financeSheet.getRange('B13').setValue(showPrompt("Bank Transfer","What is the account holders name?"));
      financeSheet.getRange('B14').setValue(showPrompt("Bank Transfer","What is the banks name?"));
      financeSheet.getRange('B15').setValue(showPrompt("Bank Transfer","What is the accounts IBAN?"));
      financeSheet.getRange('B16').setValue(showPrompt("Bank Transfer","What is the accounts BIX?"));
      financeSheet.getRange('B17').setValue(showPrompt("Bank Transfer","What do the participants have to put in the comment field? for example : Event_NAME Participant name"));

    }

    
 var range = ss.financeSheet.getRange("A3:B8");
SpreadsheetApp.setActiveRange(range);
    if(showAlert("PayPal","Do you allow payments through PayPal") =="yes"){
      financeSheet.getRange('B5').setValue('yes');
      financeSheet.getRange('B6').setValue(showPrompt('PayPal','What is the email address of your PayPal account?'));
      financeSheet.getRange('B7').setValue(showPrompt('PayPal',"What is the percentage people with paypal have to pay extra? with a standard PayPal business account this is : 1.035 . If you're not sure, please fill in 1.035"));
      financeSheet.getRange('B8').setValue(showPrompt('PayPal',"What is the description you'd like to add to the payment? for example event name . The name of the participant is automatically added, no need to type this here."));

    }


    tutorial++;
  }else{
      tutorial++;
  }
  optionSheet.getRange('B44').setValue(tutorial);
}
function tutorial_done(){
  showAlert('tutorial','You are now done with the tutorial, all that you still have to do is click create form! ');
  tutorial =0;
  optionSheet.getRange('B44').setValue(tutorial);
}
function showPrompt(title,message){
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(title,message, ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.YES) {
    return response.getResponseText();
  } else{
    return "";
  }
}


function showAlert(title,message) {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
    title,
    message,
    ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".


    return "yes";
  } else {
    // User clicked "No" or X in the title bar.


    return "no";
  }
}

function turotial_devider(){

  switch (tutorial)  {
    case 0:
      tutorial_event_fields();
      break;
    case 1:
      tutorial_form_questions();
      break;
    case 2:
      tutorial_price_fields();
      break;
    case 3:
      tutorial_script_options();
      break;
    case 4:
      tutorial_finance_options();
      tutorial=0;
      break;
    default:
      tutorial=0
      tutorial_event_fields();
  }

}

//cheks if the date of today is equal to the end date given in the sheet
function checkEndDate(){
  var enddate =optionSheet.getRange('B30').getValue();
  if(enddate !=null){
    enddate =  Utilities.formatDate(new Date(enddate), "Europe/Vienna", "dd-yyyy-MM");
    var today =  Utilities.formatDate(new Date(), "Europe/Vienna", "dd-yyyy-MM");

    if(today ==enddate || today >enddate){

      closeForm();
      removeTriggers();
      makeTriggers();
    }
  }

}


function countParticipants(){
  var dataRange = registerSheet.getRange(2, script_form_fields_amount+2, registerSheet.getLastRow() -1, script_form_fields_amount + 2); // let it read more columns than are being used, it might mess up otherwise
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var counter = 0;
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];




    if(row[0]=="yes"){
      counter++;
    }

    // Make sure the cell is updated right away in case the script is interrupted
    SpreadsheetApp.flush();
  }
  return counter;
}


//update all sheet variables in case of changes while using the sheet
function updateVariables(){
  // event variables
  event_title = optionSheet.getRange('B3').getValue();
  event_description = optionSheet.getRange('B4').getValue();
  event_start_date = optionSheet.getRange('B5').getValue();
  event_start_time = optionSheet.getRange('B6').getValue();
  event_end_date = optionSheet.getRange('B7').getValue();
  event_end_time = optionSheet.getRange('B8').getValue();
  event_meetingpoint = optionSheet.getRange('B9').getValue();
  event_max_participants = optionSheet.getRange('B10').getValue();
  event_isPaid = optionSheet.getRange('B11').getValue();

  //script questions
  script_auto_confirm_mails = optionSheet.getRange('B19').getValue();
  script_confirm_mail_name = optionSheet.getRange('B20').getValue();
  script_auto_registration_mails = optionSheet.getRange('B21').getValue();
  script_registration_mail_name = optionSheet.getRange('B22').getValue();
  script_register_on_pay = optionSheet.getRange('B23').getValue();
  script_extra_mail_name = optionSheet.getRange('B24').getValue();
  script_extra_mail_on_pay = optionSheet.getRange('B25').getValue();
  script_sticky_names = optionSheet.getRange('B26').getValue();
  script_close_form_max_part = optionSheet.getRange('B27').getValue();
  script_color_on_paid = optionSheet.getRange('B28').getValue();
  script_form_fields_amount = optionSheet.getRange('B29').getValue();
  script_registration_close_date = optionSheet.getRange('B30').getValue();
  script_paid_row_added = optionSheet.getRange('B15').getValue();
  script_form_made = optionSheet.getRange('B16').getValue();
  // price variables
  amount_total_part = optionSheet.getRange('F17').getValue();
  price_total_money = optionSheet.getRange('F18').getValue();
  price_total_amount_prices = optionSheet.getRange('F19').getValue();
  prices = getAllPrices();


  // finance variables
  //PayPal
  finance_paypal_allowed = financeSheet.getRange('B5').getValue();
  finance_paypal_email = financeSheet.getRange('B6').getValue();
  finance_paypal_percentage = financeSheet.getRange('B7').getValue();
  finance_paypal_description = financeSheet.getRange('B8').getValue();

  //bank transfer
  finance_bank_allowed = financeSheet.getRange('B12').getValue();
  finance_bank_owner = financeSheet.getRange('B13').getValue();
  finance_bank_name = financeSheet.getRange('B14').getValue();
  finance_bank_IBAN = financeSheet.getRange('B15').getValue();
  finance_bank_BIC = financeSheet.getRange('B16').getValue();
  finance_bank_description = financeSheet.getRange('B17').getValue();

  //cash
  finance_cash_allowed = financeSheet.getRange('B21').getValue();
  finance_cash_office = financeSheet.getRange('B22').getValue();
  finance_cash_days = financeSheet.getRange('B22').getValue();
  finance_cash_hours = financeSheet.getRange('B23').getValue();


  removeTriggers();
  makeTriggers();
}

function addToPrintList(row){
  printSheet.appendRow([getByName("First name",row-1), getByName("Surname", row -1), getByName("ESNSection",row -1)]);
};
function makePrintList(){
  printSheet.clearContents();


  printSheet.appendRow(["First name", "Surname", "ESNSection", "Phone nr"]);
  printSheet.setFrozenRows(1);


  optionSheet.getRange("B14").setValue("yes");

}

function refreshPrintList(){

  printSheet.clearContents();







  var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() -1, script_form_fields_amount  + 6); // let it read more columns than are being used, it might mess up otherwise
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  printSheet.appendRow(["First name", "Surname", "ESNSection"]);
  printSheet.setFrozenRows(1);
  for (var i = 0; i < data.length; ++i) {

    var row = data[i];


    if(getByName("Paid",i+1)=="yes"){

      printSheet.appendRow([getByName("First name",i+1), getByName("Surname", i +1), getByName("ESNSection",i+1)]);

    }

  }


}
function removeFromPrintList(rowId){
  var firstName = getByName("First name",rowId-1);
  var lastName = getByName("Surname", rowId -1);

  var destData = printSheet.getRange(1, 1, printSheet.getLastRow(),5);
  var data = destData.getValues();

  // Find coordinates of the row where value of cell A40 matches a cell in A:A in second spreadsheet
  for (var rowIndex=0; rowIndex < event_max_participants+5; rowIndex++) {
    var row2= data[rowIndex];
    if (firstName == row2[0] && lastName == row2[1]) {
      // Found our match
      printSheet.deleteRow(rowIndex +1);
      break; // Done, exit loop
    }
  }
}

function editFormItem() {
  var form = FormApp.openById(optionSheet.getRange('B37').getValue())
  var allItems = form.getItems();





  var questions = getAllQuestions();



  for (var i = 0; i < questions.length; ++i) {



    var row = questions[i];
    row[1] = row[1].toLowerCase();
    var required;

    var item = checkInArrayFormQuestions(allItems,row[0]);



    if (row[3] == "TRUE" || row[3] == "true" || row[3] == true ){
      required = true;

    }else{
      required = false;
    }


    if(row[1] == "text"){
      makeTextItem(form,row[0],row[4],required,item);
    }
    if(row[1] == "email"){
      makeEmailItem(form,row[0],row[4],required,item);
    }
    if(row[1] == "dropdown"){
      makeDropdownItem(form,row[0],row[4],row[2].split(','),required,item);
    }
    if(row[1] == "checkbox"){
      makeCheckBoxItem(form,row[0],row[4],row[2].split(','),required,item);
    }
    if(row[1] == "radiobutton"){
      makeRadioButtonItem(form,row[0],row[4],row[2].split(','),required,item);
    }
    if(row[1] == "date"){
      makeDateItem(form,row[0],row[4],required,item);
    }
    if(row[1] == "time"){
      makeTimeItem(form,row[0],row[4],required,item);
    }
    if(row[1] == "datetime"){
      makeDateTimeItem(form,row[0],row[4],required,item);
    }
    if(row[1] == "duration"){
      makeDurationItem(form,row[0],row[4],required,item);
    }





  }


  for(var i = 0;i<allItems.length;i++){


    var result = checkArrayQuestion(questions,allItems[i].getTitle());


    if(result == false){
      var columnId = getColumnId(allItems[i].getTitle());

      form.deleteItem(allItems[i]);


      SpreadsheetApp.flush();

      registerSheet.deleteColumn(columnId);


    }
  }


}


function checkInArrayFormQuestions(array, term){
  var result;
  for( var i = 0, len = array.length; i < len; i++ ) {
    if( array[i].getTitle() == term ) {
      result = array[i];
      return result;
      break;
    }
  }

  return null;
}

function checkArrayQuestion(array,question){
  var result=false;
  for( var i = 0, len = array.length; i < len; i++ ) {
    if( array[i][0] == question ) {
      result = true;


    }
  }
  
  return result;
  
}

