//tutorial variables --------------------------------------------------------------------------------------------------------------------------------------------------------//
var tutorial = getFieldValue('tutorial'); 

//tutorial step 1: Event fields --------------------------------------------------------------------------------------------------------------------------------------------------------// 
function tutorial_event_fields(){
SpreadsheetApp.setActiveSheet(optionSheet);
 var range = optionSheet.getRange("B3:B11");

range.setBackground('Red');
  var answer1 = showAlert("Step 1","The first step is filling in the basic information of the event, we've marked all the fields that are still empty red. Once you're done click on tutorial again!");

  if (answer1 == "yes"){
    if(showAlert("Extra information step 1", "To get you going the first thing we need to know is do participants have to pay for your event? ")=="yes"){

     setFieldValue('event_isPaid','yes'); 
    }
    tutorial++;
  }else{
    if(showAlert("alert", "You have to click yes to go to the next step!")=="yes")
      tutorial++;
  }


  setFieldValue('tutorial',tutorial);

}

//tutorial step 2: Form questions --------------------------------------------------------------------------------------------------------------------------------------------------------//
function tutorial_form_questions(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("J1:M36");
var script_form_fields_amount = getFieldValue('script_form_fields_amount');
SpreadsheetApp.setActiveRange(range);
  var answer1 = showAlert("Step 2","Let's take a look at the questions you'd like to have in your form.");
  if (answer1 == "yes"){
    tutorial++;
    if(showAlert("Would you like us to prepare the basic questions for you like name, email,... that you need to make it all work?") == "yes"){
      optionSheet.getRange('J4:M36').clearContent();
     optionSheet.getRange('J4').setValue("First name");
    optionSheet.getRange('J5').setValue("Surname");
    optionSheet.getRange('J6').setValue("Email");
    optionSheet.getRange('K4').setValue("text");
    optionSheet.getRange('K5').setValue("text");
    optionSheet.getRange('K6').setValue("email"); 
    optionSheet.getRange('M4').setValue("TRUE");
    optionSheet.getRange('M5').setValue("TRUE");
    optionSheet.getRange('M6').setValue("TRUE");
    SpreadsheetApp.flush();
    }
    var answer2 = showAlert("ESNcard","Is there a difference in payment for ESNcard and no ESNcard?");
    if(answer2 =="yes"){
      script_form_fields_amount = getFieldValue('script_form_fields_amount');
      optionSheet.getRange( script_form_fields_amount+4,10).setValue("ESNcard");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');
      optionSheet.getRange(script_form_fields_amount+4,12).setValue('yes,no');
    }
    SpreadsheetApp.flush();
    var answer3= showAlert("payment types","Are there multiple ways to pay?");

    if(answer3 =="yes"){
      script_form_fields_amount = getFieldValue('script_form_fields_amount');
      optionSheet.getRange( script_form_fields_amount+4,10).setValue("Payment method");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');

      var answer4=showPrompt("options","Which ways to pay are there? Please write them down like this : 'office,PayPal,Banktransfer'. So divided by a comma.");
      optionSheet.getRange(script_form_fields_amount+4,12).setValue(answer4);
    }
    SpreadsheetApp.flush();
    var answer6 = answer6 = showAlert("Step 2","Are there any other questions you'd like to add?");
    script_form_fields_amount = getFieldValue('script_form_fields_amount');
    if(answer6 =="yes"){
     var answer6 = answer6 = showAlert("Step 2","You have to do this in the pink area, Use the questions above as an example!");

      }
     
      SpreadsheetApp.flush();
      answer6 = showAlert("Step 2","Once you're done adding questions, click the tutorial button again to continue!");
    

  }else{
    
      tutorial++;
  }

   setFieldValue('tutorial',tutorial);
}

//tutorial step 3: Prices --------------------------------------------------------------------------------------------------------------------------------------------------------//
function tutorial_price_fields(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("D1:H20");

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

   setFieldValue('tutorial',tutorial);
}

//tutorial step 4: Script options --------------------------------------------------------------------------------------------------------------------------------------------------------//
function tutorial_script_options(){
  SpreadsheetApp.setActiveSheet(optionSheet);
  var range = optionSheet.getRange("A18:B31");

SpreadsheetApp.setActiveRange(range);
  var answer1 = showAlert("Step 4","Now it's time for the scripting options, we'll go over each one so you know what to do.");

  if (answer1 == "yes"){
    var answer2= showAlert("Automatic emails", "Would you like to send an automatic email once someone has paid? Or if it's a free event, once they've registered");
    if(answer2== "yes"){
       setFieldValue('script_auto_confirm_mails','yes');
      setFieldValue('script_confirm_mail_name',showPrompt("Automatic email","For the sheet to know which email to send, you have to make an Email in your inbox and save it as a draft. We can't do this for you, but I'm sure you can work with your own inbox! This email has to be saved on the same account as the one that will use this sheet.Please fill in the subject of the email you just made or will make afterwards"));
 
    }else{
       setFieldValue('script_auto_confirm_mails','no');
    }
    SpreadsheetApp.flush();
    var answer3= showAlert("Automatic emails","Would you like the sheet to send automatic emails once someone has registered? If your event is for free, put no here");
    if(answer3== "yes"){
      setFieldValue('script_auto_registration_mails','yes');
      setFieldValue('script_registration_mail_name',showPrompt("Automatic email","For the sheet to know which email to send, you have to make an Email in your inbox and save it as a draft. We can't do this for you, but I'm sure you can work with your own inbox! This email has to be saved on the same account as the one that will use this sheet.Please fill in the subject of the email you just made or will make afterwards"));
      var answer10 = showAlert("Automatic registration Email","Do you want to send different emails for each payment option? For example a different email for the ones that would like to pay with PayPal.")
      
      setFieldValue('script_register_on_pay',answer10);
      if(answer10 =="yes"){
        showAlert("different payment types","To get the different emails on payment type to work you have to make some small adjustments to the email you just saved in your inbox! You have to make one email per payment option. So for example if you called your email 'registration email' and you have a payment option called Office and PayPal. You now have to make two emails : 'registration email_Office' and 'registration email_PayPal'.");

      }

    }else{
       setFieldValue('script_auto_registration_mails','no');
    }
    SpreadsheetApp.flush();
    var answer4=showAlert("Extra emails","When sending an extra email, for example a survival guide, would you like these emails to only be sent to people that paid?");
    if(answer4 =="yes"){
      
      setFieldValue('script_extra_mail_name',showPrompt("Extra email","The same counts for the extra email as for the previous two emails! but you can always do this later right before you send the email. But if you already have it ready, please fill in the subject name here."));
      setFieldValue('script_extra_mail_on_pay','yes');
    
    }
setFieldValue('script_sticky_names',showAlert("Sticky names","Would you like the names of the people that registered to be stuck to the side of the screen when scrolling through? I would advice to say no here, it's bad if you'd like to check the sheet on your mobile."));
 setFieldValue('script_close_form_max_part',showAlert("Closing the form","Would you like the registrations to be closed when reaching the max amount of participants?"));
 setFieldValue('script_color_on_paid',showAlert("Coloring people","When someone paid, would you like them to turn green like the Hulk?"));
   
    SpreadsheetApp.flush();
    tutorial++;
  }else{
    
      tutorial++;
  }
   setFieldValue('tutorial',tutorial);
}

//tutorial step 5: Financial options --------------------------------------------------------------------------------------------------------------------------------------------------------//
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
      financeSheet.getRange('B7').setValue(showPrompt('PayPal',"What is the percentage people with paypal have to pay extra? with a standard PayPal business account this is : 1.014 . If you're not sure, please fill in 1.035"));
      financeSheet.getRange('B8').setValue(showPrompt('PayPal',"What is the description you'd like to add to the payment? for example event name . The name of the participant is automatically added, no need to type this here."));

    }


    tutorial++;
  }else{
      tutorial++;
  }
   setFieldValue('tutorial',tutorial);
}

//tutorial step 6: Finished --------------------------------------------------------------------------------------------------------------------------------------------------------//
function tutorial_done(){
  showAlert('tutorial','You are now done with the tutorial, all that you still have to do is click create form! ');
  tutorial =0;
 setFieldValue('tutorial',tutorial);
}

//make message with text input --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//Make message with Yes/No, no input --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//tutorial switch --------------------------------------------------------------------------------------------------------------------------------------------------------//
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
