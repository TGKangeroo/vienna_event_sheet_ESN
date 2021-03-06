
//Add participant to print list --------------------------------------------------------------------------------------------------------------------------------------------------------//
function addToPrintList(row){
  
  var printSheetRange= printSheet.getRange(1,1,1,printSheet.getLastColumn());
  var printSheetColumns = printSheetRange.getValues();
  
  var printrow=[];
  for(var i=0;i<printSheet.getLastColumn();i++){
  printrow[i]=getByName(printSheetColumns[0][i],row);
  
  }
  
  
  printSheet.appendRow(printrow);
}

//Clear the print list and add a header --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makePrintList(){
cleanList();
  
setFieldValue('printlist_added','yes');
}


function cleanList(){
var start, end;
start = 2;
end = printSheet.getLastRow();//Number of last row with content
      //blank rows after last row with content will not be deleted
  if (end > 1){
printSheet.deleteRows(start, end);
  }
}
//Remake the print list with all participants --------------------------------------------------------------------------------------------------------------------------------------------------------//
function refreshPrintList(){

  cleanList();
var printSheetRange= printSheet.getRange(1,1,1,printSheet.getLastColumn());
  var printSheetColumns = printSheetRange.getValues();
  
  
  for (var y = 1; y < registerSheet.getLastRow() ; ++y) {
  var printrow=[];
   
      for(var i=0;i<printSheet.getLastColumn();i++){
  printrow[i]=getByName(printSheetColumns[0][i],y);
 // printrow[i]='hello';
  }
        
printSheet.appendRow(printrow);
         
  }
 

}

//Remove participant from print list --------------------------------------------------------------------------------------------------------------------------------------------------------//
function removeFromPrintList(rowId){ 
  
  var printSheetRange= printSheet.getRange(1,1,1,printSheet.getLastColumn());
  var printSheetColumns = printSheetRange.getValues();
  
  var firstName = getByName(printSheetColumns[0][0],rowId);
  var lastName = getByName(printSheetColumns[0][1],rowId);

  var destData = printSheet.getRange(1, 1, printSheet.getLastRow(),5);
  var data = destData.getValues();
  
  var event_max_participants = getFieldValue('event_max_participants');

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
