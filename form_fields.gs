//Make form question with email input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeEmailItem(form,title,Description,required,item){
      if(item == null){
    item = form.addTextItem();
    item.setRequired(required);
  }
  item.setTitle(title)
  .setHelpText(Description);
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .build();
  item.setValidation(emailValidation)
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .build();
  item.setValidation(emailValidation)
}

//Make form question with text input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeTextItem(form,title,Description,required,item){
  if(item == null){
    item = form.addTextItem();
    item.setRequired(required);
  }
  item.setTitle(title)
  .setHelpText(Description);

}
//Make form question with dropdown field --------------------------------------------------------------------------------------------------------------------------------------------------------//
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


//Make form question with checkbox field --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//Make form question with radio button field --------------------------------------------------------------------------------------------------------------------------------------------------------//
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


//Make form question with date input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeDateItem(form,title,Description,required,item){
  if(item == null){
    var item = form.addDateItem();
    item.setRequired(required);
  }
  item.setTitle(title)
  .setHelpText(Description);

}

//Make form question with date item input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeDateTimeItem(form,title,Description,required,item){



  if(item == null){
    var item = form.addDateTimeItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);

}

//Make form question with time input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeTimeItem(form,title,Description,required,item){

  if(item == null){
    var item = form.addTimeItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);


}

//Make form question with duration input field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeDurationItem(form,title,Description,required,item){
  if(item == null){
    var item = form.addDurationItem();
    item.setRequired(required);

  }
  item.setTitle(title)
  .setHelpText(Description);

}
