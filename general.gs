//variables for sheet declaration --------------------------------------------------------------------------------------------------------------------------------------------------------//

var ss = SpreadsheetApp.getActiveSpreadsheet();

var optionSheet = ss.getSheetByName("Options");

var printSheet=ss.getSheetByName("Print list");
var financeSheet = ss.getSheetByName("Finances");
var budgetSheet = ss.getSheetByName("Budget");



if(ss.getSheets()[0].getName() == 'Registrations'){
var registerSheet = ss.getSheetByName("Registrations");
}



//variables for event information (Blue block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
var section_name= getSection();
//variables for the event price (yellow block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
var prices = getAllPrices();




//section_name selected based on B12 field --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getSection(){
var sect = getFieldValue('event_section');
  switch(sect){
    case 'UW':
      return "ESN Uni Wien";
      break;
    case 'TU' :
      return "ESN Buddynetwork TU Wien";
      break;
    case 'Vienna' :
      return "ESN Vienna";
      break;
    case 'BOKU':
      return "ESN Boku Wien";
      break;
    case 'Technikum':
      return "ESN Technikum Wien";
      break;
    case 'BFI':
      return "ESN BFI Vienna";
      break;
    case 'WKW':
      return "ESN FH WKW Wien";
      break;
  
  
  
  }
}



//returns array of all prices written in the yellow optionsheet block --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getAllPrices(){
  
  var dataRange = optionSheet.getRange(3,4,17,5);
  
  var data = dataRange.getValues();
  
  return data;
  
}

//returns array of all questions written in the pink optionsheet block --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getAllQuestions(){
  var dataRange = optionSheet.getRange(4,10,35,5);
  
  var data = dataRange.getValues();
  
  return data;
  
  
}

//adds the price a participant has to pay to the registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function totalPriceToBePaid(row){
  registerSheet = ss.getSheetByName("Registrations");
  var script_form_fields_amount = getFieldValue('script_form_fields_amount');
  
var price=calculatePrice(row)
registerSheet.getRange(row+1,script_form_fields_amount + 4).setValue(price);
}



//Add last edited and paid columns to registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makePayAndEditedRow(){
  
  var script_form_fields_amount = getFieldValue('script_form_fields_amount');
  var firstcell = registerSheet.getRange(1,script_form_fields_amount +2);
  
  firstcell.setValue('Paid');
  
  var secondcell = registerSheet.getRange(1,script_form_fields_amount +3);
  secondcell.setValue('last Edited');
  
  var thirdcell = registerSheet.getRange(1,script_form_fields_amount +4);
  thirdcell.setValue('to be paid');
  
  setFieldValue('rows_added','yes');
  
  
}




//retrieves the number of a column based on the column name --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getColumnId(colName ) {

  var data = registerSheet.getDataRange().getValues();
  var col = data[0].indexOf(colName);
  if (col != -1) {
    return col +1;
  }else{
    return -1;
  }
}

//searches a registration value based on column name and row --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//updates the amount field 30B --------------------------------------------------------------------------------------------------------------------------------------------------------//
function updatePrices(){
var script_form_fields_amount= getFieldValue('script_form_fields_amount');
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

  dataRange = optionSheet.getRange(3,6,15);
  data = dataRange.getValues();

  for(i = 0 ; i <data.length;i++){

    if(prices[i]!=null){
      optionSheet.getRange(i+3,6).setValue(prices[i][2]);
      SpreadsheetApp.flush();
    }
  }

}


//Calculate the price per participant --------------------------------------------------------------------------------------------------------------------------------------------------------//
function calculatePrice(row){
  
  var prices = getAllPrices();
  var pay = 0;
  for (var i =0;i < prices.length;i++){
    if(!(isNaN(prices[i][1] ))){

    if(prices[i][3] == "Base Price"){
      pay = pay + prices[i][1];
    }else{

      if(getByName(prices[i][3], row) == prices[i][4]){
        pay = pay + prices[i][1];
      }
    }
    }

  }
  

  return pay;

}


//check if the registration end date equals to todays date --------------------------------------------------------------------------------------------------------------------------------------------------------//
function checkEndDate(){
  var enddate = getFieldValue('script_registration_close_date');
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

//Count the amount of paid participants --------------------------------------------------------------------------------------------------------------------------------------------------------//
function countParticipants(){
  var script_form_fields_amount = getFieldValue('script_form_fields_amount');
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






//test function for development --------------------------------------------------------------------------------------------------------------------------------------------------------//
function test_Jens(){

 
  if (1==1){
  var hello = "hello";
  }
  
  showAlert('hi',hello);
  
  
  
}


