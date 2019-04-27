//Static variables --------------------------------------------------------------------------------------------------------------------------------------------------------//
var CONFIRM_MAIL = "confirm sent";
var REGISTER_MAIL = "register sent";
var EXTRA_MAIL = "extra sent";
function sendEmail(row, type) {
    var script_confirm_mail_name = getFieldValue('script_confirm_mail_name');
    var script_registration_mail_name = getFieldValue('script_registration_mail_name');
    var data = registerSheet.getRange(row, script_form_fields_amount + 6, 1, 1).getValues();
    var emailSent = data[0];
    var Email = getByName("Email", row - 1);
    if (Email != '') {
        switch (type) {
            case 'confirmation':
                if (script_confirm_mail_name != "" && emailSent != CONFIRM_MAIL && getByName("Paid", row - 1) == "yes") {
                    if (sendGmailTemplate(Email, row, type))
                        registerSheet.getRange(row, script_form_fields_amount + 6).setValue(CONFIRM_MAIL);
                }
                break;
            case 'registration':
                if (script_registration_mail_name != "" && emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL) {
                    if (sendGmailTemplate(Email, row, type))
                        registerSheet.getRange(row, script_form_fields_amount + 6).setValue(REGISTER_MAIL);
                }
                break;
        }
    }
    // Make sure the cell is updated right away in case the script is interrupted
    SpreadsheetApp.flush();
}
//sends confirmation email to the participant in row --------------------------------------------------------------------------------------------------------------------------------------------------------//
function sendconfirmationEmail(row) {
    if (options["AUTO_CONF_MAIL"]) {
        var scriptRange = row.getCell(1, indexOfScript);
        var emailSent = scriptRange.getValues()[0]; 
        var email = getByNameRow("Email", row);
        if (emailSent != CONFIRM_MAIL && email != "" && getByNameRow("Paid", row) == "yes") {  // Prevents sending duplicates
            var subject = "Confirmation " + options["EVENT_TITLE"];
            //if the user has a whole confirm draft
            if (sendGmailConfirmTemplate(email, subject, row)) {
                scriptRange.setValue(CONFIRM_MAIL);
            }
            // Make sure the cell is updated right away in case the script is interrupted
            SpreadsheetApp.flush();
        }
    }
}
//sends a registration email to the participant in row --------------------------------------------------------------------------------------------------------------------------------------------------------//
function sendRegisterEmail(row) {
    var script_registration_mail_name = options["REG_MAIL_NAME"];
    if (options["AUTO_REG_MAIL"] == true) {
        //var scriptRange = registerSheet.getRange(row + 1, indexOfScript, 1, 1);
        var scriptRange = row.getCell(1, indexOfScript);
        var email = getByNameRow("Email", row);
        var emailSent = scriptRange.getValues()[0];     // column where we can check if the user already got an email
        Logger.log("emailSent " + emailSent);
        Logger.log("row " + row);
        Logger.log("Email " + email);
        if (emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL && email != "") {  // Prevents sending duplicates
            var subject = "Registration " + options["EVENT_TITLE"];
            //if the user has a whole confirm draft
            if (script_registration_mail_name != "") {
                if (sendGmailRegisterTemplate(email, subject, row)) {
                    scriptRange.setValue(REGISTER_MAIL);
                } else {
                    Logger.log("error while sending mail");
                }
            }
            // Make sure the cell is updated right away in case the script is interrupted
            SpreadsheetApp.flush();
        }
    }
}
//Merge of looped email functions --------------------------------------------------------------------------------------------------------------------------------------------------------//
function Email() {
    var script_confirm_mail_name = getFieldValue('script_confirm_mail_name');
    var script_auto_confirm_mails = getFieldValue('script_auto_confirm_mails');
    var script_registration_mail_name = getFieldValue('script_registration_mail_name');
    var script_auto_registration_mails = getFieldValue('script_auto_registration_mails');
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    var script_extra_mail_name = getFieldValue('script_extra_mail_name');
    var script_extra_mail_on_pay = getFieldValue('script_extra_mail_on_pay');
    //redefine the datarange to the registerSheet values
    var dataRange = registerSheet.getRange(2, 1, registerSheet.getLastRow() - 1, script_form_fields_amount + 7); // let it read more columns than are being used, it might mess up otherwise
    // Fetch values for each row in the Range.
    var data = dataRange.getValues();
    var type = '';
    for (var i = 0; i < data.length; ++i) {
        var row = data[i];
        var emailSent = row[script_form_fields_amount + 5];
        var Email = getByName("Email", i + 1);
        if (emailSent != CONFIRM_MAIL && Email != "" && getByName("Paid", i + 1) == "yes" && script_confirm_mail_name != "") {
            type = 'confirmation';
            if (sendGmailTemplate(Email, i + 2, type))
                registerSheet.getRange(2 + i, script_form_fields_amount + 6).setValue(CONFIRM_MAIL);
        }
        if (emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL && Email != "" && script_registration_mail_name != "") {
            type = 'registration';
            if (sendGmailTemplate(Email, i + 2, type))
                registerSheet.getRange(2 + i, script_form_fields_amount + 6).setValue(REGISTER_MAIL);
        }
        emailSent = row[script_form_fields_amount + 6];
        if (emailSent != EXTRA_MAIL && Email != "" && script_extra_mail_name != "") {
            type = 'extra';
            if (script_extra_mail_on_pay == "yes") {
                if (getByName("Paid", i + 1) == "yes") {
                    if (sendGmailExtraTemplate(Email, i + 2, type))
                        registerSheet.getRange(2 + i, script_form_fields_amount + 7).setValue(EXTRA_MAIL);
                }
            } else {
                if (sendGmailExtraTemplate(Email, i + 2, type))
                    registerSheet.getRange(2 + i, script_form_fields_amount + 7).setValue(EXTRA_MAIL);
            }
        }
    }
    SpreadsheetApp.flush();
}
//sends an email to all participants when clicking extra email button --------------------------------------------------------------------------------------------------------------------------------------------------------//
function sendExtraEmail() {
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    var script_extra_mail_name = getFieldValue('script_extra_mail_name');
    var script_extra_mail_on_pay = getFieldValue('script_extra_mail_on_pay');
    var dataRange = registerSheet.getRange(1, 1, registerSheet.getLastRow() - 1, script_form_fields_amount + 8); // let it read more columns than are being used, it might mess up otherwise
    // Fetch values for each row in the Range.
    var data = dataRange.getValues();
    for (var i = 1; i < data.length; ++i) {
        row = data[i];
        var emailSent = row[script_form_fields_amount + 7];     // Third column
        if (emailSent != EXTRA_MAIL && getByName("Email", i) != "") {  // Prevents sending duplicates
            var subject = event_title;
            if (script_extra_mail_name != "") {
                if (script_extra_mail_on_pay == "yes") {
                    if (getByName("Paid", i) == "yes") {
                        if (sendGmailExtraTemplate(getByName("Email", i), subject, i)) {
                            registerSheet.getRange(1 + i, script_form_fields_amount + 8).setValue(EXTRA_MAIL);
                        }
                    }
                } else {
                    if (sendGmailExtraTemplate(getByName("Email", i), subject, i))
                        registerSheet.getRange(1 + i, script_form_fields_amount + 8).setValue(EXTRA_MAIL);
                }
            }
            // Make sure the cell is updated right away in case the script is interrupted
            SpreadsheetApp.flush();
        }
    }
}
//loops over all participants, sends registration email if not sent yet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function registerEmail() {
    var script_registration_mail_name = getFieldValue('script_registration_mail_name');
    var script_auto_registration_mails = getFieldValue('script_auto_registration_mails');
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    if (script_auto_registration_mails == "yes") {
        var dataRange = registerSheet.getRange(1, 1, registerSheet.getLastRow() - 1, script_form_fields_amount + 8); // let it read more columns than are being used, it might mess up otherwise
        // Fetch values for each row in the Range.
        var data = dataRange.getValues();
        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            var emailSent = row[script_form_fields_amount + 6];     // Third column
            if (emailSent != REGISTER_MAIL && emailSent != CONFIRM_MAIL && getByName("Email", i) != "") {  // Prevents sending duplicates
                var subject = "Registration " + getFieldValue('event_title');
                if (script_registration_mail_name != "") {
                    if (sendGmailRegisterTemplate(getByName("Email", i), subject, i))
                        registerSheet.getRange(1 + i, script_form_fields_amount + 7).setValue(REGISTER_MAIL);
                }
                // Make sure the cell is updated right away in case the script is interrupted
                SpreadsheetApp.flush();
            }
        }
    }
}
//loops over all participants, sends confirmation email if paid and if not sent yet --------------------------------------------------------------------------------------------------------------------------------------------------------//
function confirmationEmail() {
    var script_confirm_mail_name = getFieldValue('script_confirm_mail_name');
    var script_auto_confirm_mails = getFieldValue('script_auto_confirm_mails');
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    if (script_auto_confirm_mails == "yes") {
        //redefine the datarange to the registerSheet values
        var dataRange = registerSheet.getRange(1, 1, registerSheet.getLastRow() - 1, script_form_fields_amount + 8); // let it read more columns than are being used, it might mess up otherwise
        // Fetch values for each row in the Range.
        var data = dataRange.getValues();
        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            var emailSent = row[script_form_fields_amount + 6];     // column where we can check if the user already got an email
            if (emailSent != CONFIRM_MAIL && getByName("Email", i) != "" && getByName("Paid", i) == "yes") {  // Prevents sending duplicates
                var subject = "Confirmation " + getFieldValue('event_title');
                //if the user has a whole confirm draft
                if (script_confirm_mail_name != "") {
                    if (sendGmailConfirmTemplate(getByName("Email", i), subject, i))
                        registerSheet.getRange(1 + i, script_form_fields_amount + 7).setValue(CONFIRM_MAIL);
                }
                // Make sure the cell is updated right away in case the script is interrupted
                SpreadsheetApp.flush();
            }
        }
    }
}
//merge of sendconfirmGmailTemplate, sendRegisterGmailTemplate, sendExtraGmailTemplate --------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailTemplate(recipient, i, type, options) {
    var script_confirm_mail_name = getFieldValue('script_confirm_mail_name');
    var script_auto_confirm_mails = getFieldValue('script_auto_confirm_mails');
    var script_registration_mail_name = getFieldValue('script_registration_mail_name');
    var script_auto_registration_mails = getFieldValue('script_auto_registration_mails');
    var script_form_fields_amount = getFieldValue('script_form_fields_amount');
    var script_extra_mail_name = getFieldValue('script_extra_mail_name');
    var script_extra_mail_on_pay = getFieldValue('script_extra_mail_on_pay');
    options = options || {};  // default is no options
    var draftsubject = '';
    var drafts = GmailApp.getDraftMessages();
    var found = false;
    var subject;
    //Choose which email template to use based on the type of email you're sending
    switch (type) {
        case 'confirmation':
            draftsubject = script_confirm_mail_name;
            subject = 'Confirmation ' + getFieldValue('event_title');
            break;
        case 'registration':
            draftsubject = script_registration_mail_name;
            subject = 'Registration ' + getFieldValue('event_title');
            if (script_register_on_pay == "yes") {
                var paymentmethod = getByName("Payment method", i);
                draftsubject = draftsubject + "_" + paymentmethod;
            }
            break;
        case 'extra':
            draftsubject = script_extra_mail_name;
            subject = event_title;
            break;
    }
    for (var y = 0; y < drafts.length && !found; y++) {
        if (drafts[y].getSubject() == draftsubject) {
            found = true;
            var template = drafts[y];
        }
    }
    if (!found) throw new Error("TEMPLATE not found in drafts folder");
    // Generate htmlBody from template, with provided text body
    var imgUpdates = updateInlineImages(template);
    var message = imgUpdates.templateBody;
    message = replaceTerms(message, i);
    options.htmlBody = message;
    options.attachments = imgUpdates.attachments;
    options.inlineImages = imgUpdates.inlineImages;
    var body = message;
    return GmailApp.sendEmail(recipient, subject, body, options);
}
//constructs registration email and sends it --------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailRegisterTemplate(recipient, subject, row, mail_options) {
    var draftsubject = options["REG_MAIL_NAME"];
    if (options["REG_MAIL_PAYMENTTYPE"]) {
        var paymentmethod = getByNameRow("Payment method", row);
        draftsubject = draftsubject + "_" + paymentmethod;
    }
    return sendGmailTemplate(recipient, subject, row, mail_options, draftsubject);
}
//constructs extra email template and sends it --------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailExtraTemplate(recipient, subject, i, options) {
    return sendGmailTemplate(recipient, subject, i, mail_options, options["EXTRA_MAIL_NAME"]);
}
//constructs confirmation email template and sends it --------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
* Insert the given email body text into an email template, and send
* it to the indicated recipient. The template is a draft message with
* the subject "TEMPLATE"; if the template message is not found, an
* exception will be thrown. The template must contain text indicating
* where email content should be placed: {BODY}.
*
* @param {String} recipient  Email address to send message to.
* @param {String} subject    Subject line for email.
* @param {String} body       Email content, may be plain text or HTML.
* @param {Object} options    (optional) Options as supported by GmailApp.
*
* @returns        GmailApp   the Gmail service, useful for chaining
*/
function sendGmailConfirmTemplate(recipient, subject, row, mail_options) {
    return sendGmailTemplate(recipient, subject, row, mail_options, options["CONF_MAIL_NAME"]);
}

function sendGmailTemplate(recipient, subject, row, mail_options, draftsubject) {
    mail_options = mail_options || {};  // default is no options

    if (!existsDraft(draftsubject)) throw new Error("TEMPLATE not found in drafts folder: " + draftsubject);
    var template = readDraft(draftsubject)

    // Generate htmlBody from template, with provided text body
    var imgUpdates = updateInlineImages(template);
    var message = imgUpdates.templateBody;
    message = replaceTerms(message, row);
    mail_options.htmlBody = message;
    mail_options.attachments = imgUpdates.attachments;
    mail_options.inlineImages = imgUpdates.inlineImages;
    var body = message;
    return GmailApp.sendEmail(recipient, subject, body, mail_options);
}

//fixes any attachments or pictures in email template --------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
* @param   {GmailMessage} template  Message to use as template
* @returns {Object}                 An object containing the updated
*                                   templateBody, attachments and inlineImages.
*/
function updateInlineImages(template) {
    //////////////////////////////////////////////////////////////////////////////
    // Get inline images and make sure they stay as inline images
    //////////////////////////////////////////////////////////////////////////////
    var templateBody = template.getBody();
    var rawContent = template.getRawContent();
    var attachments = template.getAttachments();
    var regMessageId = new RegExp(template.getId(), "g");
    if (templateBody.match(regMessageId) != null) {
        var inlineImages = {};
        var nbrOfImg = templateBody.match(regMessageId).length;
        var imgVars = templateBody.match(/<img[^>]+>/g);
        var imgToReplace = [];
        if (imgVars != null) {
            for (var i = 0; i < imgVars.length; i++) {
                if (imgVars[i].search(regMessageId) != -1) {
                    var id = imgVars[i].match(/realattid=([^&]+)&/);
                    if (id != null) {
                        var temp = rawContent.split(id[1])[1];
                        temp = temp.substr(temp.lastIndexOf('Content-Type'));
                        var imgTitle = temp.match(/name="([^"]+)"/);
                        if (imgTitle != null) imgToReplace.push([imgTitle[1], imgVars[i], id[1]]);
                    }
                }
            }
        }
        for (var i = 0; i < imgToReplace.length; i++) {
            for (var j = 0; j < attachments.length; j++) {
                if (attachments[j].getName() == imgToReplace[i][0]) {
                    inlineImages[imgToReplace[i][2]] = attachments[j].copyBlob();
                    attachments.splice(j, 1);
                    var newImg = imgToReplace[i][1].replace(/src="[^\"]+\"/, "src=\"cid:" + imgToReplace[i][2] + "\"");
                    templateBody = templateBody.replace(imgToReplace[i][1], newImg);
                }
            }
        }
    }
    var updatedTemplate = {
        templateBody: templateBody,
        attachments: attachments,
        inlineImages: inlineImages
    }
    return updatedTemplate;
}
//Replace Terms in Email --------------------------------------------------------------------------------------------------------------------------------------------------------//
function replaceTerms(message, row) {
    var columnrange = registerSheet.getRange(1, 1, 1, registerSheet.getLastColumn());
    var columnvalues = columnrange.getValues();

    message = replaceConfVars(message);
    message = replaceTemplateKey(message, "PRICE", calculatePrice(row));

    for (var j = 0; j < columnvalues[0].length; j++) {
        var key = columnvalues[0][j];
        if (key != null) {
            message = replaceTemplateKey(message, key, getByNameRow(columnvalues[0][j], row));
        }
    }
    return message;
}
/**
* creates the draft mails according to the names in the fields 
*/
function createDraftMails() {
    var script_registration_mail_name = options["REG_MAIL_NAME"];
    var script_confirm_mail_name = options["CONF_MAIL_NAME"];
    var script_extra_mail_name = options["EXTRA_MAIL_NAME"];

    var payment_methods = [];
    var questions = getAllQuestions();
    for each(var question in questions) {
        if (question.title == "Payment method") {
            payment_methods = question.options;
        }
    }
    Logger.log(payment_methods);

    if (script_confirm_mail_name != "" && !existsDraft(script_confirm_mail_name, drafts)) {
        GmailApp.createDraft("", script_confirm_mail_name, "", { htmlBody: "Confirm email" });
    }
    if (script_extra_mail_name != "" && !existsDraft(script_extra_mail_name, drafts)) {
        GmailApp.createDraft("", script_extra_mail_name, "", { htmlBody: "Extra email" });
    }
    if (script_registration_mail_name != "") {
        if (options["REG_MAIL_PAYMENTTYPE"]) {
            // payment specific email
            for each(var payment in payment_methods) {
                var subject = script_registration_mail_name + "_" + payment;
                if (!existsDraft(subject, drafts)) {
                    GmailApp.createDraft("", subject, "", { htmlBody: "Fill Payment info " + payment });
                }
            }
        } else {
            GmailApp.createDraft("", script_registration_mail_name, "", { htmlBody: "Registration email " });
        }
    }
}
/**
 * check if hte given subject exists in the list of draft mails
 * drafts = GmailApp.getDraftMessages();
 * */
function existsDraft(subject) {
    for each(var draft in drafts) {
        if (draft.getSubject() == subject) {
            return true;
        }
    }
    return false;
}



function readDraft(draft_name) {
    for (var i = 0; i < drafts.length; ++i) {
        //Logger.log(drafts[i].getMessage().getSubject());
        if (drafts[i].getSubject() == draft_name) {
            return drafts[i];
        }
    }
}

function replaceTemplateVars(html_body) {
    var replaced = "";
    return replaced;
}
function sendMail(email_to, subject, html_body) {
    MailApp.sendEmail({
        to: email_to,
        subject: subject,
        htmlBody: html_body
    });
}

// test code

function testMailSend() {
    sendMail("bernhard@buddynetwork.at", "testsubject", readDraft("Generic_Confirmation"));
}