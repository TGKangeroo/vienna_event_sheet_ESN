


//Payment variables --------------------------------------------------------------------------------------------------------------------------------------------------------//
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






//Generates the PayPal payment url [paypal_link] --------------------------------------------------------------------------------------------------------------------------------------------------------//
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


//Generates the bank transfer details [bank_transfer] --------------------------------------------------------------------------------------------------------------------------------------------------------//
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

//Generates the cash payment details [office] --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeCashDetails(){


  details = " Office address : <br>" + finance_cash_office + "<br> Opening hours : <br>" + finance_cash_days + "between " + finance_cash_hours ;

  return details;

}






