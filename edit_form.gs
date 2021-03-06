//Update form questions --------------------------------------------------------------------------------------------------------------------------------------------------------//
function editFormItem() {
  var form = FormApp.openById(getFieldValue('form_edit_link'));
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


//Check array of form questions --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//check array of questions optionSheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function checkArrayQuestion(array,question){
  var result=false;
  for( var i = 0, len = array.length; i < len; i++ ) {
    if( array[i][0] == question ) {
      result = true;


    }
  }
  
  return result;
  
}
