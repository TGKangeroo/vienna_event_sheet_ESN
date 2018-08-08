//Opens the google form for responses --------------------------------------------------------------------------------------------------------------------------------------------------------//
function addCancellationPolicy(form){
 var policy= getFieldValue('cancellation_policy');
  
  switch(policy){
    case 14:
      cancellationPolicy14(form);
      break;
    case 7:
      cancellationPolicy7(form);
      break;
    default:
      break;
      
  }
}


function cancellationPolicy14(form){
  var script_form_fields_amount = getFieldValue('script_form_fields_amount');
  
 var cancellation_choices="I hereby agree to the cancellation policy";
//var choices="I hereby agree that my data will be processed by ESN Vienna and its members in accordance with <a href='" +  dsgvo_link + "'>the data protection rules of ESN Austria</a>";
 var cancellation_description="Cancellation with 100% refund is possible up to 14 days before the beginning of the event. It is allowed to pass a paid spot under the same conditions to another person up to 24h before the start of the event by emailing the organizers.";
makeRadioButtonItem(form,"Cancellation Policy",cancellation_description,cancellation_choices.split(','),true )

      optionSheet.getRange(script_form_fields_amount+4,10).setValue("Cancellation Policy");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');
      optionSheet.getRange(script_form_fields_amount+4,12).setValue(cancellation_choices);
      optionSheet.getRange(script_form_fields_amount+4,14).setValue(cancellation_description);
}

function cancellationPolicy7(form){
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
var cancellation_choices="I hereby agree to the cancellation policy";
//var choices="I hereby agree that my data will be processed by ESN Vienna and its members in accordance with <a href='" +  dsgvo_link + "'>the data protection rules of ESN Austria</a>";
 var cancellation_description="Cancellation with 100% refund is possible up to 7 days before the beginning of the event. It is allowed to pass a paid spot under the same conditions to another person up to 24h before the start of the event by emailing the organizers.";
makeRadioButtonItem(form,"Cancellation Policy",cancellation_description,cancellation_choices.split(','),true )

      optionSheet.getRange( script_form_fields_amount+4,10).setValue("Cancellation Policy");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');
      optionSheet.getRange(script_form_fields_amount+4,12).setValue(cancellation_choices);
      optionSheet.getRange(script_form_fields_amount+4,14).setValue(cancellation_description);

}
