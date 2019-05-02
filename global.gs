//variables for sheet declaration --------------------------------------------------------------------------------------------------------------------------------------------------------//
var ss = SpreadsheetApp.getActiveSpreadsheet();
var optionSheet = ss.getSheetByName("Options");
var priceSheet = ss.getSheetByName("Prices");
var printSheet = ss.getSheetByName("Print list");
var budgetSheet = ss.getSheetByName("Budget");
var registerSheet = ss.getSheetByName("Registrations");

var registerHeaders = []
if(registerSheet != null) {
    registerHeaders = registerSheet.getDataRange().getValues()[0];
}

var drafts = GmailApp.getDraftMessages();
var prices = getAllPrices();

//returns array of all prices written in the yellow optionsheet block --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getAllPrices() {
    return priceSheet.getRange("A3:E19").getValues();
}
//adds the price a participant has to pay to the registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function totalPriceToBePaid(row) {
    var price = calculatePrice(row);
    row.getCell(1, indexOfTotal).setValue(price); 
}
//Add last edited and paid columns to registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makePayAndEditedRow() {
    var idxLast = registerSheet.getLastColumn()
    
    registerSheet.getRange(1, idxLast + 1).setValue('Paid');
    registerSheet.getRange(1, idxLast + 2).setValue('last Edited');
    registerSheet.getRange(1, idxLast + 3).setValue('to be paid');
    registerSheet.getRange(1, idxLast + 4).setValue('Script');

    SpreadsheetApp.flush();
    registerHeaders = registerSheet.getDataRange().getValues()[0];

    indexOfPaid = getColumnId("Paid");
    indexOfTotal = getColumnId("to be paid");
    indexOfScript = getColumnId("Script");
}
//retrieves the number of a column based on the column name --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getColumnId(colName) {
    var col = registerHeaders.indexOf(colName);
    if (col != -1) {
        return col + 1;
    } else {
        return -1;
    }
}

var indexOfPaid = getColumnId("Paid");
var indexOfTotal = getColumnId("to be paid");
var indexOfScript = getColumnId("Script");



//searches a registration value based on column name and row --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getByNameRow(colName,row) {
    var colId = getColumnId(colName);
    if(colId < 0) {
        Logger.log("could not find colId for "+ colName);
        return "not found:"+colName;
    }
    return row.getCell(1, colId).getValues()[0];
}
function getByName(colName, rowId) {
    var data = registerSheet.getDataRange().getValues();
    return getByNameData(data, colName, rowId);
}
function getByNameData(data, colName, row) {
    var col = data[0].indexOf(colName);
    if (col != -1) {
        if (data[row] != null) {
            if (data[row][col] != null) {
                return data[row][col];
            } else {
                return "";
            }
        }
    }
}
//updates the amount field 30B --------------------------------------------------------------------------------------------------------------------------------------------------------//
function updatePrices() {
    var idxAmount = 2;
    var idxField = 3;
    var idxValue = 4;
    var prices = getAllPrices();
    for (var i = 0; i < prices.length; i++) {
        prices[i][idxAmount] = 0;
    }
    var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() - 1, registerSheet.getLastColumn()); // let it read more columns than are being used, it might mess up otherwise
    var registrations = dataRange.getValues();
    // Fetch values for each row in the Range.
    var paid = getColumnId("Paid")-1; //array idx

    for (var i = 0; i < registrations.length; ++i) {
        if (registrations[i][paid] == "yes") {
            for (var y = 0; y < prices.length; y++) {
                var index = registerHeaders.indexOf(prices[y][idxField]);
                if (registrations[i][index] == prices[y][idxValue]) {
                    prices[y][idxAmount] = prices[y][idxAmount] + 1;
                }
            }
        }
    }
    dataRange = priceSheet.getRange("A3:E19");
    data = dataRange.getValues();
    for (i = 0; i < data.length; i++) {
        if (prices[i] != null && prices[i][idxValue] != '') {
            priceSheet.getRange(i + 3, idxAmount+1).setValue(prices[i][idxAmount]);
            SpreadsheetApp.flush();
        }
    }
}
//Calculate the price per participant --------------------------------------------------------------------------------------------------------------------------------------------------------//
function calculatePrice(row) {
    var prices = getAllPrices();
    var pay = 0;
    for (var i = 0; i < prices.length; i++) {
        if (!(isNaN(prices[i][1])) && prices[i][1] != "") {
            if (prices[i][3] == "Base Price") {
                pay = pay + prices[i][1];
            } else {
                if (getByNameRow(prices[i][3], row) == prices[i][4]) {
                    pay = pay + prices[i][1];
                }
            }
        }
    }
    return pay;
}

//check if the registration end date equals to todays date --------------------------------------------------------------------------------------------------------------------------------------------------------//
function checkEndDate() {
    var enddate = getFieldValue('script_registration_close_date');
    if (enddate != null) {
        enddate = Utilities.formatDate(new Date(enddate), "Europe/Vienna", "dd-yyyy-MM");
        var today = Utilities.formatDate(new Date(), "Europe/Vienna", "dd-yyyy-MM");
        if (today == enddate || today > enddate) {
            closeForm();
            removeTriggers();
            makeTriggers();
        }
    }
}
//Count the amount of paid participants --------------------------------------------------------------------------------------------------------------------------------------------------------//
function countParticipants() {
    var dataRange = registerSheet.getRange(2, indexOfPaid, registerSheet.getLastRow(), indexOfPaid); // let it read more columns than are being used, it might mess up otherwise
    // Fetch values for each row in the Range.
    var data = dataRange.getValues();
    var counter = 0;
    for (var i = 0; i < data.length; ++i) {
        var row = data[i];
        if (row[0] == "yes") {
            counter++;
        }
        // Make sure the cell is updated right away in case the script is interrupted
        SpreadsheetApp.flush();
    }
    return counter;
}
function updateTotalParticipants() {
    var participants = countParticipants();
    priceSheet.getRange("C20").setValue(participants);
    return participants;
}

//test function for development --------------------------------------------------------------------------------------------------------------------------------------------------------//
function showAlert(title,msg) {
    var htmlOutput = HtmlService
        .createHtmlOutput(msg)
        .setWidth(250)
        .setHeight(300);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, title);

    Logger.log(title + msg );
    //var ui = SpreadsheetApp.getUi();
    //ui.alert(title, msg, ui.ButtonSet.OK);
}

