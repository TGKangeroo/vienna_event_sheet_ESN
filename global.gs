//variables for sheet declaration --------------------------------------------------------------------------------------------------------------------------------------------------------//
var ss = SpreadsheetApp.getActiveSpreadsheet();
var optionSheet = ss.getSheetByName("Options");
var priceSheet = ss.getSheetByName("Prices");
var printSheet = ss.getSheetByName("Print list");
var financeSheet = ss.getSheetByName("Finances");
var budgetSheet = ss.getSheetByName("Budget");
var registerSheet = ss.getSheetByName("Registrations");
//variables for the event price (yellow block in optionsheet) --------------------------------------------------------------------------------------------------------------------------------------------------------//
var prices = getAllPrices();
//returns array of all prices written in the yellow optionsheet block --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getAllPrices() {
    return priceSheet.getRange("A3:E19").getValues();
}
//returns array of all questions written in the pink optionsheet block --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getAllQuestions() {
    var dataRange = optionSheet.getRange(4, 10, 35, 5);
    var data = dataRange.getValues();
    return data;
}
//adds the price a participant has to pay to the registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function totalPriceToBePaid(row) {
    var price = calculatePrice(row)
    registerSheet.getRange(row + 1, indexOfTotal ).setValue(price); 
}
//Add last edited and paid columns to registration sheet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function makePayAndEditedRow() {
    var idxLast = registerSheet.getLastColumn()
    
    registerSheet.getRange(1, idxLast + 1).setValue('Paid');
    registerSheet.getRange(1, idxLast + 2).setValue('last Edited');
    registerSheet.getRange(1, idxLast + 3).setValue('to be paid');
    registerSheet.getRange(1, idxLast + 4).setValue('Script');

    SpreadsheetApp.flush();

    indexOfPaid = indexOfHeader("Paid");
    indexOfTotal = ndexOfHeader("to be paid");
    indexOfScript = indexOfHeader("Script");
}
//retrieves the number of a column based on the column name --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getColumnId(colName) {
    var data = registerSheet.getDataRange().getValues();
    var col = data[0].indexOf(colName);
    if (col != -1) {
        return col + 1;
    } else {
        return -1;
    }
}
//searches a registration value based on column name and row --------------------------------------------------------------------------------------------------------------------------------------------------------//
function getByName(colName, row) {
    var data = registerSheet.getDataRange().getValues();
    return getByNameData(data, colName, row);
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
    var header = registerSheet.getDataRange().getValues()[0];
    // Fetch values for each row in the Range.
    var paid = getColumnId("Paid")-1; //array idx

    for (var i = 0; i < registrations.length; ++i) {
        if (registrations[i][paid] == "yes") {
            for (var y = 0; y < prices.length; y++) {
                var index = header.indexOf(prices[y][idxField]);
                if (registrations[i][index] == prices[y][idxValue]) {
                    prices[y][idxAmount] = prices[y][idxAmount] + 1;
                }
            }
        }
    }
    dataRange = priceSheet.getRange("A3:E19");
    data = dataRange.getValues();
    for (i = 0; i < data.length; i++) {
        if (prices[i] != null) {
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
        if (!(isNaN(prices[i][1]))) {
            if (prices[i][3] == "Base Price") {
                pay = pay + prices[i][1];
            } else {
                if (getByName(prices[i][3], row) == prices[i][4]) {
                    pay = pay + prices[i][1];
                }
            }
        }
    }
    return pay;
}
function testCalculatePrice() {
    Logger.log(calculatePrice(3));
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
    var dataRange = registerSheet.getRange(2, indexOfPaid, registerSheet.getLastRow() - 1, indexOfPaid); // let it read more columns than are being used, it might mess up otherwise
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
    Logger.log(title + msg );
    SpreadsheetApp.getUi().alert(title,msg,"yes");
}

//index of the column named Paid
function indexOfHeader(header) {
    var headers = registerSheet.getRange("A1:AA1").getValues()[0];
    for(var i = 0 ; i < headers.length ; i++) {
        if(headers[i] == header) return i+1; //correct index for getRange
    }
    return -1;
}

var indexOfPaid = indexOfHeader("Paid");
var indexOfTotal = indexOfHeader("to be paid");
var indexOfScript = indexOfHeader("Script");

var drafts = GmailApp.getDraftMessages();