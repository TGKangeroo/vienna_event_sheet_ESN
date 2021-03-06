//DSGVO variables --------------------------------------------------------------------------------------------------------------------------------------------------------//
var dsgvo_link="";


//Adds DSGVO form question to every form --------------------------------------------------------------------------------------------------------------------------------------------------------//
function dsgvo(form){

  var dsgvo_choices="I hereby agree that my data will be processed by " + section_name  + " and its members during the process of this event";
//var choices="I hereby agree that my data will be processed by ESN Vienna and its members in accordance with <a href='" +  dsgvo_link + "'>the data protection rules of ESN Austria</a>";
 var dsgvo_description="We will use this data only for this event and will only pass the data in context of this event if it's absolutly necessary (e.g. to a Hostel). The data will not be used or passed to a third party outside of the context of this event.";
makeRadioButtonItem(form,"Data processing",dsgvo_description,dsgvo_choices.split(','),true )
var script_form_fields_amount = getFieldValue('script_form_fields_amount');
      optionSheet.getRange( script_form_fields_amount+4,10).setValue("Data processing");
      optionSheet.getRange(script_form_fields_amount+4,11).setValue('radiobutton');
      optionSheet.getRange(script_form_fields_amount+4,13).setValue('TRUE');
      optionSheet.getRange(script_form_fields_amount+4,12).setValue(dsgvo_choices);
      optionSheet.getRange(script_form_fields_amount+4,14).setValue(dsgvo_description);
}

