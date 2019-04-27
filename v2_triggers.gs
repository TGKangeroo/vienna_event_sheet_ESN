
//Add Triggers --------------------------------------------------------------------------------------------------------------------------------------------------------//
function resetTriggers() {
    removeTriggers();
    ScriptApp.newTrigger('onEdit')
        .forSpreadsheet(ss)
        .onEdit()
        .create();
    ScriptApp.newTrigger('onSubmit')
        .forSpreadsheet(ss)
        .onFormSubmit()
        .create();
    var enddate = Utilities.formatDate(new Date(options["CLOSING_DATE"]), "Europe/Vienna", "dd-yyyy-MM");
    var today = Utilities.formatDate(new Date(), "Europe/Vienna", "dd-yyyy-MM");
    if (today != enddate && today < enddate) {
        ScriptApp.newTrigger("checkEndDate")
            .timeBased()
            .atHour(12)
            .everyDays(1) // Frequency is required if you are using atHour() or nearMinute()
            .create();
    }
}
//Remove Triggers --------------------------------------------------------------------------------------------------------------------------------------------------------//
function removeTriggers() {
    var allTriggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < allTriggers.length; i++) {
        ScriptApp.deleteTrigger(allTriggers[i]);
    }
}
//on Sheet Edit Trigger --------------------------------------------------------------------------------------------------------------------------------------------------------//
function onEdit(e) {
    var paid = getColumnId("Paid");
    var lastEdited = getColumnId("last Edited");
    var range = e.range
    var row = range.getRow(); // row used for inserting into the google sheet
    var row_script = row - 1 // counting started from 1 instead of from 0 dirty fix to make it look like an array usable for every function in this sheet.
    var editedSheet = e.source.getActiveSheet();
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    var event_max_participants = options["MAX_PARTICIPANTS"];
    var amount_total_part = updateTotalParticipants();
    //check if the changed value is on the paid row and if it's changed to yes
    if (range.getColumn() == script_form_fields_amount + 2 && 
        e.value == "yes" && editedSheet.getName() == registerSheet.getName()) {
        if (uamount_total_part > event_max_participants) {
            answer = showAlert('Warning max participants reached', "If you accept this person you're over your max amount of participants!");
            //e.value = "denied";
            registerSheet.getRange(row, paid).setValue('no');
            return;
        }
    }
    var lastCol = registerSheet.getLastColumn();

    if (range.getColumn() == paid && paid != -1) {
        switch (e.value) {
            case "yes":
                if (amount_total_part == event_max_participants) {
                    showAlert('Warning, last participant!', 'This is the last person you can accept before you reach the max amount of participants');
                }
                registerSheet.getRange(row, 1, 1, lastCol).setBackground("MediumSeaGreen");
                if (options["AUTO_CONF_MAIL"] == true) {
                    sendconfirmationEmail(row_script);
                }
                //addToPrintList(row_script)
                break;
            case "no":
                registerSheet.getRange(row, 1, 1, lastCol).setBackground("white");
                //removeFromPrintList(row_script)
                break;
            case "cancelled":
                registerSheet.getRange(row, 1, 1, lastCol).setBackground("red");
                //removeFromPrintList(row_script)
                break;
            case "refunded":
                registerSheet.getRange(row, 1, 1, lastCol).setBackground("lightBlue");
                //removeFromPrintList(row_script)
                break;
        }
        registerSheet.getRange(row, lastEdited).setValue(new Date());
    }
    if (amount_total_part == event_max_participants && 
        event_max_participants != "0" && 
        optinos["CLOSE_WHEN_FULL"] == true) {
        closeForm();
    }
    if (editedSheet.getName() == 'Registrations') {
        totalPriceToBePaid(row_script);
    }
    updatePrices();
}

//on Form Submit Trigger --------------------------------------------------------------------------------------------------------------------------------------------------------//
function onSubmit(e) {
    if( indexOfPaid == -1) {
        makePayAndEditedRow();
    }
    Logger.log("index of paid: "+ indexOfPaid);
    var paidRange = registerSheet.getRange(2, indexOfPaid, registerSheet.getMaxRows(), indexOfPaid);  

    var range = e.range;
    var row = range.getRow(); // row used for inserting into the google sheet

    var row_script = row - 1 // counting started from 1 instead of from 0 dirty fix to make it look like an array usable for every function in this sheet.
    
    var cell = paidRange.getCell(row_script, 1);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(['yes', 'no', 'cancelled', 'refunded'], false).build();
    cell.setDataValidation(rule);

    var event_max_participants = options["MAX_PARTICIPANTS"];
    var amount_total_part = 0;
    amount_total_part = countParticipants();
    if (options["PAID_EVENT"] == true) {
        if (cell.getValue() != "cancelled" && cell.getValue() != "refunded") {
            cell.setValue('no');
            SpreadsheetApp.flush();
        }
        if (options["AUTO_REG_MAIL"] == true) {
            sendRegisterEmail(row_script);
        }
    } else {
        cell.setValue('yes');
        //setFieldValue('event_max_participants',countParticipants()); 
        if (options["AUTO_CONF_MAIL"] == true) {
            sendconfirmationEmail(row_script);
        }
        //addToPrintList(row_script)
        if ((amount_total_part == event_max_participants || 
            amount_total_part > event_max_participants) && 
            event_max_participants != "0" && options["CLOSE_WHEN_FULL"] == true) {
            closeForm();
        }
        SpreadsheetApp.flush();
    }
    
    totalPriceToBePaid(row_script);
    SpreadsheetApp.flush();
}

