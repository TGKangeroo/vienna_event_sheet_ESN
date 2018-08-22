function fillingInOptionSheet() {
  optionSheet.getRange("B3").setValue('test title');
  optionSheet.getRange("B4").setValue('description event');
  optionSheet.getRange("B5").setValue(new Date());
  optionSheet.getRange("B6").setValue('19:00');
  optionSheet.getRange("B7").setValue(new Date());
  optionSheet.getRange("B8").setValue('21:00');
  optionSheet.getRange("B9").setValue('in my backyard');
  optionSheet.getRange("B10").setValue('50');
  optionSheet.getRange("B11").setValue('yes');
  var today=new Date();
  today.setDate(today.getDate()+1);
  optionSheet.getRange("B31").setValue(today);
  
  
  
  optionSheet.getRange("D3").setValue('dinner');
  optionSheet.getRange("D4").setValue('rafting');
  
 
  optionSheet.getRange("E3").setValue('5');
  optionSheet.getRange("E4").setValue('7');
  
  
  optionSheet.getRange("G3").setValue('dinner');
  optionSheet.getRange("G4").setValue('rafting');
  
  
  optionSheet.getRange("H3").setValue('yes');
  optionSheet.getRange("H4").setValue('yes');
  
  optionSheet.getRange("J4").setValue('First name');
  optionSheet.getRange("J5").setValue('Surname');
  optionSheet.getRange("J6").setValue('Email');
  
  optionSheet.getRange("J7").setValue('dinner');
  optionSheet.getRange("J8").setValue('rafting');
  
  optionSheet.getRange("K4").setValue('text');
  optionSheet.getRange("K5").setValue('text');
  optionSheet.getRange("K6").setValue('email');
  
  optionSheet.getRange("K7").setValue('radiobutton');
  optionSheet.getRange("K8").setValue('radiobutton');
  
  optionSheet.getRange("L4").setValue('');
  optionSheet.getRange("L5").setValue('');
  optionSheet.getRange("L6").setValue('');
  
  optionSheet.getRange("L7").setValue('yes,no');
  optionSheet.getRange("L8").setValue('yes,no');
  
  optionSheet.getRange("M4").setValue('TRUE');
  optionSheet.getRange("M5").setValue('TRUE');
  optionSheet.getRange("M6").setValue('TRUE');
  
  optionSheet.getRange("M7").setValue('TRUE');
  optionSheet.getRange("M8").setValue('TRUE');
  
  
}

function option_wESNcard(){
  
optionSheet.getRange("D5").setValue('price with ESNcard');
optionSheet.getRange("D6").setValue('price without ESNcard');
  
   optionSheet.getRange("E5").setValue('21');
  optionSheet.getRange("E6").setValue('22');
  
optionSheet.getRange("G5").setValue('ESNcard');
optionSheet.getRange("G6").setValue('ESNcard');
  
  optionSheet.getRange("H5").setValue('yes');
  optionSheet.getRange("H6").setValue('no');
  
optionSheet.getRange("J9").setValue('ESNcard');
optionSheet.getRange("K9").setValue('radiobutton');
optionSheet.getRange("L9").setValue('yes,no');
optionSheet.getRange("M9").setValue('TRUE');
}

function option_nESNcard(){

}


function generateForm(){
  makeForm();
  
}

function addTestFormRequestswESNcard(){
  registerSheet.getRange("B2").setValue('Jens');
  registerSheet.getRange("C2").setValue('Bulinckx');
  registerSheet.getRange("D2").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E2").setValue('no');
  registerSheet.getRange("F2").setValue('yes');
  registerSheet.getRange("G2").setValue('yes');
  registerSheet.getRange("H2").setValue('no');
  
  registerSheet.getRange("B3").setValue('Nino');
  registerSheet.getRange("C3").setValue('Bulinckx');
  registerSheet.getRange("D3").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E3").setValue('no');
  registerSheet.getRange("F3").setValue('no');
  registerSheet.getRange("G3").setValue('no');
  registerSheet.getRange("H3").setValue('no');
  
  registerSheet.getRange("B4").setValue('Franz');
  registerSheet.getRange("C4").setValue('fransen');
  registerSheet.getRange("D4").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E4").setValue('yes');
  registerSheet.getRange("F4").setValue('no');
  registerSheet.getRange("G4").setValue('no');
  registerSheet.getRange("H4").setValue('no');
  
  registerSheet.getRange("B5").setValue('Hanna');
  registerSheet.getRange("C5").setValue('Fuchs');
  registerSheet.getRange("D5").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E5").setValue('no');
  registerSheet.getRange("F5").setValue('yes');
  registerSheet.getRange("G5").setValue('yes');
  registerSheet.getRange("H5").setValue('no');
}

function addTestFormRequestsnESNcard(){
  registerSheet.getRange("B2").setValue('Jens');
  registerSheet.getRange("C2").setValue('Bulinckx');
  registerSheet.getRange("D2").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E2").setValue('no');
  registerSheet.getRange("F2").setValue('yes');
  registerSheet.getRange("G2").setValue('no');
 
  
  registerSheet.getRange("B3").setValue('Nino');
  registerSheet.getRange("C3").setValue('Bulinckx');
  registerSheet.getRange("D3").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E3").setValue('no');
  registerSheet.getRange("F3").setValue('no');
  registerSheet.getRange("G3").setValue('no');

  
  registerSheet.getRange("B4").setValue('Franz');
  registerSheet.getRange("C4").setValue('fransen');
  registerSheet.getRange("D4").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E4").setValue('yes');
  registerSheet.getRange("F4").setValue('no');
  registerSheet.getRange("G4").setValue('no');
  
  
  registerSheet.getRange("B5").setValue('Hanna');
  registerSheet.getRange("C5").setValue('Fuchs');
  registerSheet.getRange("D5").setValue('jens.bulinckx@esnuniwien.com');
  registerSheet.getRange("E5").setValue('yes');
  registerSheet.getRange("F5").setValue('yes');
  registerSheet.getRange("G5").setValue('yes');
  
}


function test_sendregisterMail(){
 optionSheet.getRange("B22").setValue('yes');
  optionSheet.getRange("B23").setValue('test_register');
  optionSheet.getRange("B24").setValue('no');
  
  sendRegisterEmail(1);
  sendRegisterEmail(3);
}

function test_sendconfirmMail(){

 optionSheet.getRange("B20").setValue('yes');
  optionSheet.getRange("B21").setValue('test_confirm');
  
  sendconfirmationEmail(1);
  sendconfirmationEmail(3);
}

function test_extraMail_onPaid(){
optionSheet.getRange("B25").setValue('test_extra');
optionSheet.getRange("B26").setValue('yes');
  
  sendExtraEmail();
}

function test_extraMail(){
optionSheet.getRange("B25").setValue('test_extra');
  optionSheet.getRange("B26").setValue('no');
  
  sendExtraEmail();
}

